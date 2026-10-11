# Sadhana 🪷

An iPhone app that times and tracks your daily meditation and yoga practice, and saves every session to **Apple Health**.

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
