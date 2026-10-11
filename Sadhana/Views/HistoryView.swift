import Charts
import SwiftData
import SwiftUI

struct HistoryView: View {
    @EnvironmentObject private var settings: AppSettings
    @EnvironmentObject private var health: HealthKitManager
    @Environment(\.modelContext) private var context
    @Query(sort: \SessionRecord.start, order: .reverse) private var sessions: [SessionRecord]
    @State private var showManualLog = false

    private struct DayMinutes: Identifiable {
        let day: Date
        let practice: Practice
        let minutes: Double
        var id: String { "\(day.timeIntervalSince1970)-\(practice.rawValue)" }
    }

    private var completeDays: Set<Date> {
        Stats.completeDays(sessions, routine: settings.routinePractices)
    }

    private var lastTwoWeeks: [DayMinutes] {
        let calendar = Calendar.current
        guard let cutoff = calendar.date(byAdding: .day, value: -13, to: calendar.startOfDay(for: .now)) else { return [] }
        var totals: [Date: [Practice: Double]] = [:]
        for session in sessions where session.start >= cutoff {
            guard let practice = session.practice else { continue }
            totals[calendar.startOfDay(for: session.start), default: [:]][practice, default: 0] += session.duration / 60
        }
        return totals.flatMap { day, byPractice in
            byPractice.map { DayMinutes(day: day, practice: $0.key, minutes: $0.value) }
        }
    }

    private var weekMinutes: Double {
        let start = Calendar.current.date(byAdding: .day, value: -6, to: Calendar.current.startOfDay(for: .now)) ?? .now
        return Stats.minutes(sessions.filter { $0.start >= start })
    }

    private var days: [(day: Date, sessions: [SessionRecord])] {
        let grouped = Dictionary(grouping: sessions) { Calendar.current.startOfDay(for: $0.start) }
        return grouped.keys.sorted(by: >).map { ($0, grouped[$0] ?? []) }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack {
                        StatTile(value: "\(Stats.currentStreak(completeDays))", label: "current streak",
                                 symbol: "flame.fill", tint: .orange)
                        StatTile(value: "\(Stats.bestStreak(completeDays))", label: "best streak",
                                 symbol: "trophy.fill", tint: .yellow)
                        StatTile(value: "\(Int(weekMinutes.rounded()))", label: "min, last 7 days",
                                 symbol: "clock.fill", tint: .indigo)
                    }
                    .padding(.vertical, 4)
                } footer: {
                    Text("A streak day means every practice in your daily routine was completed.")
                }

                Section("Last 14 days") {
                    Chart(lastTwoWeeks) { item in
                        BarMark(
                            x: .value("Day", item.day, unit: .day),
                            y: .value("Minutes", item.minutes)
                        )
                        .foregroundStyle(by: .value("Practice", item.practice.title))
                    }
                    .chartForegroundStyleScale(
                        domain: Practice.allCases.map(\.title),
                        range: Practice.allCases.map(\.color)
                    )
                    .chartXAxis {
                        AxisMarks(values: .stride(by: .day, count: 2)) { _ in
                            AxisGridLine()
                            AxisValueLabel(format: .dateTime.day().month(.narrow))
                        }
                    }
                    .chartYAxisLabel("min")
                    .frame(height: 220)
                    .padding(.vertical, 8)
                }

                if sessions.isEmpty {
                    ContentUnavailableView("No sessions yet", systemImage: "leaf",
                                           description: Text("Complete a practice and it will appear here."))
                }

                ForEach(days, id: \.day) { day in
                    Section {
                        ForEach(day.sessions) { session in
                            row(session)
                        }
                        .onDelete { offsets in
                            delete(offsets.map { day.sessions[$0] })
                        }
                    } header: {
                        HStack {
                            Text(day.day.formatted(.dateTime.weekday(.wide).day().month()))
                            Spacer()
                            if completeDays.contains(day.day) {
                                Label("Complete", systemImage: "checkmark.seal.fill").foregroundStyle(.green)
                            }
                        }
                    }
                }
            }
            .navigationTitle("History")
            .toolbar {
                Button {
                    showManualLog = true
                } label: {
                    Label("Log session", systemImage: "plus")
                }
            }
            .sheet(isPresented: $showManualLog) {
                ManualLogView()
            }
        }
    }

    private func row(_ session: SessionRecord) -> some View {
        HStack(spacing: 12) {
            if let practice = session.practice {
                PracticeIcon(practice: practice, size: 32)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(session.practice?.title ?? session.practiceRaw).font(.subheadline.weight(.semibold))
                Text("\(session.start.formatted(date: .omitted, time: .shortened)) · \(session.duration.durationLabel)")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if session.isSyncedToHealth {
                Image(systemName: "heart.fill").foregroundStyle(.pink)
                    .accessibilityLabel("Saved to Apple Health")
            } else if health.isAvailable {
                Button {
                    Task { await health.sync(session, in: context) }
                } label: {
                    Label("Save to Health", systemImage: "heart")
                        .labelStyle(.iconOnly)
                }
                .buttonStyle(.borderless)
                .tint(.pink)
            }
        }
    }

    private func delete(_ records: [SessionRecord]) {
        for record in records {
            if let id = record.healthSampleID, let practice = record.practice {
                Task { await health.deleteFromHealth(id: id, practice: practice) }
            }
            context.delete(record)
        }
        try? context.save()
    }
}

struct ManualLogView: View {
    @EnvironmentObject private var settings: AppSettings
    @EnvironmentObject private var health: HealthKitManager
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @State private var practice: Practice = .kapalbhati
    @State private var start = Date.now.addingTimeInterval(-30 * 60)
    @State private var minutes = Practice.kapalbhati.defaultMinutes
    @State private var isSaving = false

    var body: some View {
        NavigationStack {
            Form {
                Picker("Practice", selection: $practice) {
                    ForEach(Practice.allCases) { Text($0.title).tag($0) }
                }
                DatePicker("Started", selection: $start, in: ...Date.now)
                Stepper("\(minutes) min", value: $minutes, in: 1...180)
            }
            .navigationTitle("Log a session")
            .navigationBarTitleDisplayMode(.inline)
            .onChange(of: practice) { minutes = settings.minutes(for: practice) }
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save", action: save).disabled(isSaving)
                }
            }
        }
    }

    private func save() {
        isSaving = true
        let length = TimeInterval(minutes * 60)
        // Keep the session in the past; Health rejects samples that end in the future.
        let begin = min(start, Date.now.addingTimeInterval(-length))
        let record = SessionRecord(practice: practice, start: begin, end: begin.addingTimeInterval(length))
        context.insert(record)
        try? context.save()
        Task {
            await health.sync(record, in: context)
            dismiss()
        }
    }
}
