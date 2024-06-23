package operationmode

import (
	"math/big"
)

type BigFloatOperator struct{}

func (s *BigFloatOperator) Add(f1, f2 Float) Float {
	v := new(big.Float).Set(f1.GetBigFloat())
	v.Add(f1.GetBigFloat(), f2.GetBigFloat())

	return NewBigFloat(v, f1.GetDecimalsAmount())
}

func (s *BigFloatOperator) Sub(f1, f2 Float) Float {
	v := new(big.Float).Set(f1.GetBigFloat())
	v.Sub(f1.GetBigFloat(), f2.GetBigFloat())

	return NewBigFloat(v, f1.GetDecimalsAmount())
}

func (s *BigFloatOperator) Mul(f1, f2 Float) Float {
	v := new(big.Float).Set(f1.GetBigFloat())
	v.Mul(f1.GetBigFloat(), f2.GetBigFloat())

	return NewBigFloat(v, f1.GetDecimalsAmount())
}

func (s *BigFloatOperator) Div(f1, f2 Float) Float {
	v := new(big.Float).Set(f1.GetBigFloat())
	v.Quo(f1.GetBigFloat(), f2.GetBigFloat())

	return NewBigFloat(v, f1.GetDecimalsAmount())
}

func (s *BigFloatOperator) Abs(f1 Float) Float {
	v := new(big.Float).Set(f1.GetBigFloat())
	v.Abs(f1.GetBigFloat())

	return NewBigFloat(v, f1.GetDecimalsAmount())
}

func (s *BigFloatOperator) GreaterThan(f1, f2 Float) bool {
	return s.IsGreater(f1.GetBigFloat(), f2.GetBigFloat())
}

func (s *BigFloatOperator) GreaterOrEqualThan(f1, f2 Float) bool {
	return s.IsGreaterOrEquals(f1.GetBigFloat(), f2.GetBigFloat())
}

func (s *BigFloatOperator) LessThan(f1, f2 Float) bool {
	return s.IsLower(f1.GetBigFloat(), f2.GetBigFloat())
}

func (s *BigFloatOperator) LessOrEqualThan(f1, f2 Float) bool {
	return s.IsLowerOrEquals(f1.GetBigFloat(), f2.GetBigFloat())
}

func (s *BigFloatOperator) Round(f1 Float, decimals uint64) Float {
	// TODO
	return f1
}

func (s *BigFloatOperator) IsGreater(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 1
}
func (s *BigFloatOperator) IsGreaterOrEquals(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 1 || s.Equals(n1, n2)
}
func (s *BigFloatOperator) IsLower(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == -1
}
func (s *BigFloatOperator) IsLowerOrEquals(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == -1 || s.Equals(n1, n2)
}
func (s *BigFloatOperator) Equals(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 0
}
