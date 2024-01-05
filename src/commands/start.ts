import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import { UserModel } from '../../types';

const debug = createDebug('bot:start_command');

const saveUserDataToDatabase = async ({
  first_name,
  last_name,
  user_id,
  subscriptions,
  date_joined,
}: UserModel) => {
  const conn = connect(config);

  try {
    // Insert user data into the database
    await conn.execute(
      `INSERT IGNORE INTO users (first_name, last_name, user_id, subscriptions, date_joined, date_recent_response, responses_sum)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [first_name, last_name, user_id, subscriptions, date_joined, date_joined],
    );

    debug('User data successfully saved to PlanetScale database');
  } catch (error) {
    debug('Error saving user data to PlanetScale database:', error);
  }
};

const start = () => async (ctx: Context) => {
  const user = ctx.message?.from;

  if (user) {
    const first_name = user.first_name || '';
    const last_name = user.last_name || '';
    const user_id = user.id;

    const unixDate = ctx.message?.date;
    const timestampInMilliseconds = unixDate * 1000;
    const date_joined = isNaN(timestampInMilliseconds)
      ? new Date()
      : new Date(timestampInMilliseconds);

    // @ts-ignore
    const commandText = ctx.message.text || '';
    const subscriptions =
      commandText.replace('/start', '').trim().replace(' ', ',') || 'general';

    // Save user data to the PlanetScale database
    await saveUserDataToDatabase({
      first_name,
      last_name,
      user_id,
      subscriptions,
      date_joined,
    });

    ctx.reply(`Thank you for joining the bot chat, ${first_name}`);
  }
};

export { start };
