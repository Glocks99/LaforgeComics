import { useEffect } from "react";

/**
 * Dynamically updates browser UI colors (theme-color + iOS Safari bar)
 * and page background to prevent white flashes or mismatched areas.
 * Works for Android Chrome, iOS Safari, and macOS Safari.
 */
export const useDynamicThemeColor = (darkmode: boolean) => {
  useEffect(() => {
    // Define your theme colors
    const defaultColor = "#123";     // your base background
    const darkColor = "#0f172a";     // dark mode background (e.g. Tailwind slate-900)
    

    // Determine which color to apply
    const selectedColor = darkmode ? darkColor : defaultColor;

    // === Update <meta name="theme-color"> (Chrome, Android, Safari 15+)
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute("content", selectedColor);

    // === Update <meta name="apple-mobile-web-app-status-bar-style"> (iOS)
    let iosMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!iosMeta) {
      iosMeta = document.createElement("meta");
      iosMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(iosMeta);
    }
    iosMeta.setAttribute("content", darkmode ? "black-translucent" : "default");

    // === Update background color of <body> and <html>
    document.body.style.backgroundColor = selectedColor;
    document.documentElement.style.backgroundColor = selectedColor;

    // === Add overscroll behavior fix to avoid white rubber-band effect
    document.body.style.overscrollBehaviorY = "none";
    document.body.style.backgroundAttachment = "fixed";

    // === Ensure full height coverage (in case no scroll content)
    document.documentElement.style.minHeight = "100vh";
    document.body.style.minHeight = "100vh";

  }, [darkmode]);
};
