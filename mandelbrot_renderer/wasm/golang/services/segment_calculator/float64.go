package segmentcalculator

import (
	"mandelbrot/objects"
	complexnumbers "mandelbrot/objects/complex_numbers"
	"math"
)

func (s *Service) getIterationsFloat64(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float64,
	offsets objects.Coordinates,
) int64 {
	point := complexnumbers.ComplexNumber{
		RealPart:      ((float64(coordinates.X)/float64(canvasSize.Width))*zoomLevel)*4 - 2.5 + float64(offsets.X),
		ImaginaryPart: ((float64(coordinates.Y)/float64(canvasSize.Height))*zoomLevel)*2 - 1 + float64(offsets.Y),
	}

	z := complexnumbers.ComplexNumber{
		RealPart:      0,
		ImaginaryPart: 0,
	}
	for i := int64(0); i < s.maxIterations; i++ {
		z = complexnumbers.Add(complexnumbers.Square(z), point)

		if math.Abs(z.RealPart) > THRESHOLD || math.Abs(z.ImaginaryPart) > THRESHOLD {
			return i
		}
	}

	return 0
}
