import { Telegraf } from "telegraf";


const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
  // Chat ID ctx.message.chat.id

  return ctx.reply("Welcome");
});

export { bot };
