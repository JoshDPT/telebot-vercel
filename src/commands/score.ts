import 'dotenv/config';
import { Context } from 'telegraf';
import { getUsersFromDatabase } from '../database';

const getScore = () => async (ctx: Context) => {
  // Get user data from the PlanetScale database
  const res = await getUsersFromDatabase();

  if (Array.isArray(res?.rows)) {
    const maxName = res.rows.reduce(
      (acc, { first_name }) => Math.max(acc, first_name.length),
      0,
    );

    const scoreArray = res.rows.map(
      ({ first_name, responses_sum, current_streak }) => {
        const score = responses_sum * current_streak;
        return { first_name, responses_sum, current_streak, score };
      },
    );

    const header = `Name${' '.repeat(maxName - 4)} | Total | Streak | Score\n`;

    const userString = scoreArray
      .sort((a, b) => b.score - a.score)
      .map(({ first_name, responses_sum, current_streak, score }) => {
        return `${first_name.padEnd(maxName)} | ${String(responses_sum).padEnd(
          5,
        )} | ${String(current_streak).padEnd(6)} | ${String(score).padEnd(5)}`;
      })
      .join(`\n`);

    ctx.replyWithHTML(`<pre>` + header + userString + `</pre>`);
  }
};

export { getScore };
