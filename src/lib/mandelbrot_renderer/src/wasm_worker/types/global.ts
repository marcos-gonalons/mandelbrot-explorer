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
				segmentData: Uint8ClampedArray;
			};
			callbacks: {
				progress: (p: number) => void;
				maxFloat64DepthReached: () => void;
				maxFloat128DepthReached: () => void;
			};
			functions: {
				setMaxIterations: (value: number) => void;
				setColorAtMaxIterations: (r: number, g: number, b: number, a: number) => void;
				setColorScheme: (schemeAsJSONString: string) => void;
				setSaturation: (value: number) => void;
				adjustOffsets: (speed: number, angleInDegrees: number) => string;
				setOffsets: (xAsENotation: string, yAsENotation: string) => string;
				adjustZoom: (
					increase: boolean,
					speed: number,
					strategy: ZoomingStrategy,
					xMouseCoordinate: number,
					yMouseCoordinate: number,
					canvasWidth: number,
					canvasHeight: number
				) => string;
				setZoom: (zoomLevelAsENotation: string) => string | null;
				calculateSegment: (
					canvasWidth: number,
					canvasHeight: number,
					segmentLength: number,
					startsAt: number,
					resolution: number
				) => void;
				setState: (stateAsJSONString: string) => string | null;
			};
		};
	}
}
