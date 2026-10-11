import SwiftData
import SwiftUI

/// Runs a queue of practices one after another (a single practice or the full routine).
struct PracticeRunView: View {
    let run: PracticeRun
    @EnvironmentObject private var settings: AppSettings
    @Environment(\.dismiss) private var dismiss
    @State private var index = 0

    var body: some View {
        let practice = run.queue[index]
        let next = index + 1 < run.queue.count ? run.queue[index + 1] : nil
        TimerScreen(
            practice: practice,
            minutes: settings.minutes(for: practice),
            bellMinutes: settings.bellMinutes(for: practice),
            startBell: settings.startBell,
            step: run.queue.count > 1 ? (index + 1, run.queue.count) : nil,
            next: next,
            onNext: { index += 1 },
            onClose: { dismiss() }
        )
        .id(index)
    }
}

struct TimerScreen: View {
    enum SaveState: Equatable {
        case none, saving, saved(toHealth: Bool), discarded
    }

    let practice: Practice
    let step: (Int, Int)?
    let next: Practice?
    let onNext: () -> Void
    let onClose: () -> Void

    @EnvironmentObject private var settings: AppSettings
    @EnvironmentObject private var health: HealthKitManager
    @Environment(\.modelContext) private var context
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var timer: SessionTimer
    @State private var saveState: SaveState = .none
    @State private var showEndDialog = false
    @State private var closeAfterEnding = false
    @State private var showVideo = false

    init(practice: Practice, minutes: Int, bellMinutes: Int, startBell: Bool, step: (Int, Int)?,
         next: Practice?, onNext: @escaping () -> Void, onClose: @escaping () -> Void) {
        self.practice = practice
        self.step = step
        self.next = next
        self.onNext = onNext
        self.onClose = onClose
        _timer = StateObject(wrappedValue: SessionTimer(
            practice: practice, minutes: minutes, intervalBellMinutes: bellMinutes, startBell: startBell))
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    header
                    ring
                    controls
                    if timer.state == .finished { completionCard }
                    if practice.videoID != nil { videoCard }
                    guidanceCard
                }
                .padding()
            }
            .background(practice.color.opacity(0.06).ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { requestClose() }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
        .interactiveDismissDisabled(timer.state == .running || timer.state == .paused)
        .sensoryFeedback(.success, trigger: timer.state) { _, new in new == .finished }
        .confirmationDialog("End \(practice.title)?", isPresented: $showEndDialog, titleVisibility: .visible) {
            Button("Save \(timer.elapsed.durationLabel)") {
                timer.endEarly()
                logSession()
                if closeAfterEnding { onClose() }
            }
            .disabled(timer.elapsed < 1)
            Button("Discard", role: .destructive) {
                timer.endEarly()
                saveState = .discarded
                if closeAfterEnding { onClose() }
            }
            Button("Keep going", role: .cancel) {}
        }
        .onChange(of: timer.state) {
            UIApplication.shared.isIdleTimerDisabled = settings.keepScreenAwake && timer.state == .running
            if timer.state == .finished && !timer.endedEarly && saveState == .none {
                logSession()
            }
        }
        .onChange(of: scenePhase) {
            if scenePhase == .active { timer.tick() }
        }
        .onDisappear {
            UIApplication.shared.isIdleTimerDisabled = false
            timer.cancel()
        }
    }

    // MARK: Sections

    private var header: some View {
        VStack(spacing: 8) {
            PracticeIcon(practice: practice, size: 56)
            if let step {
                Text("Step \(step.0) of \(step.1)").font(.caption.weight(.semibold)).foregroundStyle(.secondary)
            }
            Text(practice.title).font(.title.bold())
            Text(practice.subtitle).foregroundStyle(.secondary)
        }
    }

    private var ring: some View {
        ProgressRing(progress: timer.progress, color: practice.color, lineWidth: 16) {
            VStack(spacing: 6) {
                Text(timer.remaining.clockString)
                    .font(.system(size: 56, weight: .light, design: .rounded))
                    .monospacedDigit()
                    .contentTransition(.numericText())
                if timer.state == .idle {
                    HStack(spacing: 20) {
                        adjustButton("minus", delta: -60)
                        Text("\(Int(timer.duration / 60)) min").font(.headline).monospacedDigit()
                        adjustButton("plus", delta: 60)
                    }
                } else {
                    Text("of \(timer.duration.durationLabel)").foregroundStyle(.secondary)
                }
                let bell = settings.bellMinutes(for: practice)
                if bell > 0 {
                    Label("Bell every \(bell) min", systemImage: "bell")
                        .font(.caption).foregroundStyle(.secondary)
                }
            }
        }
        .frame(width: 280, height: 280)
    }

    private func adjustButton(_ symbol: String, delta: TimeInterval) -> some View {
        Button {
            timer.duration = min(180 * 60, max(60, timer.duration + delta))
        } label: {
            Image(systemName: "\(symbol).circle.fill").font(.title2)
        }
        .tint(practice.color)
    }

    @ViewBuilder
    private var controls: some View {
        switch timer.state {
        case .idle:
            Button {
                Task { await NotificationManager.shared.requestAuthorization() }
                timer.start()
            } label: {
                Label("Begin", systemImage: "play.fill").frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .tint(practice.color)

        case .running, .paused:
            HStack(spacing: 12) {
                Button {
                    timer.state == .running ? timer.pause() : timer.start()
                } label: {
                    Label(timer.state == .running ? "Pause" : "Resume",
                          systemImage: timer.state == .running ? "pause.fill" : "play.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(practice.color)

                Button {
                    closeAfterEnding = false
                    showEndDialog = true
                } label: {
                    Label("End", systemImage: "stop.fill").frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .tint(practice.color)
            }
            .controlSize(.large)

        case .finished:
            EmptyView()
        }
    }

    private var completionCard: some View {
        VStack(spacing: 12) {
            switch saveState {
            case .none, .saving:
                ProgressView("Saving…")
            case .saved(let toHealth):
                Label("Logged \(timer.elapsed.durationLabel)", systemImage: "checkmark.seal.fill")
                    .font(.headline).foregroundStyle(.green)
                if toHealth {
                    Label("Saved to Apple Health as \(practice.healthLabel)", systemImage: "heart.fill")
                        .font(.subheadline).foregroundStyle(.pink)
                } else {
                    Text(health.lastError ?? "Not saved to Apple Health. You can retry from History.")
                        .font(.caption).foregroundStyle(.secondary).multilineTextAlignment(.center)
                }
            case .discarded:
                Label("Session discarded", systemImage: "xmark.circle").foregroundStyle(.secondary)
            }

            if let next {
                Button(action: onNext) {
                    Label("Next: \(next.title)", systemImage: "arrow.right.circle.fill").frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(next.color)
                .controlSize(.large)
                .disabled(saveState == .saving)
            }
            Button(next == nil ? "Done" : "Finish for now", action: onClose)
                .buttonStyle(.bordered)
                .controlSize(.large)
                .disabled(saveState == .saving)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(.background, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var videoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Guided video", systemImage: "play.rectangle.fill").font(.headline)
                Spacer()
                if let url = practice.videoURL {
                    Link(destination: url) {
                        Label("YouTube", systemImage: "arrow.up.right.square")
                    }
                    .font(.subheadline)
                }
            }
            if showVideo, let id = practice.videoID {
                YouTubePlayerView(videoID: id)
                    .aspectRatio(16 / 9, contentMode: .fit)
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            } else {
                Button {
                    showVideo = true
                } label: {
                    Label("Play here alongside the timer", systemImage: "play.circle").frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .tint(practice.color)
            }
        }
        .padding()
        .background(.background, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var guidanceCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("How to practise", systemImage: "info.circle").font(.headline)
            ForEach(practice.guidance, id: \.self) { line in
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Circle().fill(practice.color).frame(width: 6, height: 6)
                    Text(line).font(.subheadline)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.background, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    // MARK: Actions

    private func requestClose() {
        if timer.state == .running || timer.state == .paused {
            closeAfterEnding = true
            showEndDialog = true
        } else {
            onClose()
        }
    }

    private func logSession() {
        guard let interval = timer.practicedInterval else {
            saveState = .discarded
            return
        }
        saveState = .saving
        let record = SessionRecord(practice: practice, start: interval.start, end: interval.end)
        context.insert(record)
        try? context.save()
        Task {
            await health.sync(record, in: context)
            saveState = .saved(toHealth: record.isSyncedToHealth)
        }
    }
}
