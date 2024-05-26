package segmentcalculator

import (
	"mandelbrot/objects"
	complexnumbers "mandelbrot/objects/complex_numbers"
	"mandelbrot/objects/float128"
	"mandelbrot/services/color"
	"mandelbrot/services/offsets"
	operationmode "mandelbrot/services/operation_mode"
	"mandelbrot/services/zoom"
	"math"
)

type Service struct {
	operationMode    *operationmode.Service
	offsetsHandler   *offsets.Handler
	zoomHandler      *zoom.Handler
	colorService     *color.Service
	progressCallback func(progress float64)
	maxIterations    int64
}

const THRESHOLD = 3

func New(
	operationMode *operationmode.Service,
	offsetsHandler *offsets.Handler,
	zoomHandler *zoom.Handler,
	colorService *color.Service,
	maxIterations int64,
	progressCallback func(progress float64),
) *Service {
	colorService.SetMaxIterations(maxIterations)
	return &Service{
		operationMode,
		offsetsHandler,
		zoomHandler,
		colorService,
		progressCallback,
		maxIterations,
	}
}

func (s *Service) SetMaxIterations(maxIterations int64) *Service {
	s.maxIterations = maxIterations
	return s
}

func (s *Service) CalculateSegmentColors(
	canvasSize objects.Size,
	segmentLength int,
	startsAt int,
	resolution float64,
) *[]byte {
	pixelData := make([]byte, segmentLength)
	mainIndex := startsAt / 4

	for i := 0; i < segmentLength; i += 4 {
		r, g, b, a := s.getPixelColor(s.getCoordinatesAtIndex(mainIndex, canvasSize.Width), canvasSize)

		pixelData[i+0] = r
		pixelData[i+1] = g
		pixelData[i+2] = b
		pixelData[i+3] = a

		mainIndex++

		if i%10000 == 0 && resolution <= 1 {
			s.progressCallback(float64(i) / float64(segmentLength))
		}
	}

	if resolution <= 1 {
		s.progressCallback(1)
	}

	return &pixelData
}

func (s *Service) getCoordinatesAtIndex(index, width int) objects.Coordinates {
	return objects.Coordinates{
		X: float64(index%width + 1),
		Y: math.Floor(float64(index)/float64(width)) + 1,
	}
}

func (s *Service) getPixelColor(coordinates objects.Coordinates, canvasSize objects.Size) (r, g, b, a byte) {
	iterationsPerformed := s.getIterations(s.CoordinatesToComplexNumber(
		coordinates,
		canvasSize,
		s.offsetsHandler.GetAsCoordinates(),
	))

	if iterationsPerformed == 0 {
		return 0, 0, 0, math.MaxUint8
	}

	return s.colorService.GetPixelColor(iterationsPerformed)
}

func (s *Service) getIterations(c interface{}) int64 {
	i := int64(0)

	if s.operationMode.IsFloat64() {
		z := complexnumbers.ComplexNumber{
			RealPart:      0,
			ImaginaryPart: 0,
		}
		for i = 0; i < s.maxIterations; i++ {
			z = complexnumbers.Add(complexnumbers.Square(z), c.(complexnumbers.ComplexNumber))

			if math.Abs(z.RealPart) > THRESHOLD || math.Abs(z.ImaginaryPart) > THRESHOLD {
				return i
			}
		}
	}

	if s.operationMode.IsFloat128() {
		z := complexnumbers.ComplexNumberFloat128{
			RealPart:      float128.Zero(),
			ImaginaryPart: float128.Zero(),
		}
		threshold := float128.SetFloat64(THRESHOLD)
		for i = 0; i < s.maxIterations; i++ {
			z = complexnumbers.AddFloat128(complexnumbers.SquareFloat128(z), c.(complexnumbers.ComplexNumberFloat128))

			if float128.IsGT(float128.Abs(z.RealPart), threshold) || float128.IsGT(float128.Abs(z.ImaginaryPart), threshold) {
				return i
			}
		}
	}

	return 0
}

func (s *Service) CoordinatesToComplexNumber(
	coordinates objects.Coordinates,
	size objects.Size,
	offsets objects.Coordinates,
) interface{} {
	if s.operationMode.IsFloat64() {
		zoomLevel := s.zoomHandler.GetZoomLevel().(float64)

		return complexnumbers.ComplexNumber{
			RealPart:      ((float64(coordinates.X)/float64(size.Width))*zoomLevel)*4 - 2.5 + float64(offsets.X),
			ImaginaryPart: ((float64(coordinates.Y)/float64(size.Height))*zoomLevel)*2 - 1 + float64(offsets.Y),
		}
	}

	if s.operationMode.IsFloat128() {
		zoomLevel := s.zoomHandler.GetZoomLevel().(float128.Float128)

		realPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.X), float128.SetFloat64(float64(size.Width))), zoomLevel), float128.SetFloat64(4))
		imaginaryPart := float128.Mul(float128.Mul(float128.Div(float128.SetFloat64(coordinates.Y), float128.SetFloat64(float64(size.Height))), zoomLevel), float128.SetFloat64(2))

		realPart = float128.Add(float128.Sub(realPart, float128.SetFloat64(2.5)), offsets.X_float128)
		imaginaryPart = float128.Add(float128.Sub(imaginaryPart, float128.SetFloat64(1)), offsets.Y_float128)

		return complexnumbers.ComplexNumberFloat128{
			RealPart:      realPart,
			ImaginaryPart: imaginaryPart,
		}
	}

	return nil
}
