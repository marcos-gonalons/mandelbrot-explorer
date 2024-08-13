package color

import (
	"mandelbrot/objects"
)

type Service struct {
	colors               []objects.RGBColor
	maxIterations        uint64
	colorScheme          []objects.RGBColor
	saturation           float64
	colorAtMaxIterations objects.RGBColor
	colorChangeFrequency uint64
}

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

func (s *Service) GetSaturation() float64 {
	return s.saturation
}

func (s *Service) GetColorAtMaxIterationsObject() objects.RGBColor {
	return s.colorAtMaxIterations
}

func (s *Service) SetMaxIterations(maxIterations uint64) *Service {
	s.maxIterations = maxIterations
	s.prepareColors()

	return s
}

func (s *Service) SetColorChangeFrequency(value uint64) *Service {
	s.colorChangeFrequency = value
	s.prepareColors()

	return s
}

func (s *Service) GetColorChangeFrequency() uint64 {
	return s.colorChangeFrequency
}

func (s *Service) GetMaxIterations() uint64 {
	return s.maxIterations
}

func (s *Service) GetPixelColor(iterations uint64) (r, g, b, a byte) {
	color := s.colors[iterations%uint64(len(s.colors))]

	return color.R, color.G, color.B, color.A
}

func (s *Service) GetColorAtMaxIterations() (r, g, b, a byte) {
	return s.colorAtMaxIterations.R, s.colorAtMaxIterations.G, s.colorAtMaxIterations.B, s.colorAtMaxIterations.A
}

func (s *Service) GetColorScheme() []objects.RGBColor {
	return s.colorScheme
}

func (s *Service) prepareColors() {
	if s.maxIterations == 0 || len(s.colorScheme) == 0 || s.colorChangeFrequency == 0 {
		return
	}

	s.colors = nil
	currentAssignment := 0
	for i := int64(0); i < int64(s.maxIterations); i++ {
		if i%(int64(s.colorChangeFrequency)) == 0 {
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
