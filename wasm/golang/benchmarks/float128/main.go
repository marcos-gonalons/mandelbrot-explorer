package main

import (
	"float128_benchmark/float128"
	"fmt"
	"time"
)

type ComplexNumber struct {
	RealPart      float128.Float128
	ImaginaryPart float128.Float128
}

func Add(c1, c2 ComplexNumber) ComplexNumber {
	return ComplexNumber{
		RealPart:      float128.Add(c1.RealPart, c2.RealPart),
		ImaginaryPart: float128.Add(c1.ImaginaryPart, c2.ImaginaryPart),
	}
}

func Multiply(c1, c2 ComplexNumber) ComplexNumber {
	return ComplexNumber{
		RealPart:      float128.Sub(float128.Mul(c1.RealPart, c2.RealPart), float128.Mul(c1.ImaginaryPart, c2.ImaginaryPart)),
		ImaginaryPart: float128.Add(float128.Mul(c1.RealPart, c2.ImaginaryPart), float128.Mul(c1.ImaginaryPart, c2.RealPart)),
	}
}

func Square(c ComplexNumber) ComplexNumber {
	return Multiply(c, c)
}

func main() {
	c := ComplexNumber{
		RealPart:      float128.SetFloat64(0.11),
		ImaginaryPart: float128.SetFloat64(-1.13),
	}

	start := time.Now().UnixMilli()
	for i := 0; i < 200000000; i++ {
		Add(c, c)
	}
	fmt.Println(time.Now().UnixMilli() - start)
}
