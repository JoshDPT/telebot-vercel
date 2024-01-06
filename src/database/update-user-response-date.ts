import { Context } from 'telegraf';
import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import { Response } from '../../types';
import { replyToMessage } from '../telegram';

const debug = createDebug('bot:update-response-date');

const updateUserResponseDate = async (response: Response, ctx: Context) => {
  const messageId = ctx.message?.message_id;
  const conn = connect(config);

  try {
    await conn.execute(
      `UPDATE users SET date_recent_response = ?, responses_sum = responses_sum + 1 WHERE user_id = ?;`,
      [response.date, response.user_id],
    );

    debug('Response date successfully updated in the database');
  } catch (error) {
    debug('Error updating response date in database:', error);
    const errorDatabase = `❌ Error ❌: Error updating response date in database`;
    if (messageId) {
      await replyToMessage(ctx, messageId, errorDatabase);
    } else {
      ctx.reply(errorDatabase);
    }
  }
};

export { updateUserResponseDate };
