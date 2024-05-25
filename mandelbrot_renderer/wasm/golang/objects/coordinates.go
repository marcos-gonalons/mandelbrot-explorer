package objects

import (
	"mandelbrot/objects/float128"
)

type Coordinates struct {
	X          float64
	Y          float64
	X_float128 float128.Float128
	Y_float128 float128.Float128
}
