import SwiftUI

/// User preferences, persisted in UserDefaults.
final class AppSettings: ObservableObject {
    private let defaults = UserDefaults.standard

    @Published private var minutes: [String: Int] {
        didSet { defaults.set(minutes, forKey: "minutes") }
    }
    @Published private var bells: [String: Int] {
        didSet { defaults.set(bells, forKey: "bells") }
    }
    @Published private var routine: [String: Bool] {
        didSet { defaults.set(routine, forKey: "routine") }
    }
    @Published var reminderEnabled: Bool {
        didSet { defaults.set(reminderEnabled, forKey: "reminderEnabled") }
    }
    @Published var reminderTime: Date {
        didSet { defaults.set(reminderTime, forKey: "reminderTime") }
    }
    @Published var keepScreenAwake: Bool {
        didSet { defaults.set(keepScreenAwake, forKey: "keepScreenAwake") }
    }
    @Published var startBell: Bool {
        didSet { defaults.set(startBell, forKey: "startBell") }
    }

    init() {
        minutes = defaults.dictionary(forKey: "minutes") as? [String: Int] ?? [:]
        bells = defaults.dictionary(forKey: "bells") as? [String: Int] ?? [:]
        routine = defaults.dictionary(forKey: "routine") as? [String: Bool] ?? [:]
        reminderEnabled = defaults.bool(forKey: "reminderEnabled")
        reminderTime = defaults.object(forKey: "reminderTime") as? Date
            ?? Calendar.current.date(bySettingHour: 6, minute: 0, second: 0, of: .now) ?? .now
        keepScreenAwake = defaults.object(forKey: "keepScreenAwake") as? Bool ?? true
        startBell = defaults.object(forKey: "startBell") as? Bool ?? true
    }

    func minutes(for practice: Practice) -> Int {
        minutes[practice.rawValue] ?? practice.defaultMinutes
    }

    /// Interval bell in minutes; 0 means off.
    func bellMinutes(for practice: Practice) -> Int {
        bells[practice.rawValue] ?? 0
    }

    func isInRoutine(_ practice: Practice) -> Bool {
        routine[practice.rawValue] ?? true
    }

    var routinePractices: [Practice] {
        Practice.allCases.filter(isInRoutine)
    }

    func minutesBinding(for practice: Practice) -> Binding<Int> {
        Binding(get: { self.minutes(for: practice) }, set: { self.minutes[practice.rawValue] = $0 })
    }

    func bellBinding(for practice: Practice) -> Binding<Int> {
        Binding(get: { self.bellMinutes(for: practice) }, set: { self.bells[practice.rawValue] = $0 })
    }

    func routineBinding(for practice: Practice) -> Binding<Bool> {
        Binding(get: { self.isInRoutine(practice) }, set: { self.routine[practice.rawValue] = $0 })
    }
}
