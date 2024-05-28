package zoom

import (
	"mandelbrot/objects"
	"mandelbrot/services/offsets"
	operationmode "mandelbrot/services/operation_mode"
	"math"
)

const MAX_FLOAT64_MAGNITUDE_DECIMALS = 15

type Strategy uint8

const (
	CENTERED Strategy = 1
	CURSOR   Strategy = 2
)

type Handler struct {
	operationMode  *operationmode.Service
	offsetsHandler *offsets.Handler

	zoomLevel     operationmode.Float
	magnitude     operationmode.Float
	previousLevel operationmode.Float

	// > 0 and less than 10. Decimals allowed. Higher number = slower zoom
	magnitudeIncrement float64
	magnitudeDecimals  int

	canvasSize       objects.Size
	mouseCoordinates objects.Coordinates

	onMaxFloat64DepthReached func()
}

func New(
	operationMode *operationmode.Service,
	offsetsHandler *offsets.Handler,
	zoomLevel, magnitude operationmode.Float,
	magnitudeDecimals int,
	onMaxFloat64DepthReached func(),
) *Handler {
	return &Handler{
		operationMode:            operationMode,
		offsetsHandler:           offsetsHandler,
		zoomLevel:                zoomLevel,
		magnitude:                magnitude,
		magnitudeIncrement:       3,
		magnitudeDecimals:        magnitudeDecimals,
		onMaxFloat64DepthReached: onMaxFloat64DepthReached,
	}
}

func (z *Handler) SetCanvasSize(width, height int64) *Handler {
	z.canvasSize = objects.Size{
		Width:  width,
		Height: height,
	}
	return z
}

func (z *Handler) SetMouseCoordinates(x, y operationmode.Float) *Handler {
	z.mouseCoordinates = objects.Coordinates{
		X: x,
		Y: y,
	}
	return z
}

func (z *Handler) GetZoomLevel() operationmode.Float {
	return z.zoomLevel
}

func (z *Handler) Adjust(t bool, speed operationmode.Float, strategy Strategy) *Handler {
	if t {
		z.increase(strategy, speed)
	} else {
		z.decrease(speed)
	}

	// TODO: Change from float 128 to big float
	if z.operationMode.IsFloat64() && z.magnitudeDecimals >= MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT128)
		z.onMaxFloat64DepthReached()
	}
	if z.operationMode.IsFloat128() && z.magnitudeDecimals < MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT64)
	}

	z.previousLevel = operationmode.Clone(z.zoomLevel)
	return z
}

func (z *Handler) OnChangeOperationMode(newMode operationmode.Mode) {
	z.zoomLevel = z.operationMode.ConvertFloat(z.zoomLevel)
	z.magnitude = z.operationMode.ConvertFloat(z.magnitude)
	z.previousLevel = z.operationMode.ConvertFloat(z.previousLevel)
}

func (z *Handler) increase(strategy Strategy, speed operationmode.Float) {
	operator := z.operationMode.GetOperator()

	adjustment := operator.Mul(z.magnitude, speed)

	z.zoomLevel = operator.Sub(z.zoomLevel, adjustment)

	// z.zoomLevel = z.RoundToMagnitudeDecimals(z.zoomLevel)

	if operator.LessOrEqualThan(z.zoomLevel, operationmode.NewFloat(0)) {
		z.zoomLevel = operationmode.Clone(z.previousLevel)
		z.increaseMagnitude()
		z.increase(strategy, speed)
		return
	}

	switch strategy {
	case CENTERED:
		z.offsetsHandler.IncrementX(operator.Mul(adjustment, operationmode.NewFloat(2)))
		z.offsetsHandler.IncrementY(adjustment)
	case CURSOR:
		// TODO: Rethink. Maybe use angle thing same as the offsets to calculate proper adjustment vector
		panic("not implemented")
	}

	if z.shouldIncreaseMagnitude() {
		z.increaseMagnitude()
	}
}

func (z *Handler) decrease(speed operationmode.Float) {
	operator := z.operationMode.GetOperator()

	adjustment := operator.Mul(z.magnitude, speed)

	z.zoomLevel = operator.Add(z.zoomLevel, adjustment)

	// z.zoomLevel = z.RoundToMagnitudeDecimals(z.zoomLevel)

	if operator.GreaterThan(z.zoomLevel, operationmode.NewFloat(4)) {
		z.zoomLevel = z.previousLevel
		return
	}

	z.offsetsHandler.DecrementX(operator.Mul(adjustment, operationmode.NewFloat(2)))
	z.offsetsHandler.DecrementY(adjustment)

	if z.shouldDecreaseMagnitude() {
		z.decreaseMagnitude()
	}
}

func (z *Handler) shouldIncreaseMagnitude() bool {
	operator := z.operationMode.GetOperator()

	return operator.LessThan(z.zoomLevel, z.previousLevel) &&
		operator.LessThan(z.zoomLevel, operator.Mul(operationmode.NewFloat(z.magnitudeIncrement), z.magnitude))
}

func (z *Handler) shouldDecreaseMagnitude() bool {
	operator := z.operationMode.GetOperator()

	return operator.GreaterThan(z.zoomLevel, z.previousLevel) &&
		operator.GreaterThan(z.zoomLevel, operator.Mul(operationmode.NewFloat(z.magnitudeIncrement), operator.Mul(z.magnitude, operationmode.NewFloat(10))))
}

func (z *Handler) increaseMagnitude() {
	z.magnitude = z.operationMode.GetOperator().Div(z.magnitude, operationmode.NewFloat(10))
	z.magnitudeDecimals++
}

func (z *Handler) decreaseMagnitude() {
	z.magnitude = z.operationMode.GetOperator().Mul(z.magnitude, operationmode.NewFloat(10))
	z.magnitudeDecimals--
}

// TODO: add rounding in operators
func (z *Handler) RoundToMagnitudeDecimals(v float64) float64 {
	roundDecimals := math.Pow(10, float64(z.magnitudeDecimals))
	return math.Round(v*roundDecimals) / roundDecimals
}
