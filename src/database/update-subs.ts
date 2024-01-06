import createDebug from 'debug';
import 'dotenv/config';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:update-subs');

interface SubUser {
  userID: number;
  subscriptions: string;
}

const updateSubsDatabase = async ({ userID, subscriptions }: SubUser) => {
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

export { updateSubsDatabase };
