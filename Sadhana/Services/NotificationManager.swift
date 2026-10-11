import Foundation
import UserNotifications

/// Local notifications: timer alerts while the app is in the background, and the daily reminder.
final class NotificationManager: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationManager()

    private let center = UNUserNotificationCenter.current()
    private let timerPrefix = "timer."
    private let reminderID = "daily.reminder"
    private var timerIDs: [String] = []

    @discardableResult
    func requestAuthorization() async -> Bool {
        (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
    }

    func scheduleTimerAlerts(title: String, endDate: Date, bellDates: [Date]) {
        cancelTimerAlerts()
        add(id: "\(timerPrefix)end", title: "\(title) complete 🙏",
            body: "Open Sadhana to log your session to Apple Health.", at: endDate)
        for (index, date) in bellDates.prefix(30).enumerated() {
            add(id: "\(timerPrefix)bell.\(index)", title: title, body: "Interval bell", at: date)
        }
    }

    func cancelTimerAlerts() {
        guard !timerIDs.isEmpty else { return }
        center.removePendingNotificationRequests(withIdentifiers: timerIDs)
        center.removeDeliveredNotifications(withIdentifiers: timerIDs)
        timerIDs = []
    }

    private func add(id: String, title: String, body: String, at date: Date) {
        let interval = date.timeIntervalSinceNow
        guard interval > 0.5 else { return }
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: interval, repeats: false)
        center.add(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
        timerIDs.append(id)
    }

    func updateDailyReminder(enabled: Bool, time: Date) async {
        center.removePendingNotificationRequests(withIdentifiers: [reminderID])
        guard enabled, await requestAuthorization() else { return }
        let content = UNMutableNotificationContent()
        content.title = "Time for your sadhana"
        content.body = "Kapalbhati, Tumo, Om, Shunya and Yoga are waiting for you."
        content.sound = .default
        let components = Calendar.current.dateComponents([.hour, .minute], from: time)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
        try? await center.add(UNNotificationRequest(identifier: reminderID, content: content, trigger: trigger))
    }

    // The app rings its own bell in the foreground, so timer alerts stay silent there.
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        if notification.request.identifier.hasPrefix(timerPrefix) {
            completionHandler([])
        } else {
            completionHandler([.banner, .sound])
        }
    }
}
