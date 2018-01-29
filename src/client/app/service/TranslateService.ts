import { Culture, Dictionary } from "../medium";

export class TranslateService {
    private static instance: TranslateService;
    private dictionary: Dictionary = Culture.getDictionary();

    public static getInstance(): TranslateService {
        if (!TranslateService.instance) {
            TranslateService.instance = new TranslateService();
        }
        return TranslateService.instance;
    }

    private constructor() {
    }

    public translate = (key: string, ...placeholders: Array<any>): string => {
        if (!key) { return ""; }
        let tr = this.dictionary.lookup(key);
        if (!tr) { return key; }
        if (!placeholders.length) { return tr; }
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace("%", placeholders[i]);
        }
        return tr;
    }
}
