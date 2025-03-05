package endpoint

import (
	"fmt"
	"net/url"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const defaultIssuer = "azure-signalr"

type ServiceEndpoint interface {
	GetEndpoint() (*url.URL, error)
	GetClientEndpoint() (*url.URL, error)
	GetServerEndpoint() (*url.URL, error)
	GenerateServerToken(audience string) (string, error)
}

type serviceEndpoint struct {
	endpoint string
	port     int

	keyBytes []byte
}

// GetClientEndpoint implements ServiceEndpoint.
func (e *serviceEndpoint) GetClientEndpoint() (*url.URL, error) {
	return e.GetEndpoint()
}

// GetServerEndpoint implements ServiceEndpoint.
func (e *serviceEndpoint) GetServerEndpoint() (*url.URL, error) {
	return e.GetEndpoint()
}

func (e *serviceEndpoint) GetEndpoint() (*url.URL, error) {
	uri, err := url.Parse(e.endpoint)
	if err != nil {
		return nil, err
	}
	uri.Host = fmt.Sprintf("%s:%d", uri.Hostname(), e.port)
	return uri, nil
}

func (e *serviceEndpoint) GenerateServerToken(audience string) (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 1).Unix(), // Token expiration time
		"iat": time.Now().Unix(),                    // Token issued at time
		"iss": defaultIssuer,                        // Issuer
		"aud": audience,                             // Audience
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(e.keyBytes)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func NewServiceEndpoint(endpoint string, accessKey string) ServiceEndpoint {
	return &serviceEndpoint{
		endpoint: endpoint,
		port:     8080,
		keyBytes: []byte(accessKey),
	}
}
