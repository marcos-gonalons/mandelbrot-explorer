package zoom

import (
	"mandelbrot/objects"
	"mandelbrot/objects/float128"
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

	zoomLevel     float64
	magnitude     float64
	previousLevel float64

	zoomLevel_float128     float128.Float128
	magnitude_float128     float128.Float128
	previousLevel_float128 float128.Float128

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
	zoomLevel, magnitude float64,
	magnitudeDecimals int,
	onMaxFloat64DepthReached func(),
) *Handler {
	return &Handler{
		operationMode:            operationMode,
		offsetsHandler:           offsetsHandler,
		zoomLevel:                zoomLevel,
		zoomLevel_float128:       float128.SetFloat64(zoomLevel),
		magnitude:                magnitude,
		magnitude_float128:       float128.SetFloat64(magnitude),
		magnitudeIncrement:       3,
		magnitudeDecimals:        magnitudeDecimals,
		onMaxFloat64DepthReached: onMaxFloat64DepthReached,
	}
}

func (z *Handler) SetCanvasSize(size objects.Size) *Handler {
	z.canvasSize = size
	return z
}

func (z *Handler) SetMouseCoordinates(coordinates objects.Coordinates) *Handler {
	z.mouseCoordinates = coordinates
	return z
}

func (z *Handler) GetZoomLevel() interface{} {
	if z.operationMode.IsFloat64() {
		return z.zoomLevel
	}
	if z.operationMode.IsFloat128() {
		return z.zoomLevel_float128
	}
	return nil
}

func (z *Handler) Adjust(t bool, speed float64, strategy Strategy) *Handler {
	if t {
		z.increase(strategy, speed)
	} else {
		z.decrease(speed)
	}

	if z.operationMode.IsFloat64() && z.magnitudeDecimals >= MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT128)
		z.onMaxFloat64DepthReached()
	}
	if z.operationMode.IsFloat128() && z.magnitudeDecimals < MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT64)
	}

	z.previousLevel = z.zoomLevel
	z.previousLevel_float128 = z.zoomLevel_float128
	return z
}

func (z *Handler) OnChangeOperationMode(newMode operationmode.Mode) {
	if newMode == operationmode.FLOAT128 {
		z.zoomLevel_float128 = float128.SetFloat64(z.zoomLevel)
		z.magnitude_float128 = float128.SetFloat64(z.magnitude)
		z.previousLevel_float128 = float128.SetFloat64(z.previousLevel)
	}

	if newMode == operationmode.FLOAT64 {
		z.zoomLevel = z.zoomLevel_float128.Float64()
		z.magnitude = z.magnitude_float128.Float64()
		z.previousLevel = z.previousLevel_float128.Float64()
	}
}

func (z *Handler) increase(strategy Strategy, speed float64) {
	if z.operationMode.IsFloat64() {
		z.increase_float64(strategy, speed)
		return
	}
	if z.operationMode.IsFloat128() {
		z.increase_float128(strategy, speed)
		return
	}

	panic("invalid operation mode")
}

func (z *Handler) increase_float64(strategy Strategy, speed float64) {
	adjustment := z.magnitude * speed
	z.zoomLevel -= adjustment

	z.zoomLevel = z.RoundToMagnitudeDecimals(z.zoomLevel)

	if z.zoomLevel <= 0 {
		z.zoomLevel = z.previousLevel
		z.increaseMagnitude()
		z.increase(strategy, speed)
		return
	}

	switch strategy {
	case CENTERED:
		z.offsetsHandler.IncrementX(adjustment * 2)
		z.offsetsHandler.IncrementY(adjustment)
	case CURSOR:
		// TODO: Rethink. Maybe use angle thing same as the offsets to calculate proper adjustment vector
		panic("not implemented")
	}

	if z.shouldIncreaseMagnitude() {
		z.increaseMagnitude()
	}
}

func (z *Handler) increase_float128(strategy Strategy, speed float64) {
	adjustment := float128.Mul(z.magnitude_float128, float128.SetFloat64(speed))

	z.zoomLevel_float128 = float128.Sub(z.zoomLevel_float128, adjustment)

	if float128.IsLE(z.zoomLevel_float128, float128.Zero()) {
		z.zoomLevel_float128 = z.previousLevel_float128
		z.increaseMagnitude()
		z.increase(strategy, speed)
		return
	}

	switch strategy {
	case CENTERED:
		z.offsetsHandler.IncrementX(float128.Mul(adjustment, float128.SetFloat64(2)))
		z.offsetsHandler.IncrementY(adjustment)
	case CURSOR:
		// TODO: Rethink. Maybe use angle thing same as the offsets to calculate proper adjustment vector
		panic("not implemented")
	}

	if z.shouldIncreaseMagnitude() {
		z.increaseMagnitude()
	}
}

func (z *Handler) decrease(speed float64) {
	if z.operationMode.IsFloat64() {
		z.decrease_float64(speed)
		return
	}
	if z.operationMode.IsFloat128() {
		z.decrease_float128(speed)
		return
	}

	panic("invalid operation mode")
}

func (z *Handler) decrease_float64(speed float64) {
	adjustment := z.magnitude * speed
	z.zoomLevel += adjustment

	z.zoomLevel = z.RoundToMagnitudeDecimals(z.zoomLevel)

	if z.zoomLevel > 4 {
		z.zoomLevel = z.previousLevel
		return
	}

	z.offsetsHandler.DecrementX(adjustment * 2)
	z.offsetsHandler.DecrementY(adjustment)

	if z.shouldDecreaseMagnitude() {
		z.decreaseMagnitude()
	}
}

func (z *Handler) decrease_float128(speed float64) {
	adjustment := float128.Mul(z.magnitude_float128, float128.SetFloat64(speed))

	z.zoomLevel_float128 = float128.Add(z.zoomLevel_float128, adjustment)

	z.offsetsHandler.DecrementX(float128.Mul(adjustment, float128.SetFloat64(2)))
	z.offsetsHandler.DecrementY(adjustment)

	if z.shouldDecreaseMagnitude() {
		z.decreaseMagnitude()
	}
}

func (z *Handler) shouldIncreaseMagnitude() bool {
	if z.operationMode.IsFloat64() {
		return z.zoomLevel < z.magnitudeIncrement*z.magnitude &&
			z.zoomLevel < z.previousLevel
	}

	if z.operationMode.IsFloat128() {
		return float128.IsLT(z.zoomLevel_float128, z.previousLevel_float128) &&
			float128.IsLT(z.zoomLevel_float128, float128.Mul(float128.SetFloat64(z.magnitudeIncrement), z.magnitude_float128))
	}

	return false

}

func (z *Handler) shouldDecreaseMagnitude() bool {
	if z.operationMode.IsFloat64() {
		return z.zoomLevel > z.magnitudeIncrement*z.magnitude*10 &&
			z.zoomLevel > z.previousLevel
	}

	if z.operationMode.IsFloat128() {
		return float128.IsGT(z.zoomLevel_float128, z.previousLevel_float128) &&
			float128.IsGT(z.zoomLevel_float128, float128.Mul(float128.SetFloat64(z.magnitudeIncrement), float128.Mul(z.magnitude_float128, float128.SetFloat64(10))))
	}

	return false
}

func (z *Handler) increaseMagnitude() {
	if z.operationMode.IsFloat64() {
		z.magnitude = z.magnitude / 10
	}

	if z.operationMode.IsFloat128() {
		z.magnitude_float128 = float128.Div(z.magnitude_float128, float128.SetFloat64(10))
	}

	z.magnitudeDecimals++
}

func (z *Handler) decreaseMagnitude() {
	if z.operationMode.IsFloat64() {
		z.magnitude = z.magnitude * 10
	}

	if z.operationMode.IsFloat128() {
		z.magnitude_float128 = float128.Mul(z.magnitude_float128, float128.SetFloat64(10))
	}

	z.magnitudeDecimals--
}

func (z *Handler) RoundToMagnitudeDecimals(v float64) float64 {
	roundDecimals := math.Pow(10, float64(z.magnitudeDecimals))
	return math.Round(v*roundDecimals) / roundDecimals
}
