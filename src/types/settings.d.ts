import { InlineKeyboardButton } from "typegram";

interface UserSetting {
    validation: (value : string) => boolean,
    keyboardButtons? : InlineKeyboardButton[],
    promptText : string,
    buttonText : string
}