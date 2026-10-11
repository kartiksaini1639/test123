import SwiftUI

struct PracticeIcon: View {
    let practice: Practice
    var size: CGFloat = 40

    var body: some View {
        Image(systemName: practice.symbol)
            .font(.system(size: size * 0.45, weight: .semibold))
            .foregroundStyle(.white)
            .frame(width: size, height: size)
            .background(practice.color.gradient, in: RoundedRectangle(cornerRadius: size * 0.28, style: .continuous))
    }
}

struct ProgressRing<Content: View>: View {
    let progress: Double
    let color: Color
    var lineWidth: CGFloat = 12
    @ViewBuilder var content: Content

    var body: some View {
        ZStack {
            Circle().stroke(color.opacity(0.18), lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: progress)
                .stroke(color.gradient, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.linear(duration: 0.25), value: progress)
            content
        }
    }
}

struct StatTile: View {
    let value: String
    let label: String
    var symbol: String? = nil
    var tint: Color = .accentColor

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                if let symbol { Image(systemName: symbol).foregroundStyle(tint) }
                Text(value).font(.title2.bold()).monospacedDigit()
            }
            Text(label).font(.caption).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
