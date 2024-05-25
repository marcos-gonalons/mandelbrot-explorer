package main

import (
	"fmt"
	"time"

	"github.com/db47h/decimal"
)

type ComplexNumber struct {
	RealPart      *decimal.Decimal
	ImaginaryPart *decimal.Decimal
}

func Add(c1, c2 *ComplexNumber) *ComplexNumber {
	c1.RealPart.Add(c1.RealPart, c2.RealPart)
	c1.ImaginaryPart.Add(c1.ImaginaryPart, c2.ImaginaryPart)

	return c1
}

func Multiply(c1, c2 *ComplexNumber) *ComplexNumber {
	c1RealPart := new(decimal.Decimal).Set(c1.RealPart)
	c1Imaginary := new(decimal.Decimal).Set(c1.ImaginaryPart)

	c1.RealPart = c1.RealPart.Mul(c1.RealPart, c2.RealPart).Sub(c1.RealPart, c1.ImaginaryPart.Mul(c1.ImaginaryPart, c2.ImaginaryPart))
	c1.ImaginaryPart = c1.ImaginaryPart.Mul(c1RealPart, c2.ImaginaryPart).Add(c1.ImaginaryPart, c1Imaginary.Mul(c1Imaginary, c2.RealPart))

	return c1
}

func Square(c *ComplexNumber) *ComplexNumber {
	cc := &ComplexNumber{
		RealPart:      new(decimal.Decimal).Set(c.RealPart),
		ImaginaryPart: new(decimal.Decimal).Set(c.ImaginaryPart),
	}
	return Multiply(c, cc)
}

func IsGreaterThan(n1, n2 *decimal.Decimal) bool {
	return n1.Cmp(n2) == 1
}
func IsLowerThan(n1, n2 *decimal.Decimal) bool {
	return n1.Cmp(n2) == -1
}
func Equals(n1, n2 *decimal.Decimal) bool {
	return n1.Cmp(n2) == 0
}

func main() {
	z := &ComplexNumber{
		RealPart:      new(decimal.Decimal).SetFloat64(0.92311),
		ImaginaryPart: new(decimal.Decimal).SetFloat64(-1.111111009991),
	}

	start := time.Now().UnixMilli()
	for i := 0; i < 200000000; i++ {
		z = Add(z, z)
	}
	fmt.Println(time.Now().UnixMilli() - start)
}
