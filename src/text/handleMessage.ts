import { Context } from 'telegraf';
import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { formatDate } from '../utils';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:greeting_text');

interface Response {
  user_id: number;
  date?: Date;
  question: string;
  response: string;
}

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_to_message_id: messageId,
  });

const saveResponseToDatabase = async (
  response: Response,
  ctx: Context,
  messageId: number,
) => {
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
    const errorDatabase = `Error saving response data to the database.`;
    if (messageId !== 0) {
      await replyToMessage(ctx, messageId, errorDatabase);
    } else {
      ctx.reply(errorDatabase);
    }
  }
};

const getAllUserIds = async (ctx: Context, messageId: number) => {
  const conn = connect(config);

  try {
    // Retrieve all user IDs from the database
    const result = await conn.execute('SELECT DISTINCT user_id FROM users');

    debug('Success in getting all users from database');
    return result.rows.map((row: any) => row.user_id);
  } catch (error) {
    debug('Error getting user IDs:', error);
    const errorGetUsers = '❌ Error ❌:\nError getting users from database.';
    if (messageId) {
      await replyToMessage(ctx, messageId, errorGetUsers);
    } else {
      ctx.reply(errorGetUsers);
    }
  }
};

const sendQuestionToUsers = async (
  ctx: Context,
  question: string,
  userIDs: number[],
  messageId: number,
) => {
  try {
    // Send the question to all users
    for (const userID of userIDs) {
      await ctx.telegram.sendMessage(userID, question);
    }
    debug('Response sent to all users');
  } catch (error) {
    debug('Error sending question to users:', error);
    const pleaseReply = '❌ Error ❌:\nError sending response to all users.';
    if (messageId) {
      await replyToMessage(ctx, messageId, pleaseReply);
    } else {
      ctx.reply(pleaseReply);
    }
  }
};

const handleMessage = () => async (ctx: Context) => {
  debug('Triggered "handleMessage" text command');

  const messageId = ctx.message?.message_id;

  if (
    // @ts-ignore
    ctx.update.message.reply_to_message !== undefined &&
    // @ts-ignore
    ctx.update.message.reply_to_message !==
      'Please reply to any daily question.'
  ) {
    // @ts-ignore
    const question: string = ctx.update.message.reply_to_message.text;
    // @ts-ignore
    const response = ctx.update.message.text;
    // @ts-ignore
    const unixDate = ctx.update.message.date;
    const timestampInMilliseconds = unixDate * 1000;
    const date = isNaN(timestampInMilliseconds)
      ? new Date()
      : new Date(timestampInMilliseconds);
    // @ts-ignore
    const user_id = ctx.update.message.from.id;

    // Save the response to the database
    await saveResponseToDatabase(
      {
        user_id,
        date,
        question,
        response,
      },
      ctx,
      messageId || 0,
    );
    // You can reply with a confirmation message if needed
    ctx.reply('Response saved successfully!');

    try {
      const textDate = formatDate(unixDate);
      const firstName = ctx.message?.from.first_name;
      const questionResponseCard = `${question}\n\"${response}\"\n${firstName}\n${textDate}`;

      const userIDs = await getAllUserIds(ctx, messageId || 0);

      if (userIDs) {
        await sendQuestionToUsers(
          ctx,
          questionResponseCard,
          userIDs,
          messageId || 0,
        );
        debug('Successfully sent response card to all users');
      }
      // Send the selected question to all users
    } catch (err) {
      debug('Error sending response card to all users', err);
    }
  } else {
    const pleaseReply =
      "❌ Error ❌:\n1. Click-hold on the original question.\n2. Wait for the dropdown.\n3. Select '⬅ Reply'.\n4. Enter your response.";
    if (messageId) {
      await replyToMessage(ctx, messageId, pleaseReply);
    } else {
      ctx.reply(pleaseReply);
    }
  }
};

export { handleMessage };
