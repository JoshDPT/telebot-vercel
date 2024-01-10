import createDebug from 'debug';
import 'dotenv/config';
import { Context } from 'telegraf';
import { parse } from 'csv-parse';
import { Question } from '../../types';
import { saveQuestionToDatabase } from '../database';

const debug = createDebug('bot:addcsv_command');

const addCsv = () => async (ctx: Context) => {
  // @ts-ignore
  const csvText = ctx.message.text.replace('/addcsv', '').trim();
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
