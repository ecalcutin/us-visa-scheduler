import { bot } from "./telegram";
import * as CONSTANTS from "../constants";

export const sendErrorNotification = async (error: unknown) => {
  import("serialize-error").then(async (serializer) => {
    await bot.telegram.sendMessage(
      CONSTANTS.CHAT_ID,
      `<b>Ошибка</b><pre>${error}</pre>`,
      {
        parse_mode: "HTML",
      }
    );
    await bot.telegram.sendMessage(
      CONSTANTS.DEV_CHAT_ID,
      `<b>Ошибка</b><pre>${error}</pre>`,
      {
        parse_mode: "HTML",
      }
    );
  });
};
