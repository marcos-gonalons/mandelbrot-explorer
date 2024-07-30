import { writable } from 'svelte/store';
import { defaultLanguage, setLanguage, translations, type Language } from '../../translations';

export const language = (() => {
	const { subscribe, update } = writable<Language>(defaultLanguage);

	return {
		subscribe,

		set: (value: Language) =>
			update(() => {
				if (!Object.keys(translations).includes(value)) {
					value = defaultLanguage;
				}

				setLanguage(value);
				return value;
			})
	};
})();
