import { bot } from "./telegram";
import * as CONSTANTS from "../constants";

export const sendEmptyDatesNotification = async (): Promise<void> => {
  await bot.telegram.sendMessage(
    CONSTANTS.CHANNEL_ID,
    `<b>Обновление расписания</b>
    Доступных слотов нет`,
    {
      parse_mode: "HTML",
    }
  );
};
