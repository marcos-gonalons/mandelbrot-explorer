package segmentcalculator

import (
	"mandelbrot/objects"
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
	maxIterations    int64
	progressCallback func(progress float64)
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
	return &Service{
		operationMode,
		offsetsHandler,
		zoomHandler,
		colorService,
		maxIterations,
		progressCallback,
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
	mainIndex := int64(startsAt / 4)
	zoomLevel := s.zoomHandler.GetZoomLevel()
	offsets := s.offsetsHandler.GetAsCoordinates()

	for i := 0; i < segmentLength; i += 4 {
		r, g, b, a := s.getPixelColor(s.getCoordinatesAtIndex(mainIndex, canvasSize.Width), canvasSize, zoomLevel, offsets)

		pixelData[i+0] = r
		pixelData[i+1] = g
		pixelData[i+2] = b
		pixelData[i+3] = a

		mainIndex++

		if resolution <= 1 && i%10000 == 0 {
			s.progressCallback(float64(i) / float64(segmentLength))
		}
	}

	if resolution <= 1 {
		s.progressCallback(1)
	}

	return &pixelData
}

func (s *Service) getCoordinatesAtIndex(index, width int64) objects.Coordinates {
	return objects.Coordinates{
		X: operationmode.NewFloat(float64(index%width + 1)),
		Y: operationmode.NewFloat(math.Floor(float64(index)/float64(width)) + 1),
	}
}

func (s *Service) getPixelColor(
	coordinates objects.Coordinates,
	canvasSize objects.Size,
	zoomLevel operationmode.Float,
	offsets objects.Coordinates,
) (r, g, b, a byte) {
	var iterations int64

	switch s.operationMode.Get() {
	case operationmode.FLOAT64:
		iterations = s.getIterationsFloat64(coordinates, canvasSize, zoomLevel.GetFloat64(), offsets)
	case operationmode.FLOAT128:
		iterations = s.getIterationsFloat128(coordinates, canvasSize, zoomLevel.GetFloat128(), offsets)
	}

	if iterations == 0 {
		return s.colorService.GetColorAtMaxIterations()
	}

	return s.colorService.GetPixelColor(iterations)
}
