package segmentcalculator

import (
	"mandelbrot/objects"
	"math"
)

type complexNumber64 struct {
	RealPart      float64
	ImaginaryPart float64
}

func (s *Service) getIterationsFloat64(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel float64,
	offsets objects.Coordinates,
) int64 {
	point := complexNumber64{
		RealPart:      ((float64(coordinates.X)/float64(canvasSize.Width))*zoomLevel)*4 - 2.5 + offsets.X,
		ImaginaryPart: ((float64(coordinates.Y)/float64(canvasSize.Height))*zoomLevel)*2 - 1 + offsets.Y,
	}

	z := complexNumber64{
		RealPart:      0,
		ImaginaryPart: 0,
	}
	for i := int64(0); i < s.maxIterations; i++ {
		z = addComplex64(squareComplex64(z), point)

		if math.Abs(z.RealPart) > THRESHOLD || math.Abs(z.ImaginaryPart) > THRESHOLD {
			return i
		}
	}

	return 0
}

func addComplex64(c1, c2 complexNumber64) complexNumber64 {
	return complexNumber64{
		RealPart:      c1.RealPart + c2.RealPart,
		ImaginaryPart: c1.ImaginaryPart + c2.ImaginaryPart,
	}
}

func mulComplex64(c1, c2 complexNumber64) complexNumber64 {
	return complexNumber64{
		RealPart:      c1.RealPart*c2.RealPart - c1.ImaginaryPart*c2.ImaginaryPart,
		ImaginaryPart: c1.RealPart*c2.ImaginaryPart + c1.ImaginaryPart*c2.RealPart,
	}
}

func squareComplex64(c complexNumber64) complexNumber64 {
	return mulComplex64(c, c)
}
