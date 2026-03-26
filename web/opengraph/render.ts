import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const INPUT = resolve(__dirname, "og.html");
const OUTPUT = resolve(__dirname, "og.png");

async function render() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });

  await page.goto(`file://${INPUT}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: OUTPUT, type: "png" });
  await browser.close();

  console.log(`Saved ${OUTPUT}`);
}

render();
