import { Context } from 'telegraf';
import createDebug from 'debug';
import { connect } from '@planetscale/database';

const debug = createDebug('bot:greeting_text');

interface Response {
  user_id: number;
  date?: Date;
  question: string;
  response: string;
}

const saveResponseToDatabase = async (response: Response) => {
  const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  };

  const conn = connect(config);

  try {
    // Insert response data into the database
    await conn.execute(
      `INSERT INTO responses (user_id, date, question, response)
      VALUES (?, ?, ?, ?)`,
      [response.user_id, response.date, response.question, response.response],
    );

    debug('Response data successfully saved to the database');
  } catch (error) {
    debug('Error saving response data to the database:', error);
    throw new Error('Error saving response data to the database');
  }
};

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
    const question: string = ctx.update.message.reply_to_message.text;
    // @ts-ignore
    const response = ctx.update.message.text;
    // @ts-ignore
    const unixDate = ctx.update.message.date;
    const timestampInMilliseconds = unixDate * 1000;
    const date = new Date(timestampInMilliseconds) || new Date();
    // @ts-ignore
    const user_id = ctx.update.message.from.id;

    // Save the response to the database
    await saveResponseToDatabase({
      user_id,
      date,
      question,
      response,
    });

    // You can reply with a confirmation message if needed
    ctx.reply('Response saved successfully!');
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
