package operationmode

import (
	"mandelbrot/objects/float128"
	"math"
	"math/big"
	"strconv"
	"strings"
)

type Float struct {
	f64            float64
	f128           float128.Float128
	bigFloat       *big.Float
	decimalsAmount uint64
}

func NewFloat(v float64) Float {
	return Float{
		f64:      v,
		f128:     float128.SetFloat64(v),
		bigFloat: big.NewFloat(v),
	}
}

func Clone(v Float) Float {
	return Float{
		f64:            v.GetFloat64(),
		f128:           v.GetFloat128(),
		bigFloat:       v.GetBigFloat(),
		decimalsAmount: v.GetDecimalsAmount(),
	}
}

func NewFloat64(v float64, decimalsAmount uint64) Float {
	return Float{f64: v, decimalsAmount: decimalsAmount}
}
func NewFloat128(v float128.Float128, decimalsAmount uint64) Float {
	return Float{f128: v, decimalsAmount: decimalsAmount}
}
func NewBigFloat(v *big.Float, decimalsAmount uint64) Float {
	return Float{bigFloat: v, decimalsAmount: decimalsAmount}
}

func (f *Float) GetFloat64() float64 {
	return f.f64
}
func (f *Float) GetFloat128() float128.Float128 {
	return f.f128
}
func (f *Float) GetBigFloat() *big.Float {
	return f.bigFloat
}

func (f *Float) SetFloat64(v float64) {
	f.f64 = v
}
func (f *Float) SetFloat128(v float128.Float128) {
	f.f128 = v
}
func (f *Float) SetBigFloat(v *big.Float) {
	f.bigFloat = v
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

func (f *Float) CreateBigFloatFromENotationString(v string) {
	splits := strings.Split(strings.Join(strings.Split(v, "."), ""), "e-")
	if len(splits) == 1 {
		splits = strings.Split(strings.Join(strings.Split(v, "."), ""), "e+")
	}
	decimalsAmount := len(splits[0])
	amountOfLeadingZeroes, _ := strconv.Atoi(splits[1])

	fractionalDigitCount := uint64(decimalsAmount + amountOfLeadingZeroes - 1)

	precision := f.getPrecision(fractionalDigitCount)

	bigFloat := new(big.Float)
	bigFloat.SetPrec(precision)
	bigFloat.SetString(v)

	f.bigFloat = bigFloat
}

func (f *Float) UpdateBigFloatPrecision() {
	f.bigFloat.SetPrec(uint(f.GetDecimalsAmount()))
}

func (f *Float) getPrecision(decimalsAmount uint64) uint {
	return uint(math.Ceil(float64(decimalsAmount)*math.Log2(10.0)) + math.Log2(10.0))
}
