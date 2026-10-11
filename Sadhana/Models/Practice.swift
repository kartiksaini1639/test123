import SwiftUI

/// Where a practice is recorded in Apple Health.
enum HealthCategory {
    /// Saved as a Mindful Session ("Mindful Minutes").
    case mindfulSession
    /// Saved as a Yoga workout.
    case yogaWorkout
}

/// The five daily practices tracked by the app.
enum Practice: String, CaseIterable, Identifiable, Codable, Hashable {
    case kapalbhati
    case tumo
    case omChanting
    case shunya
    case yoga

    var id: String { rawValue }

    var title: String {
        switch self {
        case .kapalbhati: "Kapalbhati"
        case .tumo: "Tumo Breathing"
        case .omChanting: "Om Chanting"
        case .shunya: "Shunya Meditation"
        case .yoga: "Yoga"
        }
    }

    var subtitle: String {
        switch self {
        case .kapalbhati: "Skull-shining breath"
        case .tumo: "Inner-fire breathing"
        case .omChanting: "Chanting the primordial sound"
        case .shunya: "Meditation on emptiness"
        case .yoga: "Asana practice"
        }
    }

    var symbol: String {
        switch self {
        case .kapalbhati: "wind"
        case .tumo: "flame"
        case .omChanting: "waveform"
        case .shunya: "circle.dashed"
        case .yoga: "figure.yoga"
        }
    }

    var color: Color {
        switch self {
        case .kapalbhati: .orange
        case .tumo: .red
        case .omChanting: .purple
        case .shunya: .indigo
        case .yoga: .teal
        }
    }

    /// YouTube video used as the guide for this practice.
    var videoID: String? {
        switch self {
        case .kapalbhati: "DsJYHWHGL-U"
        case .tumo: "A-bm1KKOCvU"
        case .omChanting: nil
        case .shunya: "GGjnxceYs60"
        case .yoga: "oDP-89wRXUk"
        }
    }

    var videoURL: URL? {
        videoID.flatMap { URL(string: "https://youtu.be/\($0)") }
    }

    var defaultMinutes: Int {
        switch self {
        case .kapalbhati: 5
        case .tumo: 15
        case .omChanting: 10
        case .shunya: 20
        case .yoga: 30
        }
    }

    var healthCategory: HealthCategory {
        self == .yoga ? .yogaWorkout : .mindfulSession
    }

    var healthLabel: String {
        switch healthCategory {
        case .mindfulSession: "Mindful Minutes"
        case .yogaWorkout: "Yoga workout"
        }
    }

    var guidance: [String] {
        switch self {
        case .kapalbhati:
            [
                "Sit tall with a relaxed face and shoulders, on an empty stomach.",
                "Take a comfortable breath in, then exhale sharply through the nose by snapping the belly in.",
                "Let the inhale happen passively. Keep a steady rhythm and rest between rounds.",
                "Skip or go gently if pregnant, or with high blood pressure, heart conditions, hernia or recent abdominal surgery.",
            ]
        case .tumo:
            [
                "Sit or lie down somewhere safe. Never practise in water, while driving, or standing.",
                "Breathe in deeply and let go, for around 30–40 breaths per round.",
                "After the last exhale, hold for as long as is comfortable, then inhale and hold briefly.",
                "Set an interval bell in Settings if you want a cue for each round.",
            ]
        case .omChanting:
            [
                "Sit comfortably with the spine upright and eyes gently closed.",
                "Inhale deeply, then chant A-U-M slowly, letting the M hum resonate.",
                "Rest in the silence after each chant before the next breath.",
            ]
        case .shunya:
            [
                "Settle into a comfortable seat and follow along with the guided video.",
                "Let thoughts arise and pass without engaging them.",
                "When the bell sounds, take a few moments before opening your eyes.",
            ]
        case .yoga:
            [
                "Follow along with the video and move within your comfortable range.",
                "Breathe smoothly through the nose and never force a pose.",
                "Your practice is saved to Apple Health as a Yoga workout.",
            ]
        }
    }

    // MARK: Settings keys

    var minutesKey: String { "minutes.\(rawValue)" }
    var bellKey: String { "bell.\(rawValue)" }
    var routineKey: String { "routine.\(rawValue)" }
}
