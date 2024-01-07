import createDebug from 'debug';
import 'dotenv/config';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:get-all-user-data');

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

export { getUsersFromDatabase };
