package offsets

import (
	"mandelbrot/objects"
	"mandelbrot/objects/float128"
	operationmode "mandelbrot/services/operation_mode"
)

type Handler struct {
	operationMode *operationmode.Service

	x          float64
	y          float64
	x_float128 float128.Float128
	y_float128 float128.Float128
}

func New(operationMode *operationmode.Service, x, y float64) *Handler {
	return &Handler{
		operationMode: operationMode,
		x:             x,
		y:             y,
		x_float128:    float128.SetFloat64(x),
		y_float128:    float128.SetFloat64(y),
	}
}

func (o *Handler) Adjust(zoomLevel, speed interface{}, angleInDegrees int) *Handler {
	if o.operationMode.IsFloat64() {
		o.adjustFloat64(
			zoomLevel.(float64),
			speed.(float64),
			angleInDegrees,
		)
		return o
	}

	if o.operationMode.IsFloat128() {
		o.adjustFloat128(
			zoomLevel.(float128.Float128),
			float128.SetFloat64(speed.(float64)),
			angleInDegrees,
		)
		return o
	}

	panic("invalid operation mode")
}

func (o *Handler) IncrementX(increment interface{}) *Handler {
	if o.operationMode.IsFloat64() {
		o.x += increment.(float64)
		return o
	}

	if o.operationMode.IsFloat128() {
		o.x_float128 = float128.Add(o.x_float128, increment.(float128.Float128))
		return o
	}

	return o
}
func (o *Handler) IncrementY(increment interface{}) *Handler {
	if o.operationMode.IsFloat64() {
		o.y += increment.(float64)
		return o
	}

	if o.operationMode.IsFloat128() {
		o.y_float128 = float128.Add(o.y_float128, increment.(float128.Float128))
		return o
	}

	return o
}
func (o *Handler) DecrementX(decrement interface{}) *Handler {
	if o.operationMode.IsFloat64() {
		o.x -= decrement.(float64)
		return o
	}

	if o.operationMode.IsFloat128() {
		o.x_float128 = float128.Sub(o.x_float128, decrement.(float128.Float128))
		return o
	}

	return o
}
func (o *Handler) DecrementY(decrement interface{}) *Handler {
	if o.operationMode.IsFloat64() {
		o.y -= decrement.(float64)
		return o
	}

	if o.operationMode.IsFloat128() {
		o.y_float128 = float128.Sub(o.y_float128, decrement.(float128.Float128))
		return o
	}

	return o
}
func (o *Handler) GetAsCoordinates() objects.Coordinates {
	return objects.Coordinates{
		X:          o.x,
		Y:          o.y,
		X_float128: o.x_float128,
		Y_float128: o.y_float128,
	}
}

func (o *Handler) OnChangeOperationMode(newMode operationmode.Mode) {
	if newMode == operationmode.FLOAT128 {
		o.x_float128 = float128.SetFloat64(o.x)
		o.y_float128 = float128.SetFloat64(o.y)
	}

	if newMode == operationmode.FLOAT64 {
		o.x = o.x_float128.Float64()
		o.y = o.y_float128.Float64()
	}
}

func (o *Handler) adjustFloat64(zoomLevel, speed float64, angleInDegrees int) {
	adjustment := zoomLevel / (1000 / speed)

	if angleInDegrees >= 0 && angleInDegrees <= 90 {
		angleRatio := float64(angleInDegrees) / float64(90)

		o.IncrementY(adjustment * angleRatio)
		o.DecrementX(adjustment * (1 - angleRatio))
	}
	if angleInDegrees >= 90 && angleInDegrees <= 180 {
		angleRatio := float64(angleInDegrees-90) / float64(90)

		o.IncrementY(adjustment * (1 - angleRatio))
		o.IncrementX(adjustment * angleRatio)
	}
	if angleInDegrees >= 180 && angleInDegrees <= 270 {
		angleRatio := float64(angleInDegrees-180) / float64(90)

		o.DecrementY(adjustment * angleRatio)
		o.IncrementX(adjustment * (1 - angleRatio))
	}
	if angleInDegrees >= 270 && angleInDegrees <= 360 {
		angleRatio := float64(angleInDegrees-270) / float64(90)

		o.DecrementY(adjustment * (1 - angleRatio))
		o.DecrementX(adjustment * angleRatio)
	}
}

func (o *Handler) adjustFloat128(zoomLevel, speed float128.Float128, angleInDegrees int) {
	adjustment := float128.Div(zoomLevel, float128.Div(float128.SetFloat64(1000), speed))

	angleFloat128 := float128.SetFloat64(float64(angleInDegrees))
	if angleInDegrees >= 0 && angleInDegrees <= 90 {
		angleRatio := float128.Div(angleFloat128, float128.SetFloat64(90))

		o.y_float128 = float128.Add(o.y_float128, float128.Mul(adjustment, angleRatio))
		o.x_float128 = float128.Sub(o.x_float128, float128.Mul(adjustment, float128.Sub(float128.One(), angleRatio)))
	}
	if angleInDegrees >= 90 && angleInDegrees <= 180 {
		angleRatio := float128.Div(float128.Sub(angleFloat128, float128.SetFloat64(90)), float128.SetFloat64(90))

		o.y_float128 = float128.Add(o.y_float128, float128.Mul(adjustment, float128.Sub(float128.One(), angleRatio)))
		o.x_float128 = float128.Add(o.x_float128, float128.Mul(adjustment, angleRatio))
	}
	if angleInDegrees >= 180 && angleInDegrees <= 270 {
		angleRatio := float128.Div(float128.Sub(angleFloat128, float128.SetFloat64(180)), float128.SetFloat64(90))

		o.y_float128 = float128.Sub(o.y_float128, float128.Mul(adjustment, angleRatio))
		o.x_float128 = float128.Add(o.x_float128, float128.Mul(adjustment, float128.Sub(float128.One(), angleRatio)))
	}
	if angleInDegrees >= 270 && angleInDegrees <= 360 {
		angleRatio := float128.Div(float128.Sub(angleFloat128, float128.SetFloat64(270)), float128.SetFloat64(90))

		o.y_float128 = float128.Sub(o.y_float128, float128.Mul(adjustment, float128.Sub(float128.One(), angleRatio)))
		o.x_float128 = float128.Sub(o.x_float128, float128.Mul(adjustment, angleRatio))
	}
}
