import { state } from '../../../.././../../../stores/state/store';
import { type AdjustZoomFinishedMessage } from '../../../../wasm_worker/types/workerToMain';

let finishedWorkers = 0;

export function adjustZoomFinishedListener(
	workers: (Worker | null)[],
	data: AdjustZoomFinishedMessage['data']
): void {
	finishedWorkers++;
	if (finishedWorkers < workers.length) return;
	finishedWorkers = 0;

	state.setZoom(data.zoomAsENotation);
	state.setOffsets({ x: data.xOffsetAsENotation, y: data.yOffsetAsENotation });
}
