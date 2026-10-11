import SwiftData
import SwiftUI
import UserNotifications

@main
struct SadhanaApp: App {
    @StateObject private var settings = AppSettings()
    @StateObject private var health = HealthKitManager()

    init() {
        UNUserNotificationCenter.current().delegate = NotificationManager.shared
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(settings)
                .environmentObject(health)
        }
        .modelContainer(for: SessionRecord.self)
    }
}

struct RootView: View {
    @EnvironmentObject private var health: HealthKitManager
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        TabView {
            TodayView()
                .tabItem { Label("Today", systemImage: "sun.horizon") }
            HistoryView()
                .tabItem { Label("History", systemImage: "chart.bar") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .onChange(of: scenePhase) {
            if scenePhase == .active { Task { await health.refreshToday() } }
        }
    }
}
