package connection

type ServiceConnectionStatus int

const (
	Init ServiceConnectionStatus = iota
	Disconnected
	Connecting
	Connected
)
