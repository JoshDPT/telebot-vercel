import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

import { dailyRun, sub, users, addCsv, start, getScore } from './commands';
import { handleMessage } from './text';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.start(start());

bot.command('sub', sub());
bot.command('users', users());
bot.command('addcsv', addCsv());
bot.command('dailyrun', dailyRun());
bot.command('score', getScore());

bot.command('simple', (ctx) => {
  return ctx.replyWithHTML(
    '<b>Coke</b> or <i>Pepsi?</i>',
    Markup.keyboard(['Coke', 'Pepsi']),
  );
});

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Pepsi', 'Pepsi'),
    ]),
  });
});

bot.on(message('text'), handleMessage());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
