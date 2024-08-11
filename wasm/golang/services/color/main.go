package color

import (
	"mandelbrot/objects"
)

type Service struct {
	colors               []objects.RGBColor
	maxIterations        int64
	colorScheme          []objects.RGBColor
	saturation           float64
	colorAtMaxIterations objects.RGBColor
}

const CHANGE_COLOR_EVERY_N_ITERATIONS = 20

func New() *Service {
	return &Service{}
}

func (s *Service) SetColorAtMaxIterations(colorAtMaxIterations objects.RGBColor) *Service {
	s.colorAtMaxIterations = colorAtMaxIterations
	return s
}

func (s *Service) SetColorScheme(colorScheme []objects.RGBColor) *Service {
	s.colorScheme = colorScheme
	s.prepareColors()

	return s
}

func (s *Service) SetSaturation(value float64) *Service {
	s.saturation = value
	s.prepareColors()

	return s
}

func (s *Service) GetColorAtMaxIterationsObject() objects.RGBColor {
	return s.colorAtMaxIterations
}

func (s *Service) SetMaxIterations(maxIterations int64) *Service {
	s.maxIterations = maxIterations
	s.prepareColors()

	return s
}

func (s *Service) GetMaxIterations() int64 {
	return s.maxIterations
}

func (s *Service) GetPixelColor(iterations int64) (r, g, b, a byte) {
	color := s.colors[iterations%int64(len(s.colors))]

	return color.R, color.G, color.B, color.A
}

func (s *Service) GetColorAtMaxIterations() (r, g, b, a byte) {
	return s.colorAtMaxIterations.R, s.colorAtMaxIterations.G, s.colorAtMaxIterations.B, s.colorAtMaxIterations.A
}

func (s *Service) GetColorScheme() []objects.RGBColor {
	return s.colorScheme
}

func (s *Service) prepareColors() {
	if s.maxIterations == 0 || len(s.colorScheme) == 0 {
		return
	}

	s.colors = nil
	currentAssignment := 0
	for i := int64(0); i < s.maxIterations; i++ {
		if i%(CHANGE_COLOR_EVERY_N_ITERATIONS) == 0 {
			currentAssignment++
			if currentAssignment == len(s.colorScheme) {
				currentAssignment = 0
			}
		}

		r, g, b, a := s.getIterationColor(i, int64(currentAssignment))

		s.colors = append(s.colors, objects.RGBColor{R: r, G: g, B: b, A: a})
	}
}

func (s *Service) getIterationColor(iteration, currentAssignment int64) (r, g, b, a byte) {
	color := s.colorScheme[currentAssignment]

	saturation := (255 * s.saturation) / 100

	color.A = byte(float64(iteration%(255)) * saturation)

	return color.R, color.G, color.B, color.A
}
