import Foundation
import HealthKit
import SwiftData

/// Writes practices to Apple Health: meditations as Mindful Sessions, yoga as Yoga workouts.
@MainActor
final class HealthKitManager: ObservableObject {
    enum HealthError: LocalizedError {
        case unavailable
        case workoutNotCreated

        var errorDescription: String? {
            switch self {
            case .unavailable: "Apple Health isn't available on this device."
            case .workoutNotCreated: "Apple Health didn't create the yoga workout."
            }
        }
    }

    let isAvailable = HKHealthStore.isHealthDataAvailable()
    @Published private(set) var todayMindfulMinutes: Double?
    @Published var lastError: String?

    private let store = HKHealthStore()
    private let mindfulType = HKCategoryType(.mindfulSession)
    private let workoutType = HKObjectType.workoutType()

    private func sampleType(for practice: Practice) -> HKSampleType {
        practice.healthCategory == .mindfulSession ? mindfulType : workoutType
    }

    func authorizationStatus(for practice: Practice) -> HKAuthorizationStatus {
        guard isAvailable else { return .sharingDenied }
        return store.authorizationStatus(for: sampleType(for: practice))
    }

    var needsAuthorization: Bool {
        isAvailable && Practice.allCases.contains { authorizationStatus(for: $0) == .notDetermined }
    }

    var isFullyAuthorized: Bool {
        isAvailable && Practice.allCases.allSatisfy { authorizationStatus(for: $0) == .sharingAuthorized }
    }

    func requestAuthorization() async {
        guard isAvailable else { return }
        do {
            try await store.requestAuthorization(
                toShare: Set<HKSampleType>([mindfulType, workoutType]),
                read: Set<HKObjectType>([mindfulType, workoutType])
            )
            lastError = nil
        } catch {
            lastError = error.localizedDescription
        }
        objectWillChange.send()
        await refreshToday()
    }

    /// Saves a session to Health and returns the UUID of the created sample.
    func save(practice: Practice, start: Date, end: Date) async throws -> UUID {
        guard isAvailable else { throw HealthError.unavailable }
        let metadata: [String: Any] = ["SadhanaPractice": practice.title]

        switch practice.healthCategory {
        case .mindfulSession:
            let sample = HKCategorySample(
                type: mindfulType,
                value: HKCategoryValue.notApplicable.rawValue,
                start: start,
                end: end,
                metadata: metadata
            )
            try await store.save(sample)
            return sample.uuid

        case .yogaWorkout:
            let configuration = HKWorkoutConfiguration()
            configuration.activityType = .yoga
            configuration.locationType = .indoor
            let builder = HKWorkoutBuilder(healthStore: store, configuration: configuration, device: .local())
            try await builder.beginCollection(at: start)
            try await builder.addMetadata(metadata)
            try await builder.endCollection(at: end)
            guard let workout = try await builder.finishWorkout() else { throw HealthError.workoutNotCreated }
            return workout.uuid
        }
    }

    /// Saves a local record to Health if it isn't there yet, asking for permission first if needed.
    func sync(_ record: SessionRecord, in context: ModelContext) async {
        guard isAvailable, record.healthSampleID == nil, let practice = record.practice else { return }
        if authorizationStatus(for: practice) == .notDetermined {
            await requestAuthorization()
        }
        do {
            record.healthSampleID = try await save(practice: practice, start: record.start, end: record.end)
            try? context.save()
            lastError = nil
        } catch {
            lastError = error.localizedDescription
        }
        await refreshToday()
    }

    func deleteFromHealth(id: UUID, practice: Practice) async {
        guard isAvailable else { return }
        do {
            _ = try await store.deleteObjects(of: sampleType(for: practice), predicate: HKQuery.predicateForObject(with: id))
        } catch {
            lastError = error.localizedDescription
        }
        await refreshToday()
    }

    /// Total Mindful Minutes recorded in Health today, from any app.
    func refreshToday() async {
        guard isAvailable else { return }
        let startOfDay = Calendar.current.startOfDay(for: .now)
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: .now)
        let descriptor = HKSampleQueryDescriptor(
            predicates: [.categorySample(type: mindfulType, predicate: predicate)],
            sortDescriptors: []
        )
        if let samples = try? await descriptor.result(for: store) {
            todayMindfulMinutes = samples.reduce(0) { $0 + $1.endDate.timeIntervalSince($1.startDate) } / 60
        }
    }
}
