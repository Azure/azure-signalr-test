package endpoint

type HubServiceEndpoint interface {
	ServiceEndpoint

	GetHub() string
}

type hubServiceEndpoint struct {
	ServiceEndpoint

	hub string
}

func (e *hubServiceEndpoint) GetHub() string {
	return e.hub
}

func NewHubServiceEndpoint(endpoint ServiceEndpoint, hub string) HubServiceEndpoint {
	return &hubServiceEndpoint{
		ServiceEndpoint: endpoint,
		hub:             hub,
	}
}
