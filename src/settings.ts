import { SessionContext } from "./types/session"
import { replies } from './strings.json';
import { formatString } from "./util";
import { ShapeTypes } from "./jimpProcessor";
import { UserSetting } from "./types/settings";

const opacityRegex = /^[0-9]{1,2}$|^100$/;

const validateOpacity = (value : string) : boolean => {
    return opacityRegex.test(value);
}

const validateShape = (value : string) : boolean => {
    return Object.keys(ShapeTypes).includes(value);
}

export const settings : { [key : string]: UserSetting } = {
    "opacity": {
        validation: validateOpacity,
        buttonText: "Opacity",
        promptText: "Enter a value for the opacity of the pride color overlay. Valid values are between 0 and 100."
    },
    "shape": {
        validation: validateShape,
        buttonText: "Shape",
        promptText: 'Enter a value for the shape you would like the pride color overlay to be in. Valid values are "Square", "Circle", or "Ring".',
        keyboardButtons: Object.entries(ShapeTypes).map(([key, value]) => {
            return {
                callback_data: value.toString(),
                text: key,
            }
        })
    }
};


export const validation : { [key: string]: (value : string) => boolean } = {
    opacity: validateOpacity,
    shape: validateShape
}

export const setItem = async (key : string, value : any, ctx : SessionContext) => {
    if(settings[key].validation(value)) {
        ctx.session[key] = value;
    }
    else {
        await ctx.reply(formatString(replies.error.validationFailed, key));
    }
}