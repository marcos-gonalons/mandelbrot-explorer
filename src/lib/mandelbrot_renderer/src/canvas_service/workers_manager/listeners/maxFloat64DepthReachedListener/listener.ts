export function maxFloat64DepthReachedListener(
	canvasContainer: HTMLDivElement,
	initCanvas: () => void
): void {
	canvasContainer.style.width = '40%';
	canvasContainer.style.height = '50%';
	canvasContainer.style.top = '25%';
	canvasContainer.style.left = '30%';
	/*
	Toastify({
		text: '',
		position: 'center',
		duration: -1,
		close: true
	}).showToast();
*/
	initCanvas();
}
