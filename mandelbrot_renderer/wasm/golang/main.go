package main

import (
	objects "mandelbrot/objects"
	"mandelbrot/services/color"
	"mandelbrot/services/offsets"
	operationmode "mandelbrot/services/operation_mode"
	segmentcalculator "mandelbrot/services/segment_calculator"
	"mandelbrot/services/zoom"
	"syscall/js"
)

var offsetsHandler *offsets.Handler
var zoomHandler *zoom.Handler
var colorService *color.Service
var segmentCalculatorService *segmentcalculator.Service
var operationMode *operationmode.Service

var defaultOperationMode = operationmode.FLOAT64
var defaultMaxIterations int64 = 2000
var defaultZoom float64 = 1.2
var defaultMagnitude float64 = 0.1
var defaultMagnitudeDecimals int = 1
var defaultXOffset float64 = -0.2
var defaultYOffset float64 = -0.2

func main() {
	initServices()

	js.Global().Get("WASM").Get("functions").Set("setMode", js.FuncOf(SetMode))
	js.Global().Get("WASM").Get("functions").Set("setMaxIterations", js.FuncOf(SetMaxIterations))
	js.Global().Get("WASM").Get("functions").Set("calculateSegment", js.FuncOf(CalculateSegment))
	js.Global().Get("WASM").Get("functions").Set("adjustOffsets", js.FuncOf(AdjustOffsets))
	js.Global().Get("WASM").Get("functions").Set("adjustZoom", js.FuncOf(AdjustZoom))

	keepAlive()
}

func initServices() {
	jsCallbacks := js.Global().Get("WASM").Get("callbacks")

	operationMode = operationmode.New(defaultOperationMode)

	offsetsHandler = offsets.New(operationMode, defaultXOffset, defaultYOffset)

	zoomHandler = zoom.New(
		operationMode,
		offsetsHandler,
		defaultZoom,
		defaultMagnitude,
		defaultMagnitudeDecimals,
		func() {
			jsCallbacks.Call("maxFloat64DepthReached")
		},
	)

	colorService = color.New()

	segmentCalculatorService = segmentcalculator.New(
		operationMode,
		offsetsHandler,
		zoomHandler,
		colorService,
		defaultMaxIterations,
		func(progress float64) {
			jsCallbacks.Call("progress", progress)
		},
	)

	operationMode.AddListener(offsetsHandler)
	operationMode.AddListener(zoomHandler)
}

func SetMode(this js.Value, arguments []js.Value) interface{} {
	operationMode.Set(operationmode.Mode(arguments[0].Int()))
	return nil
}

func SetMaxIterations(this js.Value, arguments []js.Value) interface{} {
	maxIterations := arguments[0].Int()
	segmentCalculatorService.SetMaxIterations(int64(maxIterations))
	colorService.SetMaxIterations(int64(maxIterations))
	return nil
}

func CalculateSegment(this js.Value, arguments []js.Value) interface{} {
	segmentDataJS := js.Global().Get("WASM").Get("sharedVariables").Get("segmentData")

	pixelData := segmentCalculatorService.CalculateSegmentColors(
		objects.Size{
			Width:  arguments[0].Int(),
			Height: arguments[1].Int(),
		},
		arguments[2].Int(),
		arguments[3].Int(),
		arguments[4].Float(),
	)

	js.CopyBytesToJS(segmentDataJS, *pixelData)
	return nil
}

func AdjustOffsets(this js.Value, arguments []js.Value) interface{} {
	offsetsHandler.Adjust(
		zoomHandler.GetZoomLevel(),
		arguments[0].Float(),
		arguments[1].Int(),
	)

	return nil
}

func AdjustZoom(this js.Value, arguments []js.Value) interface{} {
	zoomHandler.SetMouseCoordinates(objects.Coordinates{
		X: arguments[3].Float(),
		Y: arguments[4].Float(),
	})
	zoomHandler.SetCanvasSize(objects.Size{
		Width:  arguments[5].Int(),
		Height: arguments[6].Int(),
	})
	zoomHandler.Adjust(
		arguments[0].Bool(),
		arguments[1].Float(),
		zoom.Strategy(arguments[2].Int()),
	)

	return nil
}

func keepAlive() {
	c := make(chan struct{}, 0)
	<-c
}
