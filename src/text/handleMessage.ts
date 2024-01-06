import { Context } from 'telegraf';
import createDebug from 'debug';
import { formatDate } from '../utils';
import {
  saveResponseToDatabase,
  updateUserResponseDate,
  getAllUserIds,
} from '../database';
import { sendMessageAllUsers, replyToMessage } from '../telegram';

const debug = createDebug('bot:handlMessage');

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
    );

    await updateUserResponseDate(
      {
        user_id,
        date,
        question,
        response,
      },
      ctx,
    );
    // You can reply with a confirmation message if needed
    ctx.reply('Response saved successfully!');

    try {
      const textDate = formatDate(unixDate);
      const firstName = ctx.message?.from.first_name;
      const questionResponseCard = `${question}\n\n\"${response}\"\n\n${firstName}\n${textDate}`;

      const userIDs = await getAllUserIds(ctx);

      if (userIDs) {
        await sendMessageAllUsers(ctx, questionResponseCard, userIDs);
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
