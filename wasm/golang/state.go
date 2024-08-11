package main

import (
	objects "mandelbrot/objects"
	operationmode "mandelbrot/services/operation_mode"
)

type State struct {
	OperationMode        operationmode.Mode
	MaxIterations        int64
	ZoomAsENotation      string
	MagnitudeAsENotation string
	MagnitudeDecimals    uint64
	OffsetsAsENotation   objects.CoordinatesAsENotationString
	ColorAtMaxIterations objects.RGBColor
	ColorScheme          []objects.RGBColor
	Brightness           float64
}
