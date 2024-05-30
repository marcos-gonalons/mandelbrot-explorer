package main

import (
	"fmt"
	"time"
)

type ComplexNumber struct {
	RealPart      float64
	ImaginaryPart float64
}

func Add(c1, c2 ComplexNumber) ComplexNumber {
	return ComplexNumber{
		RealPart:      c1.RealPart + c2.RealPart,
		ImaginaryPart: c1.ImaginaryPart + c2.ImaginaryPart,
	}
}

func Multiply(c1, c2 ComplexNumber) ComplexNumber {
	return ComplexNumber{
		RealPart:      c1.RealPart*c2.RealPart - c1.ImaginaryPart*c2.ImaginaryPart,
		ImaginaryPart: c1.RealPart*c2.ImaginaryPart + c1.ImaginaryPart*c2.RealPart,
	}
}

func Square(c ComplexNumber) ComplexNumber {
	return Multiply(c, c)
}

func main() {
	z := ComplexNumber{
		RealPart:      float64(0.92311),
		ImaginaryPart: float64(-1.111111009991),
	}

	start := time.Now().UnixMilli()
	for i := 0; i < 200000000; i++ {
		Multiply(z, z)
	}
	fmt.Println(time.Now().UnixMilli() - start)
}
