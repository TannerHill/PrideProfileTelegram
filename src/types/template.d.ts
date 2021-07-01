interface Template {
    name: string,
    colorRange: number[] | number[][],
}

type TemplateCollection = Template[];

interface TemplateCallbackData {
    name: string | number
}