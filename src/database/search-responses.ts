import createDebug from 'debug';
import 'dotenv/config';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import { getOffsetFromPage } from '../utils';
import { SearchResponsesProps } from '../../types';

const debug = createDebug('bot:get-all-user-data');

const searchResponses = async ({ searchText, page }: SearchResponsesProps) => {
  const conn = connect(config);

  const offset = getOffsetFromPage(Number(page || 0));

  try {
    const res = await conn.execute(
      `SELECT * FROM responses WHERE MATCH(question,response) AGAINST (?) LIMIT 10 OFFSET ?;`,
      [searchText, offset],
    );

    debug('User data successfully selected from PlanetScale database');
    return res;
  } catch (error) {
    debug('Error selecting user data to PlanetScale database:', error);
  }
};

export { searchResponses };
