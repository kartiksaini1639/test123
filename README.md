# Sadhana 🪷

Time and track your daily meditation and yoga practice, and save every session to **Apple Health**.

There are two versions:

- **Web app (`docs/`)**: install it from Safari, no Mac needed. **Start here.**
- **Native iOS app (`Sadhana/`)**: SwiftUI + HealthKit. Needs a Mac with Xcode (see below).

## 📱 Install the web app on your iPhone

1. **Turn on GitHub Pages (one time):** go to the repo's **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, pick the branch this app is on (`claude/sadhana-ios-app`, or `main` after merging) and the **`/docs`** folder, then press **Save**. After about a minute the app is live at **https://kartiksaini1639.github.io/test123/**.
2. Open that link in **Safari** on your iPhone.
3. Tap **Share** (the square with an arrow) → **Add to Home Screen** → **Add**.
4. Open **Sadhana** from your Home Screen. It runs full-screen like a normal app and works offline.

### Connect Apple Health (one time, about 2 minutes)

A web app can't write to Apple Health directly, so it uses two tiny Apple Shortcuts. The full steps are in **Settings → Apple Health** inside the app:

| Shortcut name | Action | Settings |
|---|---|---|
| `Sadhana Mindful` | **Log Health Sample** | Type **Mindful Minutes**, value = **Shortcut Input** (minutes) |
| `Sadhana Yoga` | **Log Workout** | Type **Yoga**, duration = **Shortcut Input** (minutes) |

Then turn on **Save sessions to Apple Health** in the app. After each session, tap **Save to Apple Health**: the shortcut runs and you swipe back to Sadhana.

### What's inside

- **Today**: a progress ring for your routine, your day streak, minutes today and a 7-day strip. **Begin today's practice** runs Kapalbhati → Tumo → Om → Shunya → Yoga back to back, skipping any you've already done today.
- **Timer**: a breathing gradient orb, a countdown ring, a singing-bowl bell at the start and end, and optional interval bells (good for Tumo rounds). The screen stays awake while it runs. Time stays correct if you leave the app, and the session survives the app being closed.
- **Guided videos**: your YouTube guides play inside the timer screen.
- **History**: current and best streak, minutes this week, a 14-day chart by practice and a 5-week consistency calendar. Tap any session to resend it to Health or delete it, and use **+** to log a session you did without the timer.
- **Settings**: duration, interval bell and routine membership for each practice, plus backup export and import.

Known web-app limits on iPhone: the bell can't ring while the app is in the background (it rings when you return), and reminders have to be set up as a Shortcuts automation (steps in Settings). Data is stored on the phone. Use **Export backup** now and then.

---

## Native iOS app (SwiftUI)

| Practice | Default | Saved in Apple Health as | Guide |
|---|---|---|---|
| Kapalbhati | 5 min | Mindful Minutes | [video](https://youtu.be/DsJYHWHGL-U) |
| Tumo Breathing | 15 min | Mindful Minutes | [video](https://youtu.be/A-bm1KKOCvU) |
| Om Chanting | 10 min | Mindful Minutes | none |
| Shunya Meditation | 20 min | Mindful Minutes | [video](https://youtu.be/GGjnxceYs60) |
| Yoga | 30 min | Yoga workout | [video](https://youtu.be/oDP-89wRXUk) |

## Features

- **Today**: a progress ring for your daily routine, your day streak, and minutes practised today (including Mindful Minutes Health has from any app).
- **Daily routine**: one tap runs every practice back to back (Kapalbhati → Tumo → Om → Shunya → Yoga). If you already did some today, it picks up where you left off.
- **Timer**: a countdown with a synthesised singing-bowl bell at the start, optional interval bells (handy for Tumo rounds), and three strikes at the end. It plays even with the silent switch on, keeps the screen awake, and keeps time correctly in the background, where notifications stand in for the bell.
- **Guided videos**: play the YouTube guide inside the app beside the timer, or open it in YouTube.
- **Apple Health**: meditations are saved as Mindful Sessions and yoga as a Yoga workout. Deleting a session in the app also removes it from Health.
- **History**: current and best streak, a 14-day stacked chart by practice, a day-by-day log, a retry button for sessions not yet saved to Health, and **+** to log a session you did without the timer.
- **Settings**: duration, interval bell and routine membership for each practice, a daily reminder notification, and Health connection status.

Session history stays on your iPhone (SwiftData); Apple Health gets a copy of each session.

## Running it on your iPhone

Requirements: a Mac with **Xcode 16+**, an iPhone on **iOS 17+**, and an Apple ID. A free account works for installing on your own phone, but the app expires after 7 days and must be reinstalled.

```bash
brew install xcodegen
git clone <this repo> && cd test123
xcodegen generate        # creates Sadhana.xcodeproj
open Sadhana.xcodeproj
```

In Xcode:

1. Select the **Sadhana** target → **Signing & Capabilities** → choose your **Team**. If the bundle ID `com.kartiksaini.sadhana` is taken, change it to something unique.
2. Check that the **HealthKit** capability is listed. It comes from `project.yml`; if it's missing, add it with **+ Capability**.
3. Plug in your iPhone, select it as the run destination, and press **⌘R**.
4. On the phone, if iOS asks, trust the developer under *Settings → General → VPN & Device Management*, and turn on Developer Mode.
5. Open the app, tap **Connect Apple Health**, and allow Mindful Minutes and Workouts.

> The Simulator has HealthKit, but it's best to test on a real device.

## Project layout

```
project.yml                  XcodeGen spec (Info.plist keys + HealthKit entitlement)
Sadhana/App                  App entry + tab bar
Sadhana/Models               Practice definitions, SwiftData record, streak stats
Sadhana/Services             HealthKit, timer engine, bell synth, notifications, settings
Sadhana/Views                Today, Timer, History, Settings, YouTube player
```

To change a practice's name, default length, video or guidance text, edit `Sadhana/Models/Practice.swift`.

## Safety

Kapalbhati and Tumo-style breathing are intense. Practise them seated or lying down, on an empty stomach. Never do them in water, while driving or while standing. Check with a doctor first if you are pregnant or have heart problems, high blood pressure or epilepsy.
