package color

type ColorAssignment uint

const (
	RED ColorAssignment = iota
	GREEN
	BLUE
	WHITE
	VIOLET
	YELLOW
	TEAL
	ORANGE
	SOFT_BLUE
	PINK
	SOFT_VIOLET
	CHARTREUSE
	SPRING_GREEN
)

// Second color dictactes the main color at default zoom
var assignments = []ColorAssignment{
	CHARTREUSE,
	SPRING_GREEN,
	SOFT_BLUE,
	WHITE,
	SOFT_VIOLET,
	VIOLET,
	BLUE,
	TEAL,
	RED,
	GREEN,
	ORANGE,
	PINK,
	YELLOW,
}
