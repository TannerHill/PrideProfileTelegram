import { Message } from "typegram";
import { addSplitColors, getAndProcessProfilePicture } from "./callbackQuery";
import { SessionContext } from "./types/session";
import { replies } from './strings.json';
import { formatString } from './util';

const hexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const parseHexList = (input : string) : number[] | null => {
    try {
        const colorStrings = input.split(',').map(c => c.trim());
        if(colorStrings.every(c => hexPattern.test(c))) {
            return colorStrings.map(c => parseInt(c.substring(1), 16) * 16 * 16);
        }
    }
    catch(e) {}
    return null;
}

export const parseTextUpdate = async (ctx : SessionContext) => {
    const { isCustomInput, isSplitInput } = ctx.session;
    if(!isCustomInput) {
		await ctx.reply(replies.error.unknown);
	}
	else {
        const colors = parseHexList((ctx.message as Message.TextMessage).text);
        if(colors) {
            if(isSplitInput) {
                await addSplitColors(colors, ctx.message.from.id, ctx);
            }
            else {
                await getAndProcessProfilePicture(ctx.message.from.id, colors, ctx);
            }
        }
        else {
            await ctx.reply(formatString(replies.error.hex, replies.hexExample) + '\n' + replies.error.clear);
        }
        ctx.session.isCustomInput = false;
	}
}