import { Context } from 'telegraf';
import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import { Response } from '../../types';
import { replyToMessage } from '../telegram';

const debug = createDebug('bot:update-response-data');

const updateUserResponseData = async (response: Response, ctx: Context) => {
  const messageId = ctx.message?.message_id;
  const conn = connect(config);

  try {
    await conn.execute(
      `
      UPDATE users
      SET
        current_streak = 
          CASE
            WHEN date_recent_response = CURDATE() THEN current_streak
            WHEN date_recent_response = CURDATE() - INTERVAL 1 DAY THEN current_streak + 1
            ELSE 1
          END,
        date_recent_response = CURDATE(),
        responses_sum = responses_sum + 1
      WHERE user_id = ?;
      `,
      [response.user_id],
    );

    debug('User response data successfully updated in the database');
  } catch (error) {
    debug('Error updating user response data in database:', error);
    const errorDatabase = `❌ Error ❌: Error updating user response data in database`;
    if (messageId) {
      await replyToMessage(ctx, messageId, errorDatabase);
    } else {
      ctx.reply(errorDatabase);
    }
  }
};

export { updateUserResponseData };
