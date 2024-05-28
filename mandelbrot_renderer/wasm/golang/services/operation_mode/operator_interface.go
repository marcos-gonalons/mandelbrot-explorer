package operationmode

type Operator interface {
	Add(f1, f2 Float) Float
	Sub(f1, f2 Float) Float
	Mul(f1, f2 Float) Float
	Div(f1, f2 Float) Float
	Abs(f1 Float) Float
	GreaterThan(f1, f2 Float) bool
	GreaterOrEqualThan(f1, f2 Float) bool
	LessThan(f1, f2 Float) bool
	LessOrEqualThan(f1, f2 Float) bool
}
