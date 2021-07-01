import { Context } from 'telegraf';
import { Update, CallbackQuery, UserProfilePhotos } from 'typegram';
import { applyPride, defaultOptions, ShapeTypes } from './jimpProcessor';
import Templates from './template';
import { stringConstants } from './strings.json';
import { SessionContext } from './types/session';
import { sendKeyboard } from './keyboard';
import { replies } from './strings.json';

export const getAndProcessProfilePicture = async (id : number, colorRange : number[] | number[][], ctx : SessionContext) => {
    const userProfilePhotos : UserProfilePhotos = await ctx.telegram.getUserProfilePhotos(id, 0, 1);
    const photo = userProfilePhotos.photos.shift().pop();
    const photoUrl = await ctx.telegram.getFileLink(photo);
    if(photoUrl) {
        const { settings } = ctx.session;
        const imageBuffer = await applyPride(photoUrl.toString(), {
            colorRange,
            opacity: settings?.opacity ?? defaultOptions.opacity,
            shape: settings?.shape ?? defaultOptions.shape
        });
        if(imageBuffer) {
            await ctx.replyWithPhoto({
                source: imageBuffer,
                filename: photo.file_id + '.png'
            });
        }
    }
    ctx.session.currentInput = null;
}

export const addSplitColors = async (colors: number[], id: number, ctx: SessionContext) => {
    if(!ctx.session.currentInput) {
        ctx.session.currentInput = [colors];
        await sendKeyboard(ctx);
    }
    else {
        ctx.session.isSplitInput = false;
        (ctx.session.currentInput as number[][]).push(colors);
        await getAndProcessProfilePicture(id, ctx.session.currentInput, ctx);
    }
}

export const parseSettingRequest = (text : string) => {
    const settingKey = text.split(':').pop();
    
}

export const parseCallbackQueryUpdate = async (ctx: SessionContext) => {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataCallbackQuery;
    const data : TemplateCallbackData = JSON.parse(callbackQuery.data);
    await ctx.telegram.deleteMessage(ctx.chat.id, callbackQuery.message.message_id);
    if(typeof data === 'string') {
        switch(data) {
            case stringConstants.callbackQuery.split: {
                ctx.session.isSplitInput = true;
                await sendKeyboard(ctx);
                break;
            }
            case stringConstants.callbackQuery.custom: {
                ctx.session.isCustomInput = true;
                await ctx.reply(replies.custom+replies.hexExample);
                break;
            }
            case stringConstants.callbackQuery.cancel: {
                ctx.session = {};
                break;
            }
            default:

        }
    }
    else if(typeof data === 'number') {
        if(ctx.session.isSplitInput) {
            await addSplitColors(Templates[data].colorRange as number[], callbackQuery.from.id, ctx);
        }
        else {
            try {
                await getAndProcessProfilePicture(callbackQuery.from.id, Templates[data].colorRange, ctx);
            }
            catch(e) { }
            finally {
            }
        }
        await ctx.answerCbQuery();
    }
}