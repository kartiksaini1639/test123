import Combine
import Foundation

/// Countdown timer for one practice. Time is derived from wall-clock dates,
/// so it stays accurate while the app is in the background.
final class SessionTimer: ObservableObject {
    enum State: Equatable {
        case idle, running, paused, finished
    }

    let practice: Practice
    let intervalBellMinutes: Int
    let startBell: Bool

    @Published var duration: TimeInterval
    @Published private(set) var state: State = .idle
    @Published private(set) var elapsed: TimeInterval = 0
    private(set) var completedAt: Date?
    private(set) var endedEarly = false

    private var accumulated: TimeInterval = 0
    private var resumedAt: Date?
    private var bellsRung = 0
    private var ticker: AnyCancellable?

    init(practice: Practice, minutes: Int, intervalBellMinutes: Int, startBell: Bool) {
        self.practice = practice
        self.duration = TimeInterval(minutes * 60)
        self.intervalBellMinutes = intervalBellMinutes
        self.startBell = startBell
    }

    var remaining: TimeInterval { max(0, duration - elapsed) }
    var progress: Double { duration > 0 ? min(1, elapsed / duration) : 0 }

    /// The span actually practised, excluding pauses.
    var practicedInterval: DateInterval? {
        guard let end = completedAt, accumulated >= 1 else { return nil }
        return DateInterval(start: end.addingTimeInterval(-accumulated), end: end)
    }

    func start() {
        guard state == .idle || state == .paused else { return }
        if state == .idle && startBell { BellPlayer.shared.ring() }
        resumedAt = Date()
        state = .running
        ticker = Timer.publish(every: 0.25, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in self?.tick() }
        scheduleAlerts()
    }

    func pause() {
        guard state == .running, let resumedAt else { return }
        accumulated += Date().timeIntervalSince(resumedAt)
        self.resumedAt = nil
        elapsed = accumulated
        ticker = nil
        state = .paused
        NotificationManager.shared.cancelTimerAlerts()
    }

    func endEarly() {
        if state == .running, let resumedAt {
            accumulated += Date().timeIntervalSince(resumedAt)
        }
        accumulated = min(accumulated, duration)
        resumedAt = nil
        ticker = nil
        elapsed = accumulated
        completedAt = Date()
        endedEarly = true
        state = .finished
        NotificationManager.shared.cancelTimerAlerts()
    }

    /// Stops everything without recording (e.g. the screen was closed).
    func cancel() {
        ticker = nil
        resumedAt = nil
        if state != .finished { NotificationManager.shared.cancelTimerAlerts() }
    }

    func tick() {
        guard state == .running, let resumedAt else { return }
        let now = Date()
        let current = accumulated + now.timeIntervalSince(resumedAt)

        if current >= duration {
            let end = resumedAt.addingTimeInterval(duration - accumulated)
            accumulated = duration
            elapsed = duration
            self.resumedAt = nil
            ticker = nil
            completedAt = end
            state = .finished
            NotificationManager.shared.cancelTimerAlerts()
            // Only ring if we're here to hear it; otherwise the notification already sounded.
            if now.timeIntervalSince(end) < 3 { BellPlayer.shared.ring(strikes: 3) }
            return
        }

        elapsed = current
        if intervalBellMinutes > 0 {
            let interval = TimeInterval(intervalBellMinutes * 60)
            let due = Int(current / interval)
            if due > bellsRung {
                bellsRung = due
                if current - TimeInterval(due) * interval < 3 { BellPlayer.shared.ring() }
            }
        }
    }

    private func scheduleAlerts() {
        guard let resumedAt else { return }
        let end = resumedAt.addingTimeInterval(duration - accumulated)
        var bells: [Date] = []
        if intervalBellMinutes > 0 {
            let interval = TimeInterval(intervalBellMinutes * 60)
            var index = bellsRung + 1
            while TimeInterval(index) * interval < duration - 1 {
                bells.append(resumedAt.addingTimeInterval(TimeInterval(index) * interval - accumulated))
                index += 1
            }
        }
        NotificationManager.shared.scheduleTimerAlerts(title: practice.title, endDate: end, bellDates: bells)
    }
}
