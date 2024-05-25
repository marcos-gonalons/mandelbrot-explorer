package complexnumbers

/*
import "math/big"


type ComplexNumberBigFloat struct {
	RealPart      *big.Float
	ImaginaryPart *big.Float
}

func Add(c1, c2 ComplexNumberBigFloat) ComplexNumberBigFloat {
	c1.RealPart.Add(c1.RealPart, c2.RealPart)
	c1.ImaginaryPart.Add(c1.ImaginaryPart, c2.ImaginaryPart)

	return c1
}

func Multiply(c1, c2 ComplexNumberBigFloat) ComplexNumberBigFloat {
	c1RealPart := new(big.Float).Set(c1.RealPart)
	c1Imaginary := new(big.Float).Set(c1.ImaginaryPart)

	c1.RealPart = c1.RealPart.Mul(c1.RealPart, c2.RealPart).Sub(c1.RealPart, c1.ImaginaryPart.Mul(c1.ImaginaryPart, c2.ImaginaryPart))
	c1.ImaginaryPart = c1.ImaginaryPart.Mul(c1RealPart, c2.ImaginaryPart).Add(c1.ImaginaryPart, c1Imaginary.Mul(c1Imaginary, c2.RealPart))

	return c1
}

func Square(c ComplexNumberBigFloat) ComplexNumberBigFloat {
	cc := ComplexNumberBigFloat{
		RealPart:      new(big.Float).Set(c.RealPart),
		ImaginaryPart: new(big.Float).Set(c.ImaginaryPart),
	}
	return Multiply(c, cc)
}

func IsGreaterThan(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 1
}
func IsLowerThan(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == -1
}
func Equals(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 0
}
*/
