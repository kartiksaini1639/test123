import AVFoundation

/// Plays a synthesised singing-bowl bell. Uses the playback category so it rings
/// even with the silent switch on, mixing with any video that's playing.
final class BellPlayer {
    static let shared = BellPlayer()

    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private let buffer: AVAudioPCMBuffer?

    private init() {
        let format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 1)!
        buffer = Self.makeBell(format: format)
        engine.attach(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
    }

    func ring(strikes: Int = 1) {
        guard let buffer else { return }
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, options: [.mixWithOthers])
        try? session.setActive(true)
        if !engine.isRunning {
            do { try engine.start() } catch { return }
        }
        for _ in 0..<max(1, strikes) {
            player.scheduleBuffer(buffer, at: nil)
        }
        player.play()
    }

    private static func makeBell(format: AVAudioFormat) -> AVAudioPCMBuffer? {
        let sampleRate = format.sampleRate
        let seconds = 3.5
        let frameCount = AVAudioFrameCount(sampleRate * seconds)
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount),
              let data = buffer.floatChannelData?[0] else { return nil }
        buffer.frameLength = frameCount

        // Inharmonic partials (frequency ratio, amplitude, decay rate) give a bowl-like tone.
        let base = 330.0
        let partials: [(ratio: Double, amplitude: Double, decay: Double)] = [
            (1.0, 1.0, 0.9), (1.004, 0.6, 0.9), (2.71, 0.45, 1.6), (5.15, 0.22, 2.6), (8.43, 0.1, 3.6),
        ]
        for frame in 0..<Int(frameCount) {
            let t = Double(frame) / sampleRate
            let attack = min(1, t / 0.006)
            var sample = 0.0
            for partial in partials {
                sample += partial.amplitude * sin(2 * .pi * base * partial.ratio * t) * exp(-partial.decay * t)
            }
            data[frame] = Float(sample * attack * 0.22)
        }
        return buffer
    }
}
