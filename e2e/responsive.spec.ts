import { test, expect, type Page } from "@playwright/test";

/**
 * Every route in the app. Auth-gated and state-dependent routes are
 * reachable because the zustand `persist` keys are seeded in `addInitScript`.
 */
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/collections/shirts", name: "shirts" },
  { path: "/category/artisanal-shirt", name: "category-shirts" },
  { path: "/category/bespoke-suit", name: "category-suits-locked" },
  { path: "/product/oxford-white", name: "product" },
  { path: "/fabric-selection/oxford-white", name: "fabric-selection" },
  { path: "/measurements/oxford-white", name: "measurements-choose" },
  { path: "/measurements/manual/oxford-white", name: "measurements-manual" },
  { path: "/measurements/review/oxford-white", name: "measurements-review" },
  { path: "/final-review/oxford-white", name: "final-review" },
  { path: "/cart", name: "cart" },
  { path: "/wishlist", name: "wishlist" },
  { path: "/login", name: "login" },
  { path: "/checkout", name: "checkout" },
  { path: "/dashboard", name: "dashboard" },
  { path: "/try-on-preview/oxford-white", name: "try-on" },
  { path: "/definitely-not-a-route", name: "not-found" },
] as const;

const SEEDED_USER = {
  name: "Asif Mohamed",
  email: "asif@example.com",
  phone: "+91 98765 43210",
};

const SEEDED_CART = {
  items: [
    {
      productId: "oxford-white",
      name: "Oxford White",
      image: "",
      unitPrice: 2999,
      fabricName: "Egyptian Cotton Poplin",
      fabricPrice: 500,
      fit: "Regular",
      measurements: {
        chest: "100",
        shoulderWidth: "46",
        sleeveLength: "62",
        neck: "39",
        waist: "82",
        hip: "96",
        shirtLength: "74",
        armhole: "24",
      },
      quantity: 1,
    },
  ],
};

const SEEDED_ORDERS = {
  orders: [
    {
      id: "WEV-100001",
      placedAt: new Date("2026-01-15T10:00:00.000Z").toISOString(),
      items: [
        {
          productId: "classic-blue",
          name: "Classic Blue",
          image: "",
          quantity: 1,
          unitPrice: 3499,
          fabricName: "Oxford Weave Cotton",
          fit: "Slim",
        },
      ],
      subtotal: 3499,
      deliveryFee: 199,
      total: 3698,
      shippingAddress: {
        id: "seed",
        label: "Home",
        firstName: "Asif",
        lastName: "Mohamed",
        address: "12 Tailor Lane",
        city: "Chennai",
        postalCode: "600001",
        phone: "+91 98765 43210",
        isDefault: true,
      },
      status: "In Tailoring",
      timeline: [{ status: "Ordered", at: "2026-01-15T10:00:00.000Z" }],
      userEmail: SEEDED_USER.email,
    },
  ],
};

async function seedState(page: Page) {
  await page.addInitScript(
    ([user, cart, orders]) => {
      const put = (key: string, state: unknown) =>
        window.localStorage.setItem(
          key,
          JSON.stringify({ state, version: 0 })
        );
      put("weavear-auth", {
        user,
        addresses: [],
        isAuthenticated: true,
        registeredAccounts: {
          [user.email]: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: "demo",
          },
        },
      });
      put("weavear-cart", cart);
      put("weavear-orders", orders);
    },
    [SEEDED_USER, SEEDED_CART, SEEDED_ORDERS] as const
  );
}

/** Walk the whole page so every ScrollTrigger fires and resolves. */
async function settleAnimations(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.9);
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 100));
  });
  await page.waitForTimeout(500);
}

/**
 * TensorFlow.js pulls a MoveNet graph from a remote host. In a test browser
 * that costs hundreds of megabytes and can take the whole tab down with it, so
 * the try-on route is checked for layout only, with the model blocked.
 */
async function blockPoseModel(page: Page) {
  await page.route(/(tfhub|storage\.googleapis\.com|models\.google)/, (r) =>
    r.abort()
  );
}

type OverflowReport = {
  scrollWidth: number;
  innerWidth: number;
  offenders: string[];
};

async function measureOverflow(page: Page): Promise<OverflowReport> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const innerWidth = window.innerWidth;
    const offenders: string[] = [];

    const describe = (el: Element): string => {
      const cls =
        typeof el.className === "string" && el.className.trim().length > 0
          ? `.${el.className.trim().split(/\s+/).slice(0, 4).join(".")}`
          : "";
      const id = el.id ? `#${el.id}` : "";
      const tag = el.tagName.toLowerCase();
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
      return `${tag}${id}${cls}${text ? ` "${text.slice(0, 32)}"` : ""}`;
    };

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue;
      if (style.display === "none" || style.visibility === "hidden") continue;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.right <= innerWidth + 1) continue;

      // Only blame elements that actually reach the page edge. A wide child
      // inside an `overflow: hidden` ancestor cannot produce a scrollbar, so
      // counting it would be noise.
      let clipped = false;
      for (
        let parent = el.parentElement;
        parent && parent !== document.body;
        parent = parent.parentElement
      ) {
        const parentStyle = getComputedStyle(parent);
        if (
          parentStyle.overflowX !== "visible" ||
          parentStyle.overflow !== "visible"
        ) {
          clipped = true;
          break;
        }
      }
      if (clipped) continue;

      offenders.push(`${describe(el)} right=${Math.round(rect.right)}`);
    }

    return {
      scrollWidth: doc.scrollWidth,
      innerWidth,
      offenders: offenders.slice(0, 6),
    };
  });
}

test.describe("responsive layout", () => {
  for (const route of ROUTES) {
    test(`${route.name} has no horizontal overflow`, async ({ page }) => {
      await seedState(page);
      if (route.name === "try-on") await blockPoseModel(page);

      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.ok(), `${route.path} should return a document`).toBe(
        true
      );

      await page
        .waitForLoadState("load", { timeout: 30_000 })
        .catch(() => undefined);
      await settleAnimations(page);

      // Re-measure once more in case a lazy image or late animation settled
      // the layout after the first pass.
      await page.waitForTimeout(400);
      const report = await measureOverflow(page);

      expect(
        report.offenders,
        report.offenders.length
          ? `${route.path} @ ${report.innerWidth}px overflows to ` +
              `${report.scrollWidth}px.\nOffenders:\n  ` +
              report.offenders.join("\n  ")
          : `${route.path} @ ${report.innerWidth}px overflows to ` +
              `${report.scrollWidth}px with no single culprit element.`
      ).toEqual([]);

      expect(
        report.scrollWidth,
        `${route.path} @ ${report.innerWidth}px: document scrollWidth ` +
          `${report.scrollWidth} exceeds viewport ${report.innerWidth}`
      ).toBeLessThanOrEqual(report.innerWidth + 1);
    });
  }
});

test.describe("layout sanity", () => {
  test("header is usable on the narrowest viewport", async ({ page }) => {
    await seedState(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load").catch(() => undefined);
    await settleAnimations(page);

    // The brand must not push the action icons off-screen.
    const header = page.locator("nav").first();
    const box = await header.boundingBox();
    expect(box, "header should be laid out").not.toBeNull();

    // Every interactive control in the header needs a usable tap target.
    const smallTargets = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      if (!nav) return [] as string[];
      const bad: string[] = [];
      for (const el of Array.from(
        nav.querySelectorAll<HTMLElement>("a,button")
      )) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.width < 24 || r.height < 24) {
          const label = (el.getAttribute("aria-label") ??
            el.textContent ??
            el.tagName)
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 24);
          bad.push(`${label} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return bad;
    });

    expect(
      smallTargets,
      `header controls under 24x24 in the header: ${smallTargets.join(", ")}`
    ).toEqual([]);
  });

  test("navigation is reachable below the lg breakpoint", async ({
    page,
  }) => {
    await seedState(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load").catch(() => undefined);

    const width = page.viewportSize()?.width ?? 0;
    const mainNav = page.locator("nav[aria-label='Main']");

    if (width >= 1024) {
      // Desktop: the inline nav is the only navigation and must be visible.
      await expect(
        mainNav.getByText("Collections", { exact: true })
      ).toBeVisible();
      return;
    }

    // Below lg the inline nav is hidden, so a toggle must exist and reveal the
    // links. Without this the site is unnavigable on any phone or tablet.
    const toggle = mainNav.getByRole("button", { name: "Menu" });
    await expect(toggle).toBeVisible();
    await expect(
      mainNav.getByText("Collections", { exact: true })
    ).toBeHidden();

    await toggle.click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Collections", { exact: true })).toBeVisible();
    await expect(drawer.getByText("Bespoke", { exact: true })).toBeVisible();
    await expect(
      drawer.getByRole("link", { name: /Virtual Try-On/ })
    ).toBeVisible();

    // The overlay must cover the page so the drawer reads as a modal.
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();

    // Escape must dismiss it, and focus must return to the trigger.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("no content is hidden behind mobile browser chrome", async ({
    page,
  }) => {
    await seedState(page);
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load").catch(() => undefined);
    await settleAnimations(page);

    // A 100vh section is taller than the real viewport on iOS/Android, which
    // pushes the footer out of reach. Assert the document itself fits dvh.
    const usesVh = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll("section"));
      return sections.some((s) => {
        const h = getComputedStyle(s).minHeight;
        return h.endsWith("vh");
      });
    });
    expect(
      usesVh,
      "sections should use min-h-dvh, not min-h-screen (100vh)"
    ).toBe(false);
  });
});
