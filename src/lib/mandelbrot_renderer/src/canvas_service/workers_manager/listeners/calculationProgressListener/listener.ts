import Line from 'progressbar.js/line';
import { type CalculationProgressMessage } from '../../../../wasm_worker/types/workerToMain';

export function calculationProgressListener(
	progressBar: Line,
	{ progress }: CalculationProgressMessage['data']
): void {
	progressBar.animate(progress, { duration: 100 });
}
