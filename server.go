package main

import (
	"fmt"
    "log"
	"net/http"
	"time"
	"os"
	"github.com/gorilla/mux"
	"github.com/Brianmsmith33/goReact/api"
)

func main() {
	os.Setenv("MONGODB_USERNAME", "")
	os.Setenv("MONGODB_PASSWORD", "")
	os.Setenv("MONGODB_CLUSTER", "")
	os.Setenv("MONGODB_DBNAME", "")
	os.Setenv("JWT_SECRET", "")

	router := mux.NewRouter()
	router.HandleFunc("/api/auth/check", api.RegisterCheck).Methods("POST")
	router.HandleFunc("/api/auth/user", api.LoadUser).Methods("GET")
	router.HandleFunc("/api/auth/user", api.LoginUser).Methods("POST")
	router.HandleFunc("/api/auth/register", api.RegisterUser).Methods("POST")
	
	server := &http.Server{
		Handler: router,
		Addr:    "127.0.0.1:5000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	fmt.Println("Server started at http://localhost:5000")
	log.Fatal(server.ListenAndServe())
}
