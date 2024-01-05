import createDebug from 'debug';
import 'dotenv/config';
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

export { saveUserDataToDatabase };
