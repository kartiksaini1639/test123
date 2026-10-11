import Foundation

enum Stats {
    /// Days (start of day) on which every practice in `routine` was done at least once.
    static func completeDays(_ sessions: [SessionRecord], routine: [Practice]) -> Set<Date> {
        let required = Set(routine)
        guard !required.isEmpty else { return [] }
        let calendar = Calendar.current
        var byDay: [Date: Set<Practice>] = [:]
        for session in sessions {
            guard let practice = session.practice else { continue }
            byDay[calendar.startOfDay(for: session.start), default: []].insert(practice)
        }
        return Set(byDay.filter { required.isSubset(of: $0.value) }.keys)
    }

    /// Consecutive complete days ending today (or yesterday, if today isn't done yet).
    static func currentStreak(_ days: Set<Date>) -> Int {
        let calendar = Calendar.current
        var day = calendar.startOfDay(for: .now)
        if !days.contains(day), let yesterday = calendar.date(byAdding: .day, value: -1, to: day) {
            day = yesterday
        }
        var count = 0
        while days.contains(day) {
            count += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: day) else { break }
            day = previous
        }
        return count
    }

    static func bestStreak(_ days: Set<Date>) -> Int {
        let calendar = Calendar.current
        var best = 0
        var run = 0
        var previous: Date?
        for day in days.sorted() {
            if let previous, calendar.date(byAdding: .day, value: 1, to: previous) == day {
                run += 1
            } else {
                run = 1
            }
            best = max(best, run)
            previous = day
        }
        return best
    }

    static func minutes(_ sessions: [SessionRecord]) -> Double {
        sessions.reduce(0) { $0 + $1.duration } / 60
    }
}

extension TimeInterval {
    /// "m:ss" clock format, rounding up so a countdown never shows 0:00 early.
    var clockString: String {
        let total = Int(rounded(.up))
        return String(format: "%d:%02d", total / 60, total % 60)
    }

    /// Short human label such as "15 min" or "40 sec".
    var durationLabel: String {
        if self < 60 { return "\(Int(rounded())) sec" }
        return "\(Int((self / 60).rounded())) min"
    }
}
