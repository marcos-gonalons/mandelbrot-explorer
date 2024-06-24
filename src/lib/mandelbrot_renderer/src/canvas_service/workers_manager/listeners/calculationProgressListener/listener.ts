import Line = require('progressbar.js/line');
import { CalculationProgressMessage } from '../../../../wasm_worker/types/workerToMain';

export function calculationProgressListener(
	progressBar: Line,
	{ progress }: CalculationProgressMessage['data']
): void {
	progressBar.animate(progress, { duration: 100 });
}
