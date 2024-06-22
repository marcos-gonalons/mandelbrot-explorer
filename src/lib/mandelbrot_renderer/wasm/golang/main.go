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
var defaultMagnitudeDecimals uint64 = 1
var defaultXOffset float64 = -0.2
var defaultYOffset float64 = -0.2
var defaultColorAtMaxIterations = objects.RGBColor{R: 0, G: 0, B: 0, A: 128}

func main() {
	initServices()

	exportedFunctions := js.Global().Get("WASM").Get("functions")

	exportedFunctions.Set("setMode", js.FuncOf(SetMode))
	exportedFunctions.Set("setMaxIterations", js.FuncOf(SetMaxIterations))
	exportedFunctions.Set("calculateSegment", js.FuncOf(CalculateSegment))
	exportedFunctions.Set("adjustOffsets", js.FuncOf(AdjustOffsets))
	exportedFunctions.Set("setOffsets", js.FuncOf(SetOffsets))
	exportedFunctions.Set("adjustZoom", js.FuncOf(AdjustZoom))
	exportedFunctions.Set("setZoom", js.FuncOf(SetZoom))
	exportedFunctions.Set("setColorAtMaxIterations", js.FuncOf(SetColorAtMaxIterations))

	keepAlive()
}

func initServices() {
	jsCallbacks := js.Global().Get("WASM").Get("callbacks")

	operationMode = operationmode.New(defaultOperationMode)

	offsetsHandler = offsets.New(
		operationMode,
		operationmode.NewFloat(defaultXOffset),
		operationmode.NewFloat(defaultYOffset),
	)

	zoomHandler = zoom.New(
		operationMode,
		offsetsHandler,
		operationmode.NewFloat(defaultZoom),
		operationmode.NewFloat(defaultMagnitude),
		defaultMagnitudeDecimals,
		func() {
			jsCallbacks.Call("maxFloat64DepthReached")
		},
		func() {
			jsCallbacks.Call("maxFloat128DepthReached")
		},
	)

	colorService = color.New(defaultMaxIterations, defaultColorAtMaxIterations)

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
	operationMode.Set(operationmode.Mode(arguments[0].Int()), true)
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
			Width:  int64(arguments[0].Int()),
			Height: int64(arguments[1].Int()),
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
		operationmode.NewFloat(arguments[0].Float()),
		operationmode.NewFloat(arguments[1].Float()),
	)

	coordinates := offsetsHandler.GetAsCoordinates()
	r, _ := coordinates.MarshalJSON()
	return string(r)
}

func SetOffsets(this js.Value, arguments []js.Value) interface{} {
	err := offsetsHandler.Set(arguments[0].String(), arguments[1].String())
	if err != nil {
		return err.Error()
	}
	return nil
}

func AdjustZoom(this js.Value, arguments []js.Value) interface{} {
	zoomHandler.SetMouseCoordinates(operationmode.NewFloat(arguments[3].Float()), operationmode.NewFloat(arguments[4].Float()))
	zoomHandler.SetCanvasSize(int64(arguments[5].Int()), int64(arguments[6].Int()))
	zoomHandler.Adjust(
		arguments[0].Bool(),
		operationmode.NewFloat(arguments[1].Float()),
		zoom.Strategy(arguments[2].Int()),
	)

	return nil
}

func SetZoom(this js.Value, arguments []js.Value) interface{} {
	err := zoomHandler.Set(arguments[0].String())
	if err != nil {
		return err.Error()
	}
	return nil
}

func SetColorAtMaxIterations(this js.Value, arguments []js.Value) interface{} {
	colorService.SetColorAtMaxIterations(objects.RGBColor{
		R: uint8(arguments[0].Int()),
		G: uint8(arguments[1].Int()),
		B: uint8(arguments[2].Int()),
		A: uint8(arguments[3].Int()),
	})
	return nil
}

func keepAlive() {
	c := make(chan struct{}, 0)
	<-c
}
