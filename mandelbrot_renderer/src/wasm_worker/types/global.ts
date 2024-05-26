import { ZoomingStrategy } from '../../canvas_service/zoomHandler';

export {};

declare global {
	var Go: {
		new (): {
			importObject: WebAssembly.Imports;
			run: (instance: WebAssembly.Instance) => void;
		};
	};

	interface Window {
		WASM: {
			sharedVariables: {
				testArray: Uint8ClampedArray;
				segmentData: Uint8ClampedArray;
			};
			callbacks: {
				progress: (p: number) => void;
				maxFloat64DepthReached: () => void;
			};
			functions: {
				transferBytesTest: () => void;
				setMaxIterations: (value: number) => void;
				adjustOffsets: (speed: number, angleInDegrees: number) => void;
				adjustZoom: (
					increase: boolean,
					speed: number,
					strategy: ZoomingStrategy,
					xMouseCoordinate: number,
					yMouseCoordinate: number,
					canvasWidth: number,
					canvasHeight: number
				) => void;
				calculateSegment: (
					canvasWidth: number,
					canvasHeight: number,
					segmentLength: number,
					startsAt: number,
					resolution: number
				) => void;
			};
		};
	}
}
