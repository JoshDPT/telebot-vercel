import 'dotenv/config';
import { Context } from 'telegraf';
import { getUsersFromDatabase } from '../database';

const users = () => async (ctx: Context) => {
  // Get user data from the PlanetScale database
  const res = await getUsersFromDatabase();

  // const lead = ['🥇', '🥈', '🥉'];

  if (Array.isArray(res?.rows)) {
    const userString = res.rows
      .sort((a, b) => b.responses_sum - a.responses_sum)
      .map(({ first_name, subscriptions }) => {
        return `Name: ${first_name}\nSubs: ${subscriptions
          .split(',')
          .join(' ')}`;
      })
      .join('\n\n');

    ctx.reply(userString);
  }
};

export { users };
