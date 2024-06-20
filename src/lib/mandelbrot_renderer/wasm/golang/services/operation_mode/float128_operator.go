package operationmode

import (
	"mandelbrot/objects/float128"
)

type Float128Operator struct{}

func (s *Float128Operator) Add(f1, f2 Float) Float {
	return NewFloat128(float128.Add(f1.GetFloat128(), f2.GetFloat128()), f1.GetDecimalsAmount())
}

func (s *Float128Operator) Sub(f1, f2 Float) Float {
	return NewFloat128(float128.Sub(f1.GetFloat128(), f2.GetFloat128()), f1.GetDecimalsAmount())
}

func (s *Float128Operator) Mul(f1, f2 Float) Float {
	return NewFloat128(float128.Mul(f1.GetFloat128(), f2.GetFloat128()), f1.GetDecimalsAmount())
}

func (s *Float128Operator) Div(f1, f2 Float) Float {
	return NewFloat128(float128.Div(f1.GetFloat128(), f2.GetFloat128()), f1.GetDecimalsAmount())
}

func (s *Float128Operator) Abs(f1 Float) Float {
	return NewFloat128(float128.Abs(f1.GetFloat128()), f1.GetDecimalsAmount())
}

func (s *Float128Operator) GreaterThan(f1, f2 Float) bool {
	return float128.IsGT(f1.GetFloat128(), f2.GetFloat128())
}

func (s *Float128Operator) GreaterOrEqualThan(f1, f2 Float) bool {
	return float128.IsGE(f1.GetFloat128(), f2.GetFloat128())
}

func (s *Float128Operator) LessThan(f1, f2 Float) bool {
	return float128.IsLT(f1.GetFloat128(), f2.GetFloat128())
}

func (s *Float128Operator) LessOrEqualThan(f1, f2 Float) bool {
	return float128.IsLE(f1.GetFloat128(), f2.GetFloat128())
}

func (s *Float128Operator) Round(f1 Float, decimals uint64) Float {
	// TODO
	return f1
}
