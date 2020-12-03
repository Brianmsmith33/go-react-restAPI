package middleware

import (
	"fmt"
	"time"
	"os"
	jwt "github.com/dgrijalva/jwt-go"
)

type customClaims struct {
	User string `json:"user"`
	jwt.StandardClaims
}

// GenerateJWT ...
func GenerateJWT(id string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["user"] = id
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	var jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	tokenString, err := token.SignedString(jwtSecret)

	if err != nil {
		fmt.Errorf("Error: %s", err.Error())
		return "", err
	}

	return tokenString, nil
}

// ParseClaims ...
func ParseClaims(tkn string) (string, error) {
	token, err := jwt.ParseWithClaims(
		tkn,
		&customClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil 
		},
	)
	claims, ok := token.Claims.(*customClaims)
	if !ok {
		return "", err
	}
	if claims.ExpiresAt < time.Now().UTC().Unix() {
		return "", err
	}
	return claims.User, nil
}