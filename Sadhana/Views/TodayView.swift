import SwiftData
import SwiftUI

struct PracticeRun: Identifiable {
    let id = UUID()
    let queue: [Practice]
}

struct TodayView: View {
    @EnvironmentObject private var settings: AppSettings
    @EnvironmentObject private var health: HealthKitManager
    @Query(sort: \SessionRecord.start, order: .reverse) private var sessions: [SessionRecord]
    @State private var activeRun: PracticeRun?

    private var todaysSessions: [SessionRecord] {
        sessions.filter { Calendar.current.isDateInToday($0.start) }
    }

    private var doneToday: Set<Practice> {
        Set(todaysSessions.compactMap(\.practice))
    }

    private var routine: [Practice] { settings.routinePractices }
    private var routineDone: Int { routine.filter(doneToday.contains).count }

    private var streak: Int {
        Stats.currentStreak(Stats.completeDays(sessions, routine: routine))
    }

    var body: some View {
        NavigationStack {
            List {
                Section { summary }

                if health.isAvailable && health.needsAuthorization {
                    Section {
                        Button {
                            Task { await health.requestAuthorization() }
                        } label: {
                            Label("Connect Apple Health", systemImage: "heart.fill")
                                .foregroundStyle(.pink)
                        }
                    } footer: {
                        Text("Meditations are saved as Mindful Minutes and yoga as a Yoga workout.")
                    }
                }

                if !routine.isEmpty {
                    Section {
                        Button {
                            let remaining = routine.filter { !doneToday.contains($0) }
                            activeRun = PracticeRun(queue: remaining.isEmpty ? routine : remaining)
                        } label: {
                            Label(routineDone == 0 ? "Start daily routine" :
                                    routineDone == routine.count ? "Practise the routine again" : "Continue routine",
                                  systemImage: "play.circle.fill")
                                .font(.headline)
                        }
                    } footer: {
                        Text(routine.map(\.title).joined(separator: " → "))
                    }
                }

                Section("Practices") {
                    ForEach(Practice.allCases) { practice in
                        Button {
                            activeRun = PracticeRun(queue: [practice])
                        } label: {
                            practiceRow(practice)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .navigationTitle("Today")
            .fullScreenCover(item: $activeRun) { run in
                PracticeRunView(run: run)
            }
            .task { await health.refreshToday() }
        }
    }

    private var summary: some View {
        HStack(spacing: 20) {
            ProgressRing(progress: routine.isEmpty ? 0 : Double(routineDone) / Double(routine.count),
                         color: .orange, lineWidth: 10) {
                VStack(spacing: 0) {
                    Text("\(routineDone)/\(routine.count)").font(.title3.bold()).monospacedDigit()
                    Text("done").font(.caption2).foregroundStyle(.secondary)
                }
            }
            .frame(width: 84, height: 84)

            VStack(alignment: .leading, spacing: 10) {
                Text(Date.now.formatted(.dateTime.weekday(.wide).day().month()))
                    .font(.headline)
                HStack {
                    StatTile(value: "\(streak)", label: "day streak", symbol: "flame.fill", tint: .orange)
                    StatTile(value: "\(Int(Stats.minutes(todaysSessions).rounded()))", label: "min today",
                             symbol: "clock.fill", tint: .indigo)
                }
                if let mindful = health.todayMindfulMinutes {
                    Label("\(Int(mindful.rounded())) Mindful Minutes in Health", systemImage: "heart.fill")
                        .font(.caption)
                        .foregroundStyle(.pink)
                }
            }
        }
        .padding(.vertical, 6)
    }

    private func practiceRow(_ practice: Practice) -> some View {
        let practiced = todaysSessions.filter { $0.practice == practice }
        return HStack(spacing: 12) {
            PracticeIcon(practice: practice)
            VStack(alignment: .leading, spacing: 2) {
                Text(practice.title).font(.body.weight(.semibold))
                Text(practiced.isEmpty
                     ? "\(settings.minutes(for: practice)) min · \(practice.subtitle)"
                     : "Done · \(Stats.minutes(practiced).rounded().formatted()) min today")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: practiced.isEmpty ? "play.circle" : "checkmark.circle.fill")
                .font(.title2)
                .foregroundStyle(practiced.isEmpty ? Color.secondary : Color.green)
        }
        .contentShape(Rectangle())
        .padding(.vertical, 2)
    }
}
