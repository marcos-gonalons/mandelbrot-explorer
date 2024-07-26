import { getTranslation } from '../../translations';

export const validateENotation = (value: string, maxMagnitude: number): string => {
	if (!value.includes('e')) {
		throw new Error(getTranslation('validations.invalidENotationFormat'));
	}

	let splits = value.split('e+');
	if (splits.length === 2) {
		if (parseInt(splits[1]) !== 0) {
			throw new Error(getTranslation('validations.invalidENotationFormat'));
		}

		value = value.replace('e+', 'e-');
	}

	splits = value.split('e-');
	if (splits.length !== 2) {
		throw new Error(getTranslation('validations.invalidENotationFormat'));
	}

	if (parseInt(splits[1]) > maxMagnitude) {
		throw new Error(
			getTranslation('validations.maxMagnitudeError').replace(
				'{magnitude}',
				maxMagnitude.toString()
			)
		);
	}

	if (value[0] !== '-' && value[0] !== '+') {
		value = '+' + value;
	}

	return value;
};
