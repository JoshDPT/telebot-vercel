import 'dotenv/config';
import { Context } from 'telegraf';
import { searchResponses } from '../database';

const search = () => async (ctx: Context) => {
  // @ts-ignore
  const commandText = ctx.message.text || '';
  const [searchText, page] = commandText
    .replace('/search', '')
    .trim()
    .split(' ');

  // Get user data from the PlanetScale database
  const res = await searchResponses({
    searchText,
    page,
  });

  if (Array.isArray(res?.rows)) {
    const pages = `${res.size / 10} pages total.\n\n`;
    const searchString = res.rows
      .map(({ question, response }) => {
        return `${question}\n${response}`;
      })
      .join('\n\n');

    ctx.reply(pages + searchString);
  }
};

export { search };
