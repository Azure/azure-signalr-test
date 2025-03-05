package endpoint

import (
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/stretchr/testify/assert"
)

func TestGenerateServerToken(t *testing.T) {
	endpoint := "https://example.com"
	accessKey := "test-access-key"

	se := NewServiceEndpoint(endpoint, accessKey)

	tokenString, err := se.GenerateServerToken()
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)

	// Parse the token to validate its claims
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(accessKey), nil
	})
	assert.NoError(t, err)
	assert.NotNil(t, token)

	claims, ok := token.Claims.(jwt.MapClaims)
	assert.True(t, ok)
	assert.Equal(t, defaultIssuer, claims["iss"])
	assert.WithinDuration(t, time.Now(), time.Unix(int64(claims["iat"].(float64)), 0), time.Minute)
	assert.WithinDuration(t, time.Now().Add(time.Hour), time.Unix(int64(claims["exp"].(float64)), 0), time.Minute)
}

func TestNewServiceEndpoint(t *testing.T) {
	endpoint := "https://example.com"
	accessKey := "test-access-key"

	se := NewServiceEndpoint(endpoint, accessKey)

	assert.Equal(t, endpoint, se.(*serviceEndpoint).endpoint)
	assert.Equal(t, []byte(accessKey), se.(*serviceEndpoint).keyBytes)
}
