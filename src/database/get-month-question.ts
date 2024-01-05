import createDebug from 'debug';
import { connect } from '@planetscale/database';
import { config } from '../utils';

const debug = createDebug('bot:dailyrun_command');

const getMonthSpecificQuestion = async () => {
  // Retrieve a random question with month, date, and keyword set to null
  const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JavaScript
  const conn = connect(config);

  try {
    // Check if there is a question for the current month
    const result = await conn.execute(
      'SELECT * FROM questions WHERE month = ? ORDER BY RAND() LIMIT 1',
      [currentMonth],
    );
    debug('Success getting month-specific question from database.');
    return result;
  } catch (error) {
    debug('Error getting month-specific question:', error);
    throw new Error('Error getting month-specific question from the database');
  }
};

export { getMonthSpecificQuestion };
