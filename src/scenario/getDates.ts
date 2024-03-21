import { Page, type Browser, type BrowserContext } from "playwright";

import type { Credential, Schedule } from "../interfaces";
import * as CONSTANTS from "../constants";

type Opts = {
  readonly page: Page;
  readonly browser: Browser;
} & Credential;

export const getDates = async (
  options: Opts
): Promise<{ dates: Schedule[]; email: string }> => {
  const page: Page = options.page;
  await page.goto("https://ais.usvisa-info.com/en-am/niv");
  if (!(await page.getByText("User Account:").isVisible())) {
    // Need auth
    await page.getByRole("link", { name: "Continue" }).click();
    await page.fill("#user_email", options.email);
    await page.fill("#user_password", options.password);
    await page.getByText("I have read and understood").click();
    await page.getByRole("button", { name: "Sign In" }).click();
  }
  await page.getByRole("link", { name: "Continue" }).click();
  await page.getByRole("tab", { name: " Reschedule Appointment" }).click();
  await page.getByRole("link", { name: "Reschedule Appointment" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  const response = await page.waitForResponse(
    /\/schedule\/\d+\/appointment\/days\/\d+.json.*/,
    { timeout: CONSTANTS.FAILURE_LOCATOR_TIME }
  );

  /**
   * TODO:
   * Check account country by URL RegEXP
   * https://ais.usvisa-info.com/en-am/niv/groups/39744398 -> en-am -> am -> Armenia
   */

  const dates = await response.json();
  await page.close();
  // await options.context.close();
  return { dates, email: options.email };
};
