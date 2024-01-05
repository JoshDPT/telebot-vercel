import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { updateSubsDatabase } from '../database';

const debug = createDebug('bot:sub_command');

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
      await updateSubsDatabase({ userID, subscriptions });

      ctx.reply(
        `Updated subscriptions to ${subscriptions.split(',').join(' ')}`,
      );
      debug('Responded with sucessful sub update.');
    } else {
      ctx.reply(
        `Please include subscription strings after command like so:\n/sub general child`,
      );
    }
  }
};

export { sub };
