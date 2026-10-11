import SwiftUI
import WebKit

/// Embedded YouTube player so you can follow a video while the timer runs.
struct YouTubePlayerView: UIViewRepresentable {
    let videoID: String

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.allowsPictureInPictureMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.isScrollEnabled = false
        webView.isOpaque = false
        webView.backgroundColor = .black
        // YouTube requires an identifying referrer for embeds; the bundle ID is the recommended origin for apps.
        let origin = "https://\(Bundle.main.bundleIdentifier ?? "com.kartiksaini.sadhana")"
        webView.loadHTMLString(html, baseURL: URL(string: origin))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    private var html: String {
        """
        <!doctype html>
        <html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>html,body{margin:0;height:100%;background:#000}iframe{position:absolute;inset:0;width:100%;height:100%;border:0}</style>
        </head><body>
        <iframe src="https://www.youtube.com/embed/\(videoID)?playsinline=1&rel=0&modestbranding=1"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </body></html>
        """
    }
}
