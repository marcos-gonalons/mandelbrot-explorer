export const waitUntilWASMWorkersAreReady = async () => {
	let interval: ReturnType<typeof setInterval>;

	return new Promise<void>((resolve) => {
		interval = setInterval(() => {
			if (!window.workersManager || workersManager.isExecutingAnyFunction()) return;

			clearInterval(interval);
			resolve();
		}, 50);
	});
};
