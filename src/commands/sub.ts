import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:sub_command');

interface SubUser {
  userID: number;
  subscriptions: string;
}

const saveUserDataToDatabase = async ({ userID, subscriptions }: SubUser) => {
  const conn = connect(config);

  try {
    // update subscriptions
    await conn.execute(
      `UPDATE users
       SET subscriptions = ?
       WHERE user_id = ?`,
      [subscriptions, userID],
    );
    debug('User data successfully saved to PlanetScale database');
  } catch (error) {
    debug('Error saving user data to PlanetScale database:', error);
  }
};

const sub = () => async (ctx: Context) => {
  const user = ctx.message?.from;

  if (user) {
    const userID = user.id;

    // @ts-ignore
    const commandText = ctx.message.text || '';
    const subs: string = commandText.replace('/sub', '').trim();

    if (subs) {
      const subscriptions = subs.replace(' ', ',');
      // Save user data to the PlanetScale database
      await saveUserDataToDatabase({ userID, subscriptions });

      ctx.reply(
        `Updated subscriptions to ${subscriptions.split(',').join(' ')}`,
      );
    } else {
      ctx.reply(
        `Please include subscription strings after command like so:\n/sub general child`,
      );
    }
  }
};

export { sub };
