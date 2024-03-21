import { chromium } from "playwright";

export const getBrowser = async () => {
  const browser = await chromium.launch({ headless: true });
  return browser;
};
