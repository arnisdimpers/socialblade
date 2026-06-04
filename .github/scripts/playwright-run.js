#!/usr/bin/env node
const { chromium } = require("playwright");

async function main() {
  const url = process.argv[2];
  const maxPoll = parseInt(process.argv[3] || "15", 10);
  const pollDelay = parseInt(process.argv[4] || "1", 10) * 1000;
  if (!url) {
    console.error(
      "Usage: node playwright-run.js <url> [maxPoll] [pollDelaySec]",
    );
    process.exit(2);
  }

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  let success = false;
  for (let attempt = 1; attempt <= maxPoll; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    } catch (e) {
      // ignore navigation errors and retry
    }
    const html = await page.content();
    if (html && html.indexOf("Last snapshot:") !== -1) {
      console.log(`Attempt ${attempt}: found 'Last snapshot:'`);
      success = true;
      break;
    }
    console.log(`Attempt ${attempt}: not ready, sleeping ${pollDelay}ms`);
    await page.waitForTimeout(pollDelay);
  }

  if (!success) {
    await browser.close();
    console.error("Page did not indicate completion");
    process.exit(1);
  }

  // keep page open for 20s to allow any async work
  console.log("Page finished; waiting 20s before closing");
  await page.waitForTimeout(20000);
  await browser.close();
  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal error in playwright-run:", e);
  process.exit(1);
});
