package operationmode

import (
	"errors"
	"mandelbrot/objects/float128"
)

type Mode uint8

const (
	FLOAT64 Mode = iota
	FLOAT128
	BIG_FLOAT
)

type listener interface {
	OnChangeOperationMode(newMode Mode)
}

type Service struct {
	mode         Mode
	previousMode Mode

	float64Operator  Operator
	float128Operator Operator
	bigFloatOperator Operator

	listeners []listener
}

func New(mode Mode) *Service {
	return &Service{
		mode:             mode,
		float64Operator:  &Float64Operator{},
		float128Operator: &Float128Operator{},
		bigFloatOperator: &BigFloatOperator{},
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

func (s *Service) IsBigFloat() bool {
	return s.mode == BIG_FLOAT
}

func (s *Service) GetOperator() Operator {
	switch s.mode {
	case FLOAT64:
		return s.float64Operator
	case FLOAT128:
		return s.float128Operator
	case BIG_FLOAT:
		return s.bigFloatOperator
	default:
		return s.float64Operator
	}
}

func (s *Service) ConvertFloat(f *Float) {
	if s.mode == FLOAT64 {
		f.SetFloat64(f.GetFloat128().Float64())
		return
	}
	if s.mode == FLOAT128 && s.previousMode == FLOAT64 {
		f.SetFloat128(float128.SetFloat64(f.GetFloat64()))
		return
	}
	if s.mode == BIG_FLOAT && s.previousMode == FLOAT128 {
		f.CreateBigFloatFromENotationString(f.GetFloat128().String())
		return
	}
	if s.mode == FLOAT128 && s.previousMode == BIG_FLOAT {
		// use float128 scan method to initialize from string
		panic("not implemented yet")
	}
}

func (s *Service) GetAsENotationString(f *Float) string {
	if s.IsFloat64() {
		return float128.SetFloat64(f.GetFloat64()).String()
	}

	if s.IsFloat128() {
		return f.GetFloat128().String()
	}

	panic("operation mode not set or unsupported")
}

func (s *Service) NewFloatFromENotationString(v string) (Float, error) {
	f128Value, amountOfDecimals, err := float128.FromENotationString(v)
	if err != nil {
		return NewFloat(0), errors.New("parse error")
	}

	if s.IsFloat64() {
		return NewFloat(f128Value.Float64()), nil
	}

	if s.IsFloat128() {
		return NewFloat128(f128Value, uint64(amountOfDecimals)), nil
	}

	panic("operation mode not set or unsupported")
}
