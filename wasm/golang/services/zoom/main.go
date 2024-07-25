package zoom

import (
	"errors"
	"mandelbrot/objects"
	"mandelbrot/objects/float128"
	"mandelbrot/services/offsets"
	operationmode "mandelbrot/services/operation_mode"
	"math"
)

const MAX_FLOAT64_MAGNITUDE_DECIMALS = 15
const MAX_FLOAT128_MAGNITUDE_DECIMALS = 31

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
	magnitudeDecimals  uint64

	canvasSize       objects.Size
	mouseCoordinates objects.Coordinates

	onMaxFloat64DepthReached  func()
	onMaxFloat128DepthReached func()
}

func New(
	operationMode *operationmode.Service,
	offsetsHandler *offsets.Handler,
	zoomLevel, magnitude operationmode.Float,
	magnitudeDecimals uint64,
	onMaxFloat64DepthReached func(),
	onMaxFloat128DepthReached func(),
) *Handler {
	return &Handler{
		operationMode:             operationMode,
		offsetsHandler:            offsetsHandler,
		zoomLevel:                 zoomLevel,
		magnitude:                 magnitude,
		magnitudeIncrement:        3,
		magnitudeDecimals:         magnitudeDecimals,
		onMaxFloat64DepthReached:  onMaxFloat64DepthReached,
		onMaxFloat128DepthReached: onMaxFloat128DepthReached,
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

func (z *Handler) GetZoomLevelAsENotation() string {
	return z.operationMode.GetAsENotationString(&z.zoomLevel, 3)
}

func (z *Handler) GetMagnitudeAsENotation() string {
	return z.operationMode.GetAsENotationString(&z.magnitude, 3)
}

func (z *Handler) GetMagnitudeDecimals() uint64 {
	return z.magnitudeDecimals
}

func (z *Handler) Adjust(t bool, speed operationmode.Float, strategy Strategy) *Handler {
	if t {
		z.increase(strategy, speed)
	} else {
		z.decrease(speed)
	}

	z.handleOperationModeChange()

	z.previousLevel = operationmode.Clone(z.zoomLevel)

	return z
}

func (z *Handler) Set(zoomLevelAsENotation string) error {
	zoomLevel, amountOfDecimals, err := float128.FromENotationString(zoomLevelAsENotation)
	if err != nil {
		return err
	}

	// TODO: Check max decimals on JS side and remove this IF
	if amountOfDecimals >= MAX_FLOAT128_MAGNITUDE_DECIMALS {
		return errors.New("remove me")
	}

	z.magnitudeDecimals = z.zoomLevel.GetDecimalsAmount()

	if amountOfDecimals < MAX_FLOAT64_MAGNITUDE_DECIMALS-1 {
		z.zoomLevel = operationmode.NewFloat64(zoomLevel.Float64(), uint64(amountOfDecimals))
		z.magnitude = operationmode.NewFloat64(math.Pow(10, -float64(z.magnitudeDecimals)), z.magnitudeDecimals)

		if !z.operationMode.IsFloat64() {
			z.operationMode.Set(operationmode.FLOAT64, false)
			z.offsetsHandler.OnChangeOperationMode(operationmode.FLOAT64)
		}
	}
	if amountOfDecimals >= MAX_FLOAT64_MAGNITUDE_DECIMALS-1 {
		z.zoomLevel = operationmode.NewFloat128(zoomLevel, uint64(amountOfDecimals))
		z.magnitude = operationmode.NewFloat128(float128.PowerI(float128.SetFloat64(10), -int64(z.magnitudeDecimals)), z.magnitudeDecimals)

		if !z.operationMode.IsFloat128() {
			z.operationMode.Set(operationmode.FLOAT128, false)
			z.offsetsHandler.OnChangeOperationMode(operationmode.FLOAT128)

			z.onMaxFloat64DepthReached()
		}
	}

	z.previousLevel = operationmode.Clone(z.zoomLevel)

	return nil
}

func (z *Handler) OnChangeOperationMode(newMode operationmode.Mode) {
	z.operationMode.ConvertFloat(&z.zoomLevel)
	z.operationMode.ConvertFloat(&z.magnitude)
	z.operationMode.ConvertFloat(&z.previousLevel)
}

func (z *Handler) increase(strategy Strategy, speed operationmode.Float) {
	operator := z.operationMode.GetOperator()

	adjustment := operator.Mul(z.magnitude, speed)

	z.zoomLevel = operator.Round(operator.Sub(z.zoomLevel, adjustment), uint64(z.magnitudeDecimals))

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

	z.zoomLevel = operator.Round(operator.Add(z.zoomLevel, adjustment), uint64(z.magnitudeDecimals))

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

	z.onMagnitudeChange(true)
}

func (z *Handler) decreaseMagnitude() {
	z.magnitude = z.operationMode.GetOperator().Mul(z.magnitude, operationmode.NewFloat(10))
	z.magnitudeDecimals--

	z.onMagnitudeChange(false)
}

func (z *Handler) handleOperationModeChange() {
	if z.operationMode.IsFloat64() && z.magnitudeDecimals >= MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT128, true)
		z.onMaxFloat64DepthReached()
	}
	if z.operationMode.IsFloat128() && z.magnitudeDecimals < MAX_FLOAT64_MAGNITUDE_DECIMALS {
		z.operationMode.Set(operationmode.FLOAT64, true)
	}
	if z.operationMode.IsFloat128() && z.magnitudeDecimals >= MAX_FLOAT128_MAGNITUDE_DECIMALS {
		z.onMaxFloat128DepthReached()
	}
}

func (z *Handler) onMagnitudeChange(increased bool) {
	floats := []*operationmode.Float{
		&z.zoomLevel,
		&z.magnitude,
		&z.previousLevel,
		z.offsetsHandler.GetX(),
		z.offsetsHandler.GetY(),
	}

	for _, f := range floats {
		if increased {
			f.IncreaseDecimalsAmount()
		} else {
			f.DecreaseDecimalsAmount()
		}
	}
}
