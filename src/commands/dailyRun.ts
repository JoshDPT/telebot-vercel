import createDebug from 'debug';
import { Context } from 'telegraf';
import {
  getAllUserIds,
  getMonthSpecificQuestion,
  getRandomQuestion,
} from '../database';

const debug = createDebug('bot:dailyrun_command');

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
    const userIDs = await getAllUserIds();

    // Send the selected question to all users
    await sendQuestionToUsers(ctx, selectedQuestion, userIDs);
  } catch (error) {
    debug('Error in daily question task:', error);
  }
};

export { dailyRun };
