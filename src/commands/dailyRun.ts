import createDebug from 'debug';
import { Context } from 'telegraf';
import {
  getAllUserIds,
  getKeywordQuestion,
  getMonthSpecificQuestion,
  getRandomQuestion,
} from '../database';
import { sendMessageAllUsers } from '../telegram';

const debug = createDebug('bot:dailyrun_command');

const dailyRun = () => async (ctx: Context) => {
  try {
    let selectedQuestion;

    const result = await getMonthSpecificQuestion();

    if (result.size === 0) {
      // If there is no question for the current month, get a random question
      selectedQuestion = await getRandomQuestion();
    } else {
      // If there is a question for the current month, use it
      selectedQuestion = result.rows[0].question;
    }

    // Get all user IDs
    const userIDs = await getAllUserIds(ctx);

    // Send the selected question to all users
    if (userIDs && selectedQuestion) {
      await sendMessageAllUsers(ctx, selectedQuestion, userIDs);
    }

    const childQuestion = await getKeywordQuestion('child');

    // Send the selected question to all users
    if (userIDs && childQuestion) {
      await sendMessageAllUsers(ctx, childQuestion, userIDs);
    }
  } catch (error) {
    debug('Error in daily question task:', error);
  }
};

export { dailyRun };
