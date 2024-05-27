package segmentcalculator

import (
	"mandelbrot/objects"
	"mandelbrot/objects/float128"
)

func (s *Service) getIterationsFloat128(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float128.Float128,
	offsets objects.Coordinates,
) int64 {
	point := s.coordinatesTocomplexNumber128(coordinates, canvasSize, zoomLevel, offsets)

	z := complexNumber128{
		RealPart:      float128.Zero(),
		ImaginaryPart: float128.Zero(),
	}
	threshold := float128.SetFloat64(THRESHOLD)
	for i := int64(0); i < s.maxIterations; i++ {
		z = addComplex128(squareComplex128(z), point)

		if float128.IsGT(float128.Abs(z.RealPart), threshold) || float128.IsGT(float128.Abs(z.ImaginaryPart), threshold) {
			return i
		}
	}
	return 0
}

func (s *Service) coordinatesTocomplexNumber128(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float128.Float128,
	offsets objects.Coordinates,
) complexNumber128 {
	realPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.X), float128.SetFloat64(float64(canvasSize.Width))), zoomLevel), float128.SetFloat64(4))
	imaginaryPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.Y), float128.SetFloat64(float64(canvasSize.Height))), zoomLevel), float128.SetFloat64(2))

	realPart = float128.Add(float128.Sub(realPart, float128.SetFloat64(2.5)), offsets.X_float128)
	imaginaryPart = float128.Add(float128.Sub(imaginaryPart, float128.SetFloat64(1)), offsets.Y_float128)

	return complexNumber128{
		RealPart:      realPart,
		ImaginaryPart: imaginaryPart,
	}
}

type complexNumber128 struct {
	RealPart      float128.Float128
	ImaginaryPart float128.Float128
}

func addComplex128(c1, c2 complexNumber128) complexNumber128 {
	return complexNumber128{
		RealPart:      float128.Add(c1.RealPart, c2.RealPart),
		ImaginaryPart: float128.Add(c1.ImaginaryPart, c2.ImaginaryPart),
	}
}

func mulComplex128(c1, c2 complexNumber128) complexNumber128 {
	return complexNumber128{
		RealPart:      float128.Sub(float128.Mul(c1.RealPart, c2.RealPart), float128.Mul(c1.ImaginaryPart, c2.ImaginaryPart)),
		ImaginaryPart: float128.Add(float128.Mul(c1.RealPart, c2.ImaginaryPart), float128.Mul(c1.ImaginaryPart, c2.RealPart)),
	}
}

func squareComplex128(c complexNumber128) complexNumber128 {
	return mulComplex128(c, c)
}
