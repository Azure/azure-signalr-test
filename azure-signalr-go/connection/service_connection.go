package connection

import "azure.signalr.com/azure-signalr-go/protocol"

type ServiceMessage = protocol.ServiceMessage

type ServiceConnection interface {
	GetConnectionId() string
	GetServerId() string
	GetConnectionStatus() ServiceConnectionStatus

	Start()
	Stop()

	WriteMessage(message ServiceMessage) error
}

type serviceConnection struct {
	serverId     string
	connectionId string
	status       ServiceConnectionStatus
}

// GetConnectionId implements ServiceConnection.
func (s *serviceConnection) GetConnectionId() string {
	return s.connectionId
}

// GetServerId implements ServiceConnection.
func (s *serviceConnection) GetServerId() string {
	return s.serverId
}

// GetConnectionStatus implements ServiceConnection.
func (s *serviceConnection) GetConnectionStatus() ServiceConnectionStatus {
	return s.status
}

// Start implements ServiceConnection.
func (s *serviceConnection) Start() {
}

// Stop implements ServiceConnection.
func (s *serviceConnection) Stop() {
}

// WriteMessage implements ServiceConnection.
func (s *serviceConnection) WriteMessage(message ServiceMessage) error {
	return nil
}

func NewServiceConnection() ServiceConnection {
	return &serviceConnection{
		serverId:     "foo",
		connectionId: "",
		status:       Init,
	}
}
