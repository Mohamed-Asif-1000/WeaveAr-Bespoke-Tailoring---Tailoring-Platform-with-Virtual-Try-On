import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Viewport matrix covering the real-world device range:
 * small Android, iPhone SE through Pro Max, iPad portrait/landscape,
 * laptops and desktop. Each entry becomes a Playwright project so every
 * route is exercised at every width.
 */
const VIEWPORTS = [
  { name: "320-mobile-min", width: 320, height: 568 },
  { name: "360-android", width: 360, height: 740 },
  { name: "390-iphone", width: 390, height: 844 },
  { name: "414-pixel", width: 414, height: 896 },
  { name: "768-ipad-portrait", width: 768, height: 1024 },
  { name: "1024-ipad-landscape", width: 1024, height: 768 },
  { name: "1280-laptop", width: 1280, height: 800 },
  { name: "1440-laptop-lg", width: 1440, height: 900 },
  { name: "1920-desktop", width: 1920, height: 1080 },
] as const;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // Each worker holds a full Chromium plus the decoded bitmaps of every image on
  // the page under test. The library was re-encoded from 12.9 MB / ~844 MB
  // decoded down to 3.6 MB / ~88 MB decoded, but the try-on route still pulls in
  // a TensorFlow.js model, so over-subscribing memory still shows up as
  // "Target crashed" rather than a useful failure.
  //
  // Local runs default to a single worker. On a 4 GB / 4-core machine three
  // workers starved the memory pool badly enough that the dev server was killed
  // partway through the run; every later test then failed on
  // `net::ERR_CONNECTION_REFUSED` against 127.0.0.1:4173, which reads like a
  // mass layout regression but is only a dead port. One worker runs the full
  // 180-test matrix in ~21 minutes without that failure mode. CI runners have
  // more headroom and still use two.
  workers: process.env.CI ? 2 : 1,
  timeout: 150_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "./test-results",

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    navigationTimeout: 60_000,
    // The try-on route calls getUserMedia; give it a fake camera so the
    // page renders its real layout instead of the permission-error branch.
    permissions: ["camera"],
  },

  projects: VIEWPORTS.map((vp) => ({
    name: vp.name,
    use: {
      ...devices["Desktop Chrome"],
      // Use the full Chromium build rather than the stripped headless shell so
      // layout, canvas and media behave exactly as they do in a real browser.
      channel: "chromium",
      viewport: { width: vp.width, height: vp.height },
      launchOptions: {
        args: [
          "--use-fake-ui-for-media-stream",
          "--use-fake-device-for-media-stream",
          "--disable-dev-shm-usage",
          "--js-flags=--max-old-space-size=2048",
        ],
      },
    },
  })),

  // The dev server renders the same layout in about a second, so the responsive
  // suite runs against it rather than waiting on a production build.
  // `npm run build` is verified separately.
  webServer: {
    // Pin the host: on Windows `localhost` resolves to ::1 first, and Vite's
    // default bind would leave the IPv4 address the harness polls unanswered.
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
