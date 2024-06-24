import * as enTranslations from './en.json';

type TranslationsJSON = { [key: string]: TranslationsJSON | string };

const translations: TranslationsJSON = {
	en: enTranslations
};

let language = 'en';

export function setLanguage(l: string) {
	language = l;
}

export function getTranslation(key: string): string {
	const languageTranslations = translations[language];
	if (languageTranslations === undefined) {
		return key;
	}

	const translation = get(key.split('.'), languageTranslations as TranslationsJSON);
	if (typeof translation === 'string') {
		return translation as string;
	}

	return key;
}

function get(translationKeySplits: string[], translations: TranslationsJSON): string | undefined {
	const value = translations[translationKeySplits[0]];
	if (translationKeySplits.length === 1 || value === undefined) return value as string | undefined;

	translationKeySplits.shift();
	return get(translationKeySplits, value as TranslationsJSON);
}
