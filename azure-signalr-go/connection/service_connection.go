package connection

import (
	"azure.signalr.com/azure-signalr-go/endpoint"
	"azure.signalr.com/azure-signalr-go/protocol"
)

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
	hubEndpoint endpoint.HubServiceEndpoint

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

func (s *serviceConnection) connect() {
	uri := s.hubEndpoint.GetServerEndpoint()

	token := s.hubEndpoint.GenerateServerToken()
}

// WriteMessage implements ServiceConnection.
func (s *serviceConnection) WriteMessage(message ServiceMessage) error {
	return nil
}

func NewServiceConnection(hubEndpoint endpoint.HubServiceEndpoint) ServiceConnection {
	return &serviceConnection{
		hubEndpoint:  hubEndpoint,
		serverId:     "foo",
		connectionId: "",
		status:       Init,
	}
}
