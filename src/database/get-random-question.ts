import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:get-random-question');

const getRandomQuestion = async () => {
  const conn = connect(config);

  try {
    // Retrieve a random question with month, date, and keyword set to null
    const result = await conn.execute(
      'SELECT * FROM questions WHERE month IS NULL AND date IS NULL AND keyword IS NULL ORDER BY RAND() LIMIT 1',
    );

    return result.rows[0].question;
  } catch (error) {
    debug('Error getting random question:', error);
    throw new Error('Error getting random question from the database');
  }
};

export { getRandomQuestion };
