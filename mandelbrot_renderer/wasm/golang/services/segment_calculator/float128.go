package segmentcalculator

import (
	"mandelbrot/objects"
	complexnumbers "mandelbrot/objects/complex_numbers"
	"mandelbrot/objects/float128"
)

func (s *Service) getIterationsFloat128(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float128.Float128,
	offsets objects.Coordinates,
) int64 {
	point := s.coordinatesToComplexNumberFloat128(coordinates, canvasSize, zoomLevel, offsets)

	z := complexnumbers.ComplexNumberFloat128{
		RealPart:      float128.Zero(),
		ImaginaryPart: float128.Zero(),
	}
	threshold := float128.SetFloat64(THRESHOLD)
	for i := int64(0); i < s.maxIterations; i++ {
		z = complexnumbers.AddFloat128(complexnumbers.SquareFloat128(z), point)

		if float128.IsGT(float128.Abs(z.RealPart), threshold) || float128.IsGT(float128.Abs(z.ImaginaryPart), threshold) {
			return i
		}
	}
	return 0
}

func (s *Service) coordinatesToComplexNumberFloat128(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float128.Float128,
	offsets objects.Coordinates,
) complexnumbers.ComplexNumberFloat128 {
	realPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.X), float128.SetFloat64(float64(canvasSize.Width))), zoomLevel), float128.SetFloat64(4))
	imaginaryPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.Y), float128.SetFloat64(float64(canvasSize.Height))), zoomLevel), float128.SetFloat64(2))

	realPart = float128.Add(float128.Sub(realPart, float128.SetFloat64(2.5)), offsets.X_float128)
	imaginaryPart = float128.Add(float128.Sub(imaginaryPart, float128.SetFloat64(1)), offsets.Y_float128)

	return complexnumbers.ComplexNumberFloat128{
		RealPart:      realPart,
		ImaginaryPart: imaginaryPart,
	}
}
