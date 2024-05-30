export type MouseCoordinatesHandler = ReturnType<typeof createMouseCoordinatesHandler>;

export const createMouseCoordinatesHandler = (canvas: HTMLCanvasElement) => {
	let coordinates: number[] = [0, 0];

	addEventListener('mousemove', (event: MouseEvent) => {
		coordinates = [
			event.clientX - canvas.getBoundingClientRect().left,
			event.clientY - canvas.getBoundingClientRect().top
		];
	});

	return {
		getCoordinates: () => coordinates
	};
};
