package operationmode

type Mode uint8

const (
	FLOAT64  Mode = 1
	FLOAT128 Mode = 2
)

type listener interface {
	OnChangeOperationMode(newMode Mode)
}

type Service struct {
	mode Mode

	listeners []listener
}

func New(mode Mode) *Service {
	return &Service{mode: mode}
}

func (s *Service) AddListener(listener listener) {
	s.listeners = append(s.listeners, listener)
}

func (s *Service) Set(mode Mode) {
	s.mode = mode

	for _, listener := range s.listeners {
		listener.OnChangeOperationMode(mode)
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
