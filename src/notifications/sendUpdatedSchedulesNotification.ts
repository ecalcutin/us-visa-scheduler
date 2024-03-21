import { bot } from "./telegram";
import * as CONSTANTS from "../constants";
type Data = {
  readonly oldDates: Array<{ date: string }>;
  readonly newDates: Array<{ date: string }>;
};

export const sendUpdatedSchedulesNotification = async (
  data: Data
): Promise<void> => {
  await bot.telegram.sendMessage(
    CONSTANTS.CHANNEL_ID,
    `
<b>Обновление расписания</b>
Доступные даты

${data.newDates.map(({ date }) => `${date}`).join("\n")}`,
    { parse_mode: "HTML" }
  );
};
