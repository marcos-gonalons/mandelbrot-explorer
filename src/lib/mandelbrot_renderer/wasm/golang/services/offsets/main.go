package offsets

import (
	"mandelbrot/objects"
	operationmode "mandelbrot/services/operation_mode"
)

type Handler struct {
	operationMode *operationmode.Service

	x operationmode.Float
	y operationmode.Float
}

func New(operationMode *operationmode.Service, x, y operationmode.Float) *Handler {
	return &Handler{
		operationMode: operationMode,
		x:             x,
		y:             y,
	}
}

func (o *Handler) Adjust(zoomLevel, speed, angleInDegrees operationmode.Float) *Handler {
	operator := o.operationMode.GetOperator()

	adjustment := operator.Div(zoomLevel, operator.Div(operationmode.NewFloat(1000), speed))
	if operator.GreaterOrEqualThan(angleInDegrees, operationmode.NewFloat(0)) && operator.LessOrEqualThan(angleInDegrees, operationmode.NewFloat(90)) {
		angleRatio := operator.Div(angleInDegrees, operationmode.NewFloat(90))

		o.DecrementX(operator.Mul(adjustment, operator.Sub(operationmode.NewFloat(1), angleRatio)))
		o.IncrementY(operator.Mul(adjustment, angleRatio))
	}
	if operator.GreaterOrEqualThan(angleInDegrees, operationmode.NewFloat(90)) && operator.LessOrEqualThan(angleInDegrees, operationmode.NewFloat(180)) {
		angleRatio := operator.Div(operator.Sub(angleInDegrees, operationmode.NewFloat(90)), operationmode.NewFloat(90))

		o.IncrementX(operator.Mul(adjustment, angleRatio))
		o.IncrementY(operator.Mul(adjustment, operator.Sub(operationmode.NewFloat(1), angleRatio)))
	}
	if operator.GreaterOrEqualThan(angleInDegrees, operationmode.NewFloat(180)) && operator.LessOrEqualThan(angleInDegrees, operationmode.NewFloat(270)) {
		angleRatio := operator.Div(operator.Sub(angleInDegrees, operationmode.NewFloat(180)), operationmode.NewFloat(90))

		o.IncrementX(operator.Mul(adjustment, operator.Sub(operationmode.NewFloat(1), angleRatio)))
		o.DecrementY(operator.Mul(adjustment, angleRatio))
	}
	if operator.GreaterOrEqualThan(angleInDegrees, operationmode.NewFloat(270)) && operator.LessOrEqualThan(angleInDegrees, operationmode.NewFloat(360)) {
		angleRatio := operator.Div(operator.Sub(angleInDegrees, operationmode.NewFloat(270)), operationmode.NewFloat(90))

		o.DecrementX(operator.Mul(adjustment, angleRatio))
		o.DecrementY(operator.Mul(adjustment, operator.Sub(operationmode.NewFloat(1), angleRatio)))
	}

	return o
}

func (o *Handler) IncrementX(increment operationmode.Float) *Handler {
	o.x = o.operationMode.GetOperator().Add(o.x, increment)
	return o
}
func (o *Handler) IncrementY(increment operationmode.Float) *Handler {
	o.y = o.operationMode.GetOperator().Add(o.y, increment)
	return o
}
func (o *Handler) DecrementX(decrement operationmode.Float) *Handler {
	o.x = o.operationMode.GetOperator().Sub(o.x, decrement)
	return o
}
func (o *Handler) DecrementY(decrement operationmode.Float) *Handler {
	o.y = o.operationMode.GetOperator().Sub(o.y, decrement)
	return o
}

func (o *Handler) GetAsCoordinates() objects.Coordinates {
	return objects.Coordinates{X: o.x, Y: o.y}
}

func (o *Handler) OnChangeOperationMode(newMode operationmode.Mode) {
	o.operationMode.ConvertFloat(&o.x)
	o.operationMode.ConvertFloat(&o.y)
}

func (o *Handler) GetX() *operationmode.Float {
	return &o.x
}
func (o *Handler) GetY() *operationmode.Float {
	return &o.y
}
