export type KeypressHandler = ReturnType<typeof createKeypressHandler>;
export const createKeypressHandler = () => {
	let isPressingControl: boolean = false;
	let isPressingShift: boolean = false;

	addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'Control') isPressingControl = true;
		if (e.key === 'Shift') isPressingShift = true;
	});
	addEventListener('keyup', (e: KeyboardEvent) => {
		if (e.key === 'Control') isPressingControl = false;
		if (e.key === 'Shift') isPressingShift = false;
	});

	return {
		isPressingShift: () => isPressingShift,
		isPressingControl: () => isPressingControl
	};
};
