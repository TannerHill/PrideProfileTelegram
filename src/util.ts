const templateRegex = /{[0-9]+}/g;
const variableIndexRegex = /[0-9]+/;

export const isNthBitSet = (value : number, bit : number) => {
    return (value & (1 << bit)) !== 0;
}

export const setNthBit = (value : number, bit : number) => {
    return value | (1 << bit);
}

export const hasFlag = (value : number, flag : number) => {
    return (value & flag) === flag;
}

export const formatString = (template : string, ...variables : string[]) => {
    let newString = template;
    try {
        for(let match of template.matchAll(templateRegex)) {
            const matchText = match[0];
            let index = parseInt(variableIndexRegex.exec(matchText).shift());
            newString = newString.replace(matchText, variables[index]);
        }
    }
    catch {
        return null;
    }
    return newString;
}