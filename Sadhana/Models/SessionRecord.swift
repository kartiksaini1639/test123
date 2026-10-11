import Foundation
import SwiftData

/// A completed practice session stored on device.
@Model
final class SessionRecord {
    @Attribute(.unique) var uuid: UUID
    var practiceRaw: String
    var start: Date
    var end: Date
    /// UUID of the matching Apple Health sample/workout, when saved to Health.
    var healthSampleID: UUID?

    init(practice: Practice, start: Date, end: Date) {
        self.uuid = UUID()
        self.practiceRaw = practice.rawValue
        self.start = start
        self.end = end
        self.healthSampleID = nil
    }

    var practice: Practice? { Practice(rawValue: practiceRaw) }
    var duration: TimeInterval { end.timeIntervalSince(start) }
    var isSyncedToHealth: Bool { healthSampleID != nil }
}
