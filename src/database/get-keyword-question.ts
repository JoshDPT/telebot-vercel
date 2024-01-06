import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:get-keyword-question');

const getKeywordQuestion = async (keyword: string) => {
  const conn = connect(config);

  try {
    const result = await conn.execute(
      'SELECT * FROM questions WHERE month IS NULL AND date IS NULL AND keyword = ? ORDER BY RAND() LIMIT 1',
      [keyword],
    );

    return result.rows[0].question;
  } catch (error) {
    debug('Error getting child question:', error);
    throw new Error('Error getting child question from the database');
  }
};

export { getKeywordQuestion };
