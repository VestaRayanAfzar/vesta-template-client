import {Dictionary, IVocabs} from "vesta-lib/Dictionary";
import {I18nService} from "./I18nService";
import {Dictionary as persian} from "../cmn/locale/fa-IR/Dictionary";

export class TranslateService {
    private dictionary: Dictionary;
    private static instance: TranslateService;

    constructor(i18nService: I18nService) {
        this.dictionary = i18nService.getDictionary();
        this.dictionary.inject(<IVocabs>persian);
        TranslateService.instance = this;
    }

    public translate(key: string, ...placeholders: Array<string>): string {
        if (!key) return '';
        let tr = this.dictionary.lookup(key);
        if (!tr) return key;
        if (!placeholders.length) return tr;
        for (let i = 0, il = placeholders.length; i < il; ++i) {
            tr = tr.replace('%', placeholders[i]);
        }
        return tr;
    }

    public static getInstance(): TranslateService {
        return TranslateService.instance;
    }
}