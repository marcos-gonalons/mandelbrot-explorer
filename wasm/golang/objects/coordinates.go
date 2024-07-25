package objects

import (
	operationmode "mandelbrot/services/operation_mode"
)

type Coordinates struct {
	X operationmode.Float
	Y operationmode.Float
}

type CoordinatesAsENotationString struct {
	X string `json:"x"`
	Y string `json:"y"`
}
