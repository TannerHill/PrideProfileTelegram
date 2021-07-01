import { InlineKeyboardButton } from 'typegram';
import { stringConstants, replies } from './strings.json';
import Templates from './template';
import { SessionContext } from './types/session';
import { settings } from './settings';

enum KeyboardTypes {
    template,
    settings
}

const getSettingsKeyboard = () : InlineKeyboardButton[][] => {
    return Object.entries(settings).map(([key, value]) => {
        return [
            {
                text: value.buttonText,
                callback_data: key 
            }
        ]
    });
}

const getSettingKeyboard = (key : string) : InlineKeyboardButton[][] => {
    return settings[key].keyboardButtons.map(b => [b]);
}

const getTemplateKeyboard = (isSplitInput : boolean) : InlineKeyboardButton[][] => {
    const items : InlineKeyboardButton[][] = Templates.map((t,i) => {
        return [{
            text: t.name,
            callback_data: JSON.stringify(i)
        }]
    });
    items.push([{
        text: 'Custom',
        callback_data: JSON.stringify(stringConstants.callbackQuery.custom)
    }]);
    if(!isSplitInput) {
        items.push([{
            text: 'Split',
            callback_data: JSON.stringify(stringConstants.callbackQuery.split)
        }]);
    }
    else {
        items.push([{
            text: 'Cancel',
            callback_data: JSON.stringify(stringConstants.callbackQuery.cancel)
        }]);
    }
    return items;
}

export const sendKeyboard = async (ctx : SessionContext, type : KeyboardTypes = KeyboardTypes.template) => {
    const { isSplitInput, currentInput } = ctx.session;
    const text = isSplitInput 
        ? !currentInput ? replies.keyboard.split.first : replies.keyboard.split.second
        : replies.keyboard.template

    await ctx.reply(text, {
        reply_markup: {
            inline_keyboard: getTemplateKeyboard(isSplitInput)
        }
    });
}