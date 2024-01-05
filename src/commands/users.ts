import 'dotenv/config';
import { Context } from 'telegraf';
import { formatDatabaseDate } from '../utils';
import { getUsersFromDatabase } from '../database';

const users = () => async (ctx: Context) => {
  // Get user data from the PlanetScale database
  const res = await getUsersFromDatabase();

  const lead = ['🥇', '🥈', '🥉'];

  if (Array.isArray(res?.rows)) {
    const userString = res.rows
      .sort((a, b) => b.responses_sum - a.responses_sum)
      .map(
        (
          { first_name, subscriptions, date_recent_response, responses_sum },
          index,
        ) => {
          return `Name: ${first_name}\nSubs: ${subscriptions
            .split(',')
            .join(' ')}\nLast response: ${formatDatabaseDate(
            date_recent_response,
          )}\nTotal responses: ${responses_sum} ${lead[index] || null}`;
        },
      )
      .join('\n\n');

    ctx.reply(userString);
  }
};

export { users };
