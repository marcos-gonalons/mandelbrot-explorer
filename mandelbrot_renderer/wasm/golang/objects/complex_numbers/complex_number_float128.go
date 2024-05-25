package complexnumbers

import "mandelbrot/objects/float128"

type ComplexNumberFloat128 struct {
	RealPart      float128.Float128
	ImaginaryPart float128.Float128
}

func AddFloat128(c1, c2 ComplexNumberFloat128) ComplexNumberFloat128 {
	return ComplexNumberFloat128{
		RealPart:      float128.Add(c1.RealPart, c2.RealPart),
		ImaginaryPart: float128.Add(c1.ImaginaryPart, c2.ImaginaryPart),
	}
}

func MultiplyFloat128(c1, c2 ComplexNumberFloat128) ComplexNumberFloat128 {
	return ComplexNumberFloat128{
		RealPart:      float128.Sub(float128.Mul(c1.RealPart, c2.RealPart), float128.Mul(c1.ImaginaryPart, c2.ImaginaryPart)),
		ImaginaryPart: float128.Add(float128.Mul(c1.RealPart, c2.ImaginaryPart), float128.Mul(c1.ImaginaryPart, c2.RealPart)),
	}
}

func SquareFloat128(c ComplexNumberFloat128) ComplexNumberFloat128 {
	return MultiplyFloat128(c, c)
}
