package complexnumbers

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
