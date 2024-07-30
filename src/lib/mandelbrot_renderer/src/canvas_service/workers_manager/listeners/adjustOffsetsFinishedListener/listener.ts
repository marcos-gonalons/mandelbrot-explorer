import { state } from '../../../../../../../stores/mandelbrotState/store';
import { type AdjustOffsetsFinisheMessage } from '../../../../wasm_worker/types/workerToMain';

let finishedWorkers = 0;

export function adjustOffsetsFinishedListener(
	workers: (Worker | null)[],
	data: AdjustOffsetsFinisheMessage['data']
): void {
	finishedWorkers++;
	if (finishedWorkers < workers.length) return;
	finishedWorkers = 0;

	state.setOffsets(data.offsets);
}
