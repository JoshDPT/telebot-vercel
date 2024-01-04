import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:sub_command');

const saveUserDataToDatabase = async (
  firstName: string,
  lastName: string,
  userID: number,
  subscriptions: string,
) => {
  const conn = connect(config);

  try {
    // Insert user data into the database
    await conn.execute(
      `INSERT INTO users (first_name, last_name, user_id, subscriptions)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      subscriptions = VALUES(subscriptions)`,
      [firstName, lastName, userID, subscriptions],
    );
    debug('User data successfully saved to PlanetScale database');
  } catch (error) {
    debug('Error saving user data to PlanetScale database:', error);
  }
};

const sub = () => async (ctx: Context) => {
  const user = ctx.message?.from;

  if (user) {
    const first_name = user.first_name || '';
    const last_name = user.last_name || '';
    const userID = user.id;

    // @ts-ignore
    const commandText = ctx.message.text || '';
    const subscriptions =
      commandText.replace('/sub', '').trim().replace(' ', ',') || 'general';

    // Save user data to the PlanetScale database
    await saveUserDataToDatabase(first_name, last_name, userID, subscriptions);

    ctx.reply(
      `User added to subscription: ${first_name}, ${last_name}, ${userID}`,
    );
  }
};

export { sub };
