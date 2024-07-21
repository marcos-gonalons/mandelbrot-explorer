package operationmode

import (
	"mandelbrot/objects/float128"
)

type Float struct {
	f64            float64
	f128           float128.Float128
	decimalsAmount uint64
}

func NewFloat(v float64) Float {
	return Float{
		f64:  v,
		f128: float128.SetFloat64(v),
	}
}

func Clone(v Float) Float {
	return Float{
		f64:            v.GetFloat64(),
		f128:           v.GetFloat128(),
		decimalsAmount: v.GetDecimalsAmount(),
	}
}

func NewFloat64(v float64, decimalsAmount uint64) Float {
	return Float{f64: v, decimalsAmount: decimalsAmount}
}
func NewFloat128(v float128.Float128, decimalsAmount uint64) Float {
	return Float{f128: v, decimalsAmount: decimalsAmount}
}

func (f *Float) GetFloat64() float64 {
	return f.f64
}
func (f *Float) GetFloat128() float128.Float128 {
	return f.f128
}

func (f *Float) SetFloat64(v float64) {
	f.f64 = v
}
func (f *Float) SetFloat128(v float128.Float128) {
	f.f128 = v
}

func (f *Float) IncreaseDecimalsAmount() {
	f.decimalsAmount++
}

func (f *Float) DecreaseDecimalsAmount() {
	f.decimalsAmount--
}

func (f *Float) GetDecimalsAmount() uint64 {
	return f.decimalsAmount
}
