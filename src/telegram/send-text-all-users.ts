import { Context } from 'telegraf';
import createDebug from 'debug';
import { replyToMessage } from './reply-to-message';

const debug = createDebug('bot:handlMessage');

const sendMessageAllUsers = async (
  ctx: Context,
  message: string,
  userIDs: number[],
) => {
  const messageId = ctx.message?.message_id;
  try {
    // Send the message to all users
    await Promise.all(
      userIDs.map(async (userId) => {
        await ctx.telegram.sendMessage(userId, message);
      }),
    );

    debug('Response sent to all users');
  } catch (error) {
    debug('Error sending message to users:', error);
    const pleaseReply = '❌ Error ❌:\nError sending message to all users.';
    if (messageId) {
      await replyToMessage(ctx, messageId, pleaseReply);
    } else {
      ctx.reply(pleaseReply);
    }
  }
};

export { sendMessageAllUsers };
