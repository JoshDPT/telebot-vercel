import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';
import { formatDatabaseDate } from '../utils';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:users_command');

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
  // Get user data from the PlanetScale database
  const res = await getUsersFromDatabase();

  const lead = ['🥇', '🥈', '🥉'];

  if (Array.isArray(res?.rows)) {
    const userString = res.rows
      .sort((a, b) => b.responses_sum - a.responses_sum)
      .map((user, i) => {
        const {
          first_name,
          subscriptions,
          date_recent_response,
          responses_sum,
        } = user;

        return `Name: ${first_name}\nSubs: ${subscriptions
          .split(',')
          .join(' ')}\nLast response: ${formatDatabaseDate(
          date_recent_response,
        )}\nTotal responses: ${responses_sum} ${lead[i] || null}`;
      })
      .join('\n\n');

    ctx.reply(userString);
  }
};

export { users };
