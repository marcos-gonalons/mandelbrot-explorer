package color

import (
	"mandelbrot/objects"
)

type Service struct {
	colors               []objects.RGBColor
	maxIterations        int64
	colorAssignments     []ColorAssignment
	colorAtMaxIterations objects.RGBColor
}

const CHANGE_COLOR_EVERY_N_ITERATIONS = 20

func New(maxIterations int64, colorAtMaxIterations objects.RGBColor) *Service {
	service := &Service{
		maxIterations:        maxIterations,
		colorAssignments:     colorAssignments,
		colorAtMaxIterations: colorAtMaxIterations,
	}
	service.prepareColors()

	return service
}

func (s *Service) SetMaxIterations(maxIterations int64) *Service {
	s.maxIterations = maxIterations
	s.prepareColors()
	return s
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
			if currentAssignment == len(s.colorAssignments) {
				currentAssignment = 0
			}
		}

		r, g, b, a := s.getIterationColor(i, int64(currentAssignment))

		s.colors = append(s.colors, objects.RGBColor{R: r, G: g, B: b, A: a})
	}
}

func (s *Service) getIterationColor(iteration, currentAssignment int64) (r, g, b, a byte) {
	r = byte(0)
	g = byte(0)
	b = byte(0)
	a = byte(iteration % (255) * 2)

	max := byte(255)
	half := byte(127)

	switch s.colorAssignments[currentAssignment] {
	case RED:
		r = max
	case LIME:
		g = max
	case BLUE:
		b = max
	case YELLOW:
		r = max
		g = max
	case FUCHSIA:
		r = max
		b = max
	case AQUA:
		b = max
		g = max
	case WHITE:
		r = max
		g = max
		b = max
	case ELECTRIC_INDIGO:
		r = half
		b = max
	case DEEP_PINK:
		r = max
		b = half
	case CHARTREUSE:
		r = half
		g = max
	case DARK_ORANGE:
		r = max
		g = half
	case SPRING_GREEN:
		g = max
		b = half
	case DODGER_BLUE:
		b = max
		g = half
	case LIGHT_SLATE_BLUE:
		r = half
		g = half
		b = max
	case LIGHT_CORAL:
		r = max
		g = half
		b = half
	case LIGHT_GREEN:
		r = half
		g = max
		b = half
	case CANARY:
		r = max
		g = max
		b = half
	case ELECTRIC_BLUE:
		r = half
		g = max
		b = max
	case FUCHSIA_PINK:
		r = max
		g = half
		b = max
	}

	return
}
