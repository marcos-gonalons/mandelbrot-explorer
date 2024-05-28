package color

type ColorAssignment uint

const (
	RED              ColorAssignment = iota // #FF0000
	LIME                                    // #00FF00
	BLUE                                    // #0000FF
	WHITE                                   // #FFFFFF
	FUCHSIA                                 // #FF00FF
	YELLOW                                  // #FFFF00
	AQUA                                    // #00FFFF
	DARK_ORANGE                             // #FF8800
	DODGER_BLUE                             // #0088FF
	DEEP_PINK                               // #FF0088
	ELECTRIC_INDIGO                         // #8800FF
	CHARTREUSE                              // #88FF00
	SPRING_GREEN                            // #00FF88
	LIGHT_SLATE_BLUE                        // #8888FF
	LIGHT_CORAL                             // #FF8888
	LIGHT_GREEN                             // #88FF88
	CANARY                                  // #FFFF88
	ELECTRIC_BLUE                           // #88FFFF
	FUCHSIA_PINK                            // #FF88FF
)

// Second color dictactes the main color at default zoom
var colorAssignments = []ColorAssignment{
	CHARTREUSE,
	DODGER_BLUE,
	LIGHT_SLATE_BLUE,
	WHITE,
	LIGHT_CORAL,
	CANARY,
	LIGHT_GREEN,
	ELECTRIC_BLUE,
	ELECTRIC_INDIGO,
	SPRING_GREEN,
	BLUE,
	FUCHSIA_PINK,
	DARK_ORANGE,
	DEEP_PINK,
	FUCHSIA,
	AQUA,
	RED,
	LIME,
}
