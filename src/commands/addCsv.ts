import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { connect } from '@planetscale/database';
import { parse } from 'csv-parse';

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

const debug = createDebug('bot:addcsv_command');

interface Question {
  id: number;
  question: string;
  month?: number | null;
  date?: string | null;
  keyword?: string | null;
  likes?: number;
  dislikes?: number;
}

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

const addCsv = () => async (ctx: Context) => {
  // @ts-ignore
  const csvText = ctx.message.text.replace('/addCsv', '').trim();

  const questions: Question[] = [];

  // Use csv-parse to parse the CSV text
  parse(csvText, { columns: true }, (err, data) => {
    if (err) {
      debug('Error parsing CSV text:', err);
      ctx.reply(`❌ Error! ${err.message}`);
      return;
    }

    // Process each row of the CSV
    for (const row of data) {
      questions.push(row);
    }

    // Save each question to the database
    for (const question of questions) {
      saveQuestionToDatabase(question, ctx);
    }

    // Reply to the user
    ctx.reply('✅ Success! Questions processed and saved to the database');
  });
};

export { addCsv };
