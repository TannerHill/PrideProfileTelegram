import { Telegraf, Context, Telegram } from 'telegraf';
import { CallbackQuery } from 'typegram';
import { parseCallbackQueryUpdate } from './callbackQuery';
import { sendKeyboard } from './keyboard';
import { parseTextUpdate } from './textMessage';
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { session } from 'telegraf-session-mongodb';
import { SessionContext } from './types/session';
import { replies } from './strings.json';
import express from 'express';
import { URL, Url } from 'url';

if(process.env.NODE_ENV !== 'production') {
	config();
}

const { BOT_TOKEN, MONGODB_URI, NODE_ENV, WEBHOOK_URL } = process.env;

const initialize = async () => {
	const bot = new Telegraf<SessionContext>(BOT_TOKEN);
	
	const db = (await MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })).db();
	bot.use(session(db, { collectionName: 'sessions_prideprofile' }));

	bot.start(async ctx => {
		await ctx.reply(`${replies.welcome}\n\n${replies.updates}`, {
			parse_mode: 'HTML'
		});
		await sendKeyboard(ctx);
	});

	bot.command('cancel', async ctx => {
		ctx.session = {};
		await ctx.reply(replies.cancel);
	});

	bot.on('callback_query', async ctx => {
		if((ctx.callbackQuery as CallbackQuery.DataCallbackQuery).data) {
			await parseCallbackQueryUpdate(ctx);
		}
	});

	// Currently just for custom color lists
	bot.on('text', async ctx => {
		await parseTextUpdate(ctx);
	});

	// For uncaught exceptions
	bot.catch(async (err, ctx) => {
		await ctx.reply(replies.error.exception);
	});

	// Enable graceful stop
	process.once('SIGINT', () => bot.stop('SIGINT'));
	process.once('SIGTERM', () => bot.stop('SIGTERM'));

	if(NODE_ENV !== 'production') {
		console.log('Started Polling...');
		bot.launch();
	}
	else {
		console.log('Starting Webhook...');
		const app = express();
		const port = process.env.PORT || 80;
		const webhookInfo = await bot.telegram.getWebhookInfo();
		if(!webhookInfo?.url) {
			bot.telegram.setWebhook(WEBHOOK_URL+BOT_TOKEN);
		}
		let path = webhookInfo?.url ? new URL(webhookInfo.url).pathname : BOT_TOKEN;
		app.use(bot.webhookCallback(path));
		app.get('/', (req,res) => res.status(200).send());
		app.listen(Number(port), () => {
			console.log(`Listening on path: ${path}, port ${port}`);
		});
		/* No need for this
		await bot.launch({
			webhook: {
				port: Number(process.env.PORT) | 80,
				domain: WEBHOOK_URL
			}
		});
		*/
	}
}

initialize();
