package main

import (
	"encoding/json"
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

func main() {
	initServices()

	exportedFunctions := js.Global().Get("WASM").Get("functions")

	exportedFunctions.Set("setMaxIterations", js.FuncOf(SetMaxIterations))
	exportedFunctions.Set("calculateSegment", js.FuncOf(CalculateSegment))
	exportedFunctions.Set("adjustOffsets", js.FuncOf(AdjustOffsets))
	exportedFunctions.Set("setOffsets", js.FuncOf(SetOffsets))
	exportedFunctions.Set("adjustZoom", js.FuncOf(AdjustZoom))
	exportedFunctions.Set("setZoom", js.FuncOf(SetZoom))
	exportedFunctions.Set("setColorAtMaxIterations", js.FuncOf(SetColorAtMaxIterations))
	exportedFunctions.Set("setColorScheme", js.FuncOf(SetColorScheme))
	exportedFunctions.Set("setSaturation", js.FuncOf(SetSaturation))
	exportedFunctions.Set("setColorChangeFrequency", js.FuncOf(SetColorChangeFrequency))
	exportedFunctions.Set("getState", js.FuncOf(GetState))
	exportedFunctions.Set("setState", js.FuncOf(SetState))

	keepAlive()
}

func initServices() {
	jsCallbacks := js.Global().Get("WASM").Get("callbacks")

	operationMode = operationmode.New()

	offsetsHandler = offsets.New(operationMode)

	zoomHandler = zoom.New(
		operationMode,
		offsetsHandler,
		func() {
			jsCallbacks.Call("maxFloat64DepthReached")
		},
		func() {
			jsCallbacks.Call("maxFloat128DepthReached")
		},
	)

	colorService = color.New()

	segmentCalculatorService = segmentcalculator.New(
		operationMode,
		offsetsHandler,
		zoomHandler,
		colorService,
		func(progress float64) {
			jsCallbacks.Call("progress", progress)
		},
	)

	operationMode.AddListener(offsetsHandler)
	operationMode.AddListener(zoomHandler)
}

func SetMaxIterations(this js.Value, arguments []js.Value) interface{} {
	maxIterations := arguments[0].Int()
	segmentCalculatorService.SetMaxIterations(uint64(maxIterations))
	colorService.SetMaxIterations(uint64(maxIterations))
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

	r, _ := json.Marshal(objects.CoordinatesAsENotationString{
		X: operationMode.GetAsENotationString(&coordinates.X, 32),
		Y: operationMode.GetAsENotationString(&coordinates.Y, 32),
	})
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

	offsets := offsetsHandler.GetAsCoordinates()

	r, _ := json.Marshal(struct {
		XOffset string `json:"xOffsetAsENotation"`
		YOffset string `json:"yOffsetAsENotation"`
		Zoom    string `json:"zoomAsENotation"`
	}{
		XOffset: operationMode.GetAsENotationString(&offsets.X, 32),
		YOffset: operationMode.GetAsENotationString(&offsets.Y, 32),
		Zoom:    zoomHandler.GetZoomLevelAsENotation(),
	})

	return string(r)
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

func SetColorScheme(this js.Value, arguments []js.Value) interface{} {
	var colorScheme []objects.RGBColor

	err := json.Unmarshal([]byte(arguments[0].String()), &colorScheme)
	if err != nil {
		return err.Error()
	}

	colorService.SetColorScheme(colorScheme)
	return nil
}

func SetSaturation(this js.Value, arguments []js.Value) interface{} {
	colorService.SetSaturation(arguments[0].Float())
	return nil
}

func SetColorChangeFrequency(this js.Value, arguments []js.Value) interface{} {
	colorService.SetColorChangeFrequency(uint64(arguments[0].Int()))
	return nil
}

func GetState(this js.Value, arguments []js.Value) interface{} {
	state := State{
		OperationMode:        operationMode.Get(),
		MaxIterations:        colorService.GetMaxIterations(),
		ColorChangeFrequency: colorService.GetColorChangeFrequency(),
		Saturation:           colorService.GetSaturation(),
		ZoomAsENotation:      zoomHandler.GetZoomLevelAsENotation(),
		MagnitudeAsENotation: zoomHandler.GetMagnitudeAsENotation(),
		MagnitudeDecimals:    zoomHandler.GetMagnitudeDecimals(),
		OffsetsAsENotation:   offsetsHandler.GetAsENotationStrings(),
		ColorAtMaxIterations: colorService.GetColorAtMaxIterationsObject(),
		ColorScheme:          colorService.GetColorScheme(),
	}

	r, _ := json.Marshal(state)
	return string(r)
}

func SetState(this js.Value, arguments []js.Value) interface{} {
	state := &State{}

	err := json.Unmarshal([]byte(arguments[0].String()), state)

	colorService.SetSaturation(state.Saturation)
	colorService.SetMaxIterations(state.MaxIterations)
	colorService.SetColorScheme(state.ColorScheme)
	colorService.SetColorChangeFrequency(state.ColorChangeFrequency)
	colorService.SetColorAtMaxIterations(state.ColorAtMaxIterations)

	segmentCalculatorService.SetMaxIterations(state.MaxIterations)

	zoomHandler.Set(state.ZoomAsENotation)
	offsetsHandler.Set(state.OffsetsAsENotation.X, state.OffsetsAsENotation.Y)
	operationMode.Set(state.OperationMode, false)

	if err != nil {
		return "error setting the state " + err.Error()
	}

	return nil
}

func keepAlive() {
	c := make(chan struct{}, 0)
	<-c
}
