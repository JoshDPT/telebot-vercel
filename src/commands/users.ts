import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:start_command');

const getUsersFromDatabase = async () => {
  const conn = connect(config);

  try {
    const res = await conn.execute(`SELECT * FROM users;`);
    debug('User data successfully selected from PlanetScale database');
    return res;
  } catch (error) {
    debug('Error selecting user data to PlanetScale database:', error);
  }
};

const users = () => async (ctx: Context) => {
  // Save user data to the PlanetScale database
  const res = await getUsersFromDatabase();

  // ctx.reply(
  //   `User added to subscription: ${first_name}, ${last_name}, ${userID}`,
  // );
  console.log(res?.rows);
};

export { users };
