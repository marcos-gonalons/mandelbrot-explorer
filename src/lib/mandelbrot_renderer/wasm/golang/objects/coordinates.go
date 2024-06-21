package objects

import (
	operationmode "mandelbrot/services/operation_mode"
)

type Coordinates struct {
	X operationmode.Float `json:"x"`
	Y operationmode.Float `json:"y"`
}

func (c *Coordinates) MarshalJSON() ([]byte, error) {
	// todo: return proper strings using float128 package
	return []byte("{}"), nil
}
