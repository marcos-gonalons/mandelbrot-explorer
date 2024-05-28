package operationmode

import (
	"mandelbrot/objects/float128"
	"math/big"
)

type Float struct {
	f64      float64
	f128     float128.Float128
	bigFloat big.Float
}

func NewFloat(v float64) Float {
	return Float{
		f64:      v,
		f128:     float128.SetFloat64(v),
		bigFloat: *big.NewFloat(v),
	}
}

func Clone(v Float) Float {
	return Float{
		f64:      v.GetFloat64(),
		f128:     v.GetFloat128(),
		bigFloat: v.GetBigFloat(),
	}
}

func NewFloat64(v float64) Float {
	return Float{f64: v}
}
func NewFloat128(v float128.Float128) Float {
	return Float{f128: v}
}
func NewBigFloat(v big.Float) Float {
	return Float{bigFloat: v}
}

func (f *Float) GetFloat64() float64 {
	return f.f64
}
func (f *Float) GetFloat128() float128.Float128 {
	return f.f128
}

func (f *Float) GetBigFloat() big.Float {
	return f.bigFloat
}
