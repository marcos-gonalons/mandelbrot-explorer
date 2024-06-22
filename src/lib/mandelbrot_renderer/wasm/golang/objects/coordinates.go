package objects

import (
	"encoding/json"
	operationmode "mandelbrot/services/operation_mode"
	"strconv"
)

type Coordinates struct {
	X operationmode.Float
	Y operationmode.Float
}

type JsonSerializedCoordinates struct {
	X_float64  string
	Y_float64  string
	X_float128 string
	Y_float128 string
}

func (c *Coordinates) MarshalJSON() ([]byte, error) {
	return json.Marshal(JsonSerializedCoordinates{
		X_float64: strconv.FormatFloat(c.X.GetFloat64(), 'E', -1, 64),
		Y_float64: strconv.FormatFloat(c.Y.GetFloat64(), 'E', -1, 64),

		X_float128: c.X.GetFloat128().String(),
		Y_float128: c.Y.GetFloat128().String(),
	})
}
