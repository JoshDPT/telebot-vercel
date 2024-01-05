import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:dailyrun_command');

const getAllUserIds = async () => {
  const conn = connect(config);

  try {
    // Retrieve all user IDs from the database
    const result = await conn.execute('SELECT DISTINCT user_id FROM users');
    debug('Success getting all user IDs from database.');
    return result.rows.map((row: any) => row.user_id);
  } catch (error) {
    debug('Error getting user IDs:', error);
    throw new Error('Error getting user IDs from the database');
  }
};

export { getAllUserIds };
