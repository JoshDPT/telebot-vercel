import createDebug from 'debug';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:start_command');

interface Question {
  id: number;
  question: string;
  month?: number | null;
  date?: string | null;
  keyword?: string | null;
  likes?: number;
  dislikes?: number;
}

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

const getAllUserIds = async () => {
  const conn = connect(config);

  try {
    // Retrieve all user IDs from the database
    const result = await conn.execute('SELECT DISTINCT user_id FROM users');

    return result.rows.map((row: any) => row.user_id);
  } catch (error) {
    debug('Error getting user IDs:', error);
    throw new Error('Error getting user IDs from the database');
  }
};

const sendQuestionToUsers = async (
  ctx: Context,
  question: string,
  userIDs: number[],
) => {
  try {
    // Send the question to all users
    for (const userID of userIDs) {
      await ctx.telegram.sendMessage(userID, question);
    }
    debug('Question sent to all users');
  } catch (error) {
    debug('Error sending question to users:', error);
    throw new Error('Error sending question to users');
  }
};

const dailyRun = () => async (ctx: Context) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JavaScript
    const conn = connect(config);

    // Check if there is a question for the current month
    const result = await conn.execute(
      'SELECT * FROM questions WHERE month = ? ORDER BY RAND() LIMIT 1',
      [currentMonth],
    );

    let selectedQuestion;

    if (result.size === 0) {
      // If there is no question for the current month, get a random question
      selectedQuestion = await getRandomQuestion();
    } else {
      // If there is a question for the current month, use it
      selectedQuestion = result.rows[0].question;
    }

    // Get all user IDs
    const userIDs = await getAllUserIds();

    // Send the selected question to all users
    await sendQuestionToUsers(ctx, selectedQuestion, userIDs);
  } catch (error) {
    debug('Error in daily question task:', error);
  }
};

export { dailyRun };

// You can then schedule this daily function using a task scheduler like cron
