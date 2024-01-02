import { Telegraf } from 'telegraf';
const { message } = require('telegraf/filters');

import { sub, users } from './commands';
import { handleMessage } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { addCsv } from './commands/addCsv';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('start', sub());
bot.command('sub', sub());
bot.command('users', users());
bot.command('addCsv', addCsv());
bot.on(message('text'), handleMessage());

// bot.on('message', greeting());
// bot.start((ctx) => ctx.reply('Welcome'));
// bot.help((ctx) => ctx.reply('Send me a sticker'));
// bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
