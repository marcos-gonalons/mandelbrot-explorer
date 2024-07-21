package main

import (
	"fmt"
	"time"
)

func main() {
	z := complex(float64(0.92311), float64(-1.111111009991))

	start := time.Now().UnixMilli()
	for i := 0; i < 200000000; i++ {
		z = z + z
	}
	fmt.Println(time.Now().UnixMilli() - start)
}
