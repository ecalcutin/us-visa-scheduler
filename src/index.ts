import { getDates } from "./scenario";
import { getBrowser } from "./helpers";
import { ScheduleHash, updateSchedule } from "./storage";

import read from "./read";
import {
  bot,
  sendErrorNotification,
  sendEmptyDatesNotification,
  sendUpdatedSchedulesNotification,
} from "./notifications";

import * as CONSTANTS from "./constants";
import { wait } from "./wait";

const boot = async () => {
  bot.launch();

  const user = {
    email: process.env.ACCOUNT_EMAIL,
    password: process.env.ACCOUNT_PASSWORD
  }

  const browser = await getBrowser();
  const context = await browser.newContext();

  const task = {
    ...user,
    page: await context.newPage(),
    browser,
  };

  let iterator: number = 1;
  let isFail: boolean = false;
  let failureWaitTime: number = CONSTANTS.FAILURE_WAIT_TIME;

  while (true) {
    try {
      // Begin iteration
      console.log(`Iteration [${iterator}]...`);

      const schedules = await getDates(task);
      const record = await ScheduleHash.findOne({
        country: "am",
      }).lean();

      const hasPrevDates = record && !!record?.hash;
      const isSameResult =
        hasPrevDates && record?.hash === JSON.stringify(schedules);

      // LOGS
      // console.log({ hasPrevDates });
      // console.log({ isSameResult });
      // console.log("hash: ", record?.hash);
      // console.log(JSON.stringify(schedules));
      // END LOGS

      // Если приходит пустой массив с датами, значит слотов нет.
      if (schedules.dates.length === 0) {
        await sendEmptyDatesNotification();
        await updateSchedule(schedules);
        continue;
      }

      // Если есть предыдущий хеш и он различается с текущим
      if (hasPrevDates && !isSameResult) {
        // Update results in DB
        await sendUpdatedSchedulesNotification({
          newDates: schedules.dates,
          oldDates: hasPrevDates ? JSON.parse(record.hash).dates : [],
        });
      }
      // Обновляем БД
      await updateSchedule(schedules);

      // Сбрасываем таймер ошибок на начальное значение
      failureWaitTime = CONSTANTS.FAILURE_WAIT_TIME;
      // Обнуляем флаг ошибки
      isFail = false;
      await task.page.close();
    } catch (e) {
      console.error(e);
      await sendErrorNotification(e);
      // Если в предыдущей итерации была ошибка, увеличиваем таймер
      if (isFail) {
        failureWaitTime += failureWaitTime / 2;
      } else isFail = true;
    } finally {
      if (isFail) {
        await wait(failureWaitTime);
      } else await wait(CONSTANTS.WAIT_TIME);
      task.page = await context.newPage();
      iterator++;
    }
  }
};

boot();
