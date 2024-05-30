package operationmode

import "math"

type Float64Operator struct{}

func (s *Float64Operator) Add(f1, f2 Float) Float {
	return NewFloat64(f1.GetFloat64() + f2.GetFloat64())
}

func (s *Float64Operator) Sub(f1, f2 Float) Float {
	return NewFloat64(f1.GetFloat64() - f2.GetFloat64())
}

func (s *Float64Operator) Mul(f1, f2 Float) Float {
	return NewFloat64(f1.GetFloat64() * f2.GetFloat64())
}

func (s *Float64Operator) Div(f1, f2 Float) Float {
	return NewFloat64(f1.GetFloat64() / f2.GetFloat64())
}

func (s *Float64Operator) Abs(f1 Float) Float {
	return NewFloat64(math.Abs(f1.GetFloat64()))
}

func (s *Float64Operator) GreaterThan(f1, f2 Float) bool {
	return f1.GetFloat64() > f2.GetFloat64()
}

func (s *Float64Operator) GreaterOrEqualThan(f1, f2 Float) bool {
	return f1.GetFloat64() >= f2.GetFloat64()
}

func (s *Float64Operator) LessThan(f1, f2 Float) bool {
	return f1.GetFloat64() < f2.GetFloat64()
}

func (s *Float64Operator) LessOrEqualThan(f1, f2 Float) bool {
	return f1.GetFloat64() <= f2.GetFloat64()
}

func (s *Float64Operator) Round(f1 Float, decimals uint64) Float {
	roundDecimals := math.Pow(10, float64(decimals))
	return NewFloat64(math.Round(f1.GetFloat64()*roundDecimals) / roundDecimals)
}
