package color

import (
	"mandelbrot/objects"
)

type Service struct {
	colors           []objects.RGBColor
	maxIterations    int64
	colorAssignments []ColorAssignment
}

const CHANGE_COLOR_EVERY_N_ITERATIONS = 400

func New() *Service {
	service := &Service{
		colorAssignments: assignments,
	}
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

func (s *Service) prepareColors() {
	s.colors = nil
	currentAssignment := 0
	for i := 0; i < int(s.maxIterations); i++ {
		if i%(CHANGE_COLOR_EVERY_N_ITERATIONS) == 0 {
			currentAssignment++
			if currentAssignment == len(s.colorAssignments) {
				currentAssignment = 0
			}
		}

		r := byte(0)
		g := byte(0)
		b := byte(0)
		a := byte(byte(i%(255)) * 3)

		v := 255 - byte(i%(255))
		switch s.colorAssignments[currentAssignment] {
		case RED:
			r = v
		case GREEN:
			g = v
		case BLUE:
			b = v
		case YELLOW:
			r = v
			g = v
		case VIOLET:
			r = v
			b = v
		case TEAL:
			b = v
			g = v
		case WHITE:
			r = v
			g = v
			b = v
		case SOFT_VIOLET:
			r = v / 2
			b = v
		case PINK:
			r = v
			b = v / 2
		case CHARTREUSE:
			r = v / 2
			g = v
		case ORANGE:
			r = v
			g = v / 2
		case SPRING_GREEN:
			g = v
			b = v / 2
		case SOFT_BLUE:
			b = v
			g = v / 2
		}

		s.colors = append(s.colors, objects.RGBColor{R: r, G: g, B: b, A: a})
	}
}
