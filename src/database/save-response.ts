import { Context } from 'telegraf';
import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import { Response } from '../../types';
import { replyToMessage } from '../telegram';

const debug = createDebug('bot:save-response');

const saveResponseToDatabase = async (response: Response, ctx: Context) => {
  const conn = connect(config);
  const messageId = ctx.message?.message_id;

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
    const errorDatabase = `❌ Error ❌: Error saving response data to the database.`;
    if (messageId) {
      await replyToMessage(ctx, messageId, errorDatabase);
    } else {
      ctx.reply(errorDatabase);
    }
  }
};

export { saveResponseToDatabase };
