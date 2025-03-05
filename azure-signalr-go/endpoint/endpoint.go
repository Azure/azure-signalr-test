package endpoint

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

const defaultIssuer = "azure-signalr"

type ServiceEndpoint interface {
	GenerateServerToken() (string, error)
}

type serviceEndpoint struct {
	endpoint string

	keyBytes []byte
}

func (e *serviceEndpoint) GenerateServerToken() (string, error) {
	claims := jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 1).Unix(), // Token expiration time
		"iat": time.Now().Unix(),                    // Token issued at time
		"iss": defaultIssuer,                        // Issuer
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
		keyBytes: []byte(accessKey),
	}
}
