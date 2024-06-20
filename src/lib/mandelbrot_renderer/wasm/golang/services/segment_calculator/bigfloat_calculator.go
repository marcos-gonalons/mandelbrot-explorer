package segmentcalculator

import (
	"mandelbrot/objects"
	"math/big"
)

func (s *Service) getIterationsBigFloat(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel *big.Float,
	offsets objects.Coordinates,
) int64 {
	point := s.coordinatesTocomplexNumberBigFloat(coordinates, canvasSize, zoomLevel, offsets)

	z := &ComplexNumberBigFloat{
		RealPart:      big.NewFloat(0),
		ImaginaryPart: big.NewFloat(0),
	}
	threshold := big.NewFloat(THRESHOLD)

	for i := int64(0); i < s.maxIterations; i++ {
		z = addBigFloat(squareBigFloat(z), &point)

		if isGreaterThan(z.RealPart, threshold) || isGreaterThan(z.ImaginaryPart, threshold) {
			return i
		}
	}
	return 0
}

func (s *Service) coordinatesTocomplexNumberBigFloat(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel *big.Float,
	offsets objects.Coordinates,
) ComplexNumberBigFloat {
	xCoordinate := new(big.Float).Set(coordinates.X.GetBigFloat())
	yCoordinate := new(big.Float).Set(coordinates.Y.GetBigFloat())
	canvasWidth := big.NewFloat(float64(canvasSize.Width))
	canvasHeight := big.NewFloat(float64(canvasSize.Height))

	divRealPart := xCoordinate.Quo(xCoordinate, canvasWidth)
	mulRealPart := divRealPart.Mul(divRealPart, zoomLevel)
	realPart := mulRealPart.Mul(mulRealPart, big.NewFloat(float64(4)))

	divImaginaryPart := yCoordinate.Quo(yCoordinate, canvasHeight)
	mulImaginaryPaty := divImaginaryPart.Mul(divImaginaryPart, zoomLevel)
	imaginaryPart := mulImaginaryPaty.Mul(mulImaginaryPaty, big.NewFloat(float64(2)))

	auxRealPart := new(big.Float).Set(realPart)
	subRealPart := auxRealPart.Sub(realPart, big.NewFloat(float64(2.5)))
	realPart = realPart.Add(subRealPart, offsets.X.GetBigFloat())

	auxImaginaryPart := new(big.Float).Set(imaginaryPart)
	subImaginaryPart := auxImaginaryPart.Sub(imaginaryPart, big.NewFloat(float64(1)))
	imaginaryPart = imaginaryPart.Add(subImaginaryPart, offsets.Y.GetBigFloat())

	return ComplexNumberBigFloat{
		RealPart:      realPart,
		ImaginaryPart: imaginaryPart,
	}
}

type ComplexNumberBigFloat struct {
	RealPart      *big.Float
	ImaginaryPart *big.Float
}

func addBigFloat(c1, c2 *ComplexNumberBigFloat) *ComplexNumberBigFloat {
	c1.RealPart.Add(c1.RealPart, c2.RealPart)
	c1.ImaginaryPart.Add(c1.ImaginaryPart, c2.ImaginaryPart)

	return c1
}

func multiplyBigFloat(c1, c2 *ComplexNumberBigFloat) *ComplexNumberBigFloat {
	c1RealPart := new(big.Float).Set(c1.RealPart)
	c1Imaginary := new(big.Float).Set(c1.ImaginaryPart)

	c1.RealPart = c1.RealPart.Mul(c1.RealPart, c2.RealPart).Sub(c1.RealPart, c1.ImaginaryPart.Mul(c1.ImaginaryPart, c2.ImaginaryPart))
	c1.ImaginaryPart = c1.ImaginaryPart.Mul(c1RealPart, c2.ImaginaryPart).Add(c1.ImaginaryPart, c1Imaginary.Mul(c1Imaginary, c2.RealPart))

	return c1
}

func squareBigFloat(c *ComplexNumberBigFloat) *ComplexNumberBigFloat {
	cc := &ComplexNumberBigFloat{
		RealPart:      new(big.Float).Set(c.RealPart),
		ImaginaryPart: new(big.Float).Set(c.ImaginaryPart),
	}
	return multiplyBigFloat(c, cc)
}

func isGreaterThan(n1, n2 *big.Float) bool {
	return n1.Cmp(n2) == 1
}
