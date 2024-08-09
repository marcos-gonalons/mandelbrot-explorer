package color

import (
	"mandelbrot/objects"
)

type Service struct {
	colors               []objects.RGBColor
	maxIterations        int64
	colorScheme          []objects.RGBColor
	colorAtMaxIterations objects.RGBColor
}

const CHANGE_COLOR_EVERY_N_ITERATIONS = 20

func New() *Service {
	service := &Service{}
	service.prepareColors()

	service.SetColorScheme(service.getColorScheme()) // todo: send scheme from JS

	return service
}

func (s *Service) SetColorAtMaxIterations(colorAtMaxIterations objects.RGBColor) *Service {
	s.colorAtMaxIterations = colorAtMaxIterations
	return s
}

func (s *Service) SetColorScheme(colorScheme []objects.RGBColor) *Service {
	s.colorScheme = colorScheme
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

func (s *Service) prepareColors() {
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
	alpha := byte(iteration % (255) * 2)

	color := s.colorScheme[currentAssignment]
	color.A = alpha

	return color.R, color.G, color.B, color.A
}

func (s *Service) getColorScheme() []objects.RGBColor {
	// Second color dictactes the main color at default zoom
	return []objects.RGBColor{
		// CHARTREUSE
		{R: 127, G: 255, B: 0},
		// DODGER_BLUE
		{R: 0, G: 127, B: 255},
		// LIGHT_SLATE_BLUE
		{R: 127, G: 127, B: 255},
		// WHITE
		{R: 255, G: 255, B: 255},
		// LIGHT_CORAL
		{R: 255, G: 127, B: 127},
		// CANARY
		{R: 255, G: 255, B: 127},
		// LIGHT_GREEN
		{R: 127, G: 255, B: 127},
		// ELECTRIC_BLUE
		{R: 127, G: 255, B: 255},
		// ELECTRIC_INDIGO
		{R: 127, G: 0, B: 255},
		// SPRING_GREEN
		{R: 0, G: 255, B: 127},
		// BLUE
		{R: 0, G: 0, B: 255},
		// FUCHSIA_PINK
		{R: 255, G: 127, B: 255},
		// DARK_ORANGE
		{R: 255, G: 127, B: 0},
		// DEEP_PINK
		{R: 255, G: 0, B: 127},
		// FUCHSIA
		{R: 255, G: 0, B: 255},
		// AQUA
		{R: 0, G: 255, B: 255},
		// RED
		{R: 255, G: 0, B: 0},
		// LIME
		{R: 0, G: 255, B: 0},
		// YELLOW
		{R: 255, G: 255, B: 0},
	}
}
