import { Context } from 'telegraf';
import createDebug from 'debug';

import { formatDate } from '../utils';

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_to_message_id: messageId,
  });

const handleMessage = () => async (ctx: Context) => {
  debug('Triggered "handleMessage" text command');

  const messageId = ctx.message?.message_id;

  // @ts-ignore
  if (ctx.update.message.reply_to_message !== undefined) {
    // @ts-ignore
    const question = ctx.update.message.reply_to_message.text;
    // @ts-ignore
    const response = ctx.update.message.text;
    // @ts-ignore
    // const { id, first_name, last_name } = ctx.update.message.from;
    // @ts-ignore
    const date = formatDate(ctx.update.message.date);

    // const update = ctx.update;

    const text = `${question}\n\n"${response}"\n\n${date}`;

    ctx.reply(text);
  } else {
    if (messageId) {
      await replyToMessage(
        ctx,
        messageId,
        'Please reply to any daily question.',
      );
    } else {
      ctx.reply('Please reply to any daily question.');
    }
  }
};

export { handleMessage };
