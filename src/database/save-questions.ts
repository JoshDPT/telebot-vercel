import { Context } from 'telegraf';
import { Question } from '../../types';
import { connect } from '@planetscale/database';
import { config } from '../utils';
import createDebug from 'debug';

const debug = createDebug('bot:addcsv_command');

const saveQuestionToDatabase = async (question: Question, ctx: Context) => {
  const conn = connect(config);

  try {
    // Upsert question data into the database
    await conn.execute(
      `INSERT INTO questions (question, month, date, keyword, likes, dislikes)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      question = VALUES(question),
      month = VALUES(month),
      date = VALUES(date),
      keyword = VALUES(keyword),
      likes = VALUES(likes),
      dislikes = VALUES(dislikes)`,
      [
        question.question,
        question.month || null,
        question.date || null,
        question.keyword || null,
        question.likes || 0,
        question.dislikes || 0,
      ],
    );
    debug('Question data successfully saved to PlanetScale database');
  } catch (error) {
    debug('Error saving question data to PlanetScale database:', error);
    ctx.reply(
      `❌ Error! Error saving question to PlanetScale database:\n${
        question.question || 'no question'
      }`,
    );
  }
};

export { saveQuestionToDatabase };
