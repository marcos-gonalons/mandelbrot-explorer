import * as enTranslations from './en.json';
import * as esTranslations from './es.json';

type TranslationsJSON = { [key: string]: TranslationsJSON | string };
type Language = 'en' | 'es';

const translations: { [key in Language]: TranslationsJSON } = {
	en: enTranslations,
	es: esTranslations
};

let language: Language = 'en';

export function setLanguage(l: Language) {
	language = l;
}

export function getTranslation(key: string): string {
	const languageTranslations = translations[language];
	if (languageTranslations === undefined) {
		return key;
	}

	const translation = get(key.split('.'), languageTranslations as TranslationsJSON);
	if (typeof translation === 'string') {
		return translation;
	}

	return key;
}

function get(translationKeySplits: string[], translations: TranslationsJSON): string | undefined {
	const value = translations[translationKeySplits[0]];
	if (translationKeySplits.length === 1 || value === undefined) return value as string | undefined;

	translationKeySplits.shift();
	return get(translationKeySplits, value as TranslationsJSON);
}
