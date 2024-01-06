import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { Context } from 'telegraf';
import { config } from '../utils';
import { replyToMessage } from '../telegram';

const debug = createDebug('bot:get-all-user-ids');

const getAllUserIds = async (ctx: Context) => {
  const conn = connect(config);
  const messageId = ctx.message?.message_id;

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

export { getAllUserIds };
