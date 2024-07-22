package operationmode

import (
	"mandelbrot/objects/float128"
)

type Mode uint8

const (
	FLOAT64 Mode = iota
	FLOAT128
)

type listener interface {
	OnChangeOperationMode(newMode Mode)
}

type Service struct {
	mode         Mode
	previousMode Mode

	float64Operator  Operator
	float128Operator Operator

	listeners []listener
}

func New(mode Mode) *Service {
	return &Service{
		mode:             mode,
		float64Operator:  &Float64Operator{},
		float128Operator: &Float128Operator{},
	}
}

func (s *Service) AddListener(listener listener) {
	s.listeners = append(s.listeners, listener)
}

func (s *Service) Set(mode Mode, callListeners bool) {
	s.previousMode = s.mode
	s.mode = mode

	if callListeners {
		for _, listener := range s.listeners {
			listener.OnChangeOperationMode(mode)
		}
	}
}

func (s *Service) Get() Mode {
	return s.mode
}

func (s *Service) IsFloat64() bool {
	return s.mode == FLOAT64
}

func (s *Service) IsFloat128() bool {
	return s.mode == FLOAT128
}

func (s *Service) GetOperator() Operator {
	switch s.mode {
	case FLOAT64:
		return s.float64Operator
	case FLOAT128:
		return s.float128Operator
	default:
		return s.float64Operator
	}
}

func (s *Service) ConvertFloat(f *Float) {
	if s.mode == FLOAT64 && s.previousMode == FLOAT128 {
		f.SetFloat64(f.GetFloat128().Float64())
		return
	}

	if s.mode == FLOAT128 && s.previousMode == FLOAT64 {
		f.SetFloat128(float128.SetFloat64(f.GetFloat64()))
		return
	}
}

func (s *Service) GetAsENotationString(f *Float, precision int) string {
	if s.IsFloat64() {
		return float128.SetFloat64(f.GetFloat64()).String(precision)
	}

	if s.IsFloat128() {
		return f.GetFloat128().String(precision)
	}

	panic("operation mode not set or unsupported")
}

func (s *Service) NewFloatFromENotationString(v string) (Float, error) {
	f128Value, amountOfDecimals, err := float128.FromENotationString(v)
	if err != nil {
		return NewFloat(0), err
	}

	if s.IsFloat64() {
		return NewFloat64(f128Value.Float64(), uint64(amountOfDecimals)), nil
	}

	if s.IsFloat128() {
		return NewFloat128(f128Value, uint64(amountOfDecimals)), nil
	}

	panic("operation mode not set or unsupported")
}
