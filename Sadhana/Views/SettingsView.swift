import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var settings: AppSettings
    @EnvironmentObject private var health: HealthKitManager

    var body: some View {
        NavigationStack {
            Form {
                healthSection

                Section {
                    ForEach(Practice.allCases) { practice in
                        NavigationLink {
                            PracticeSettingsView(practice: practice)
                        } label: {
                            HStack(spacing: 12) {
                                PracticeIcon(practice: practice, size: 30)
                                Text(practice.title)
                                Spacer()
                                Text("\(settings.minutes(for: practice)) min").foregroundStyle(.secondary)
                            }
                        }
                    }
                } header: {
                    Text("Practices")
                } footer: {
                    Text("Set durations, interval bells, and which practices make up your daily routine.")
                }

                Section("Daily reminder") {
                    Toggle("Remind me to practise", isOn: $settings.reminderEnabled)
                    if settings.reminderEnabled {
                        DatePicker("Time", selection: $settings.reminderTime, displayedComponents: .hourAndMinute)
                    }
                }
                .onChange(of: settings.reminderEnabled) { updateReminder() }
                .onChange(of: settings.reminderTime) { updateReminder() }

                Section("Timer") {
                    Toggle("Keep screen awake", isOn: $settings.keepScreenAwake)
                    Toggle("Bell when starting", isOn: $settings.startBell)
                    Button("Test bell") { BellPlayer.shared.ring() }
                }
            }
            .navigationTitle("Settings")
        }
    }

    private var healthSection: some View {
        Section {
            if !health.isAvailable {
                Label("Apple Health isn't available on this device", systemImage: "heart.slash")
                    .foregroundStyle(.secondary)
            } else if health.isFullyAuthorized {
                Label("Connected to Apple Health", systemImage: "heart.fill").foregroundStyle(.pink)
            } else if health.needsAuthorization {
                Button {
                    Task { await health.requestAuthorization() }
                } label: {
                    Label("Connect Apple Health", systemImage: "heart")
                }
            } else {
                Label("Health access is off", systemImage: "heart.slash").foregroundStyle(.orange)
                Text("Turn it on in the Health app → Profile → Apps → Sadhana.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            if let error = health.lastError {
                Text(error).font(.caption).foregroundStyle(.red)
            }
        } header: {
            Text("Apple Health")
        } footer: {
            Text("Kapalbhati, Tumo, Om Chanting and Shunya are saved as Mindful Minutes. Yoga is saved as a Yoga workout.")
        }
    }

    private func updateReminder() {
        let enabled = settings.reminderEnabled
        let time = settings.reminderTime
        Task { await NotificationManager.shared.updateDailyReminder(enabled: enabled, time: time) }
    }
}

struct PracticeSettingsView: View {
    let practice: Practice
    @EnvironmentObject private var settings: AppSettings

    var body: some View {
        Form {
            Section {
                HStack(spacing: 14) {
                    PracticeIcon(practice: practice, size: 48)
                    VStack(alignment: .leading) {
                        Text(practice.title).font(.headline)
                        Text(practice.subtitle).font(.subheadline).foregroundStyle(.secondary)
                    }
                }
            }

            Section("Timer") {
                Stepper("Duration: \(settings.minutes(for: practice)) min",
                        value: settings.minutesBinding(for: practice), in: 1...180)
                Stepper(bellText, value: settings.bellBinding(for: practice), in: 0...30)
            }

            Section {
                Toggle("Part of daily routine", isOn: settings.routineBinding(for: practice))
            } footer: {
                Text("Your streak counts days on which every routine practice is completed.")
            }

            Section("Apple Health") {
                LabeledContent("Saved as", value: practice.healthLabel)
            }

            if let url = practice.videoURL {
                Section("Guide") {
                    Link(destination: url) {
                        Label("Watch on YouTube", systemImage: "play.rectangle.fill")
                    }
                }
            }
        }
        .navigationTitle(practice.title)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var bellText: String {
        let minutes = settings.bellMinutes(for: practice)
        return minutes == 0 ? "Interval bell: off" : "Interval bell: every \(minutes) min"
    }
}
