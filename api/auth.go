package api

import (
	"net/http"
	"encoding/json"
	"log"
	"fmt"
	"os"
	"context"
	"time"
	"github.com/zoonman/gravatar"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"github.com/gomodule/redigo/redis"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/Brianmsmith33/goReact/models"
	"github.com/Brianmsmith33/goReact/config"
	"github.com/Brianmsmith33/goReact/middleware"
)

var cache redis.Conn
func initCache() {
	// Initialize the redis connection to a redis instance running on your local machine
	conn, err := redis.DialURL("redis://localhost")
	if err != nil {
		panic(err)
	}
	// Assign the connection to the package level `cache` variable
	cache = conn
}

// RegisterCheck ...
func RegisterCheck(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	client, ctx, err := config.ConnectMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)
	
	var user models.User
	if err := json.NewDecoder(req.Body).Decode(&user); err != nil {
		panic(err)
	}

	collection := client.Database(os.Getenv("MONGODB_DBNAME")).Collection("users")

	if err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&user); err != nil {
		panic(err)
	}
	if err := json.NewEncoder(res).Encode(1); err != nil {
		panic(err)
	}
}

// LoadUser ...
func LoadUser(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	token := req.Header.Get("x-auth-token")
	userID, err := middleware.ParseClaims(token)
	if err != nil {
		json.NewEncoder(res).Encode(false)
	}
	client, ctx, _ := config.ConnectMongoDB()
	defer client.Disconnect(ctx)
	
	collection := client.Database(os.Getenv("MONGODB_DBNAME")).Collection("users")
	var user models.User
	if err := collection.FindOne(ctx, bson.M{"id": userID}).Decode(&user); err != nil {
		panic(err)
	}
	
	if err := json.NewEncoder(res).Encode(user); err != nil {
		panic(err)
	}
}

// LoginUser ...
func LoginUser(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	client, ctx, _ := config.ConnectMongoDB()
	defer client.Disconnect(ctx)

	var newUser models.User
	if err := json.NewDecoder(req.Body).Decode(&newUser); err != nil {
		panic(err)
	}
	collection := client.Database(os.Getenv("MONGODB_DBNAME")).Collection("users")
	var user models.User
	if err := collection.FindOne(ctx, bson.M{"email": newUser.Email}).Decode(&user); err != nil {
		panic(err)
	}
	
			
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(newUser.Password)); err != nil {
		panic(err)
	}else{
		token, err := middleware.GenerateJWT(user.ID)
		if err != nil {
			fmt.Errorf("Error: %s", err.Error())
		}

		if err := json.NewEncoder(res).Encode(token); err != nil {
			panic(err)
		}
	}
}

// RegisterUser ...
func RegisterUser(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	client, ctx, _ := config.ConnectMongoDB()
	defer client.Disconnect(ctx)

	var newUser models.User
	if err := json.NewDecoder(req.Body).Decode(&newUser); err != nil {
		panic(err)
	}
	bytes, _ := bcrypt.GenerateFromPassword([]byte(newUser.Password), 14)
	encryptedPassword := string(bytes)
	newUser.Password = encryptedPassword

	newUser.Avatar = gravatar.Avatar(newUser.Email, 256)
	newUser.RegDate = time.Now()
	collection := client.Database(os.Getenv("MONGODB_DBNAME")).Collection("users")

	insertResult, err := collection.InsertOne(context.TODO(), newUser)
	if err != nil {
		panic(err)
	}
	filter := bson.M{"email": newUser.Email}
	stringObjectID := insertResult.InsertedID.(primitive.ObjectID).Hex()
	newUser.ID = stringObjectID
	update := bson.M{
		"$set": bson.M{"id": stringObjectID},
	}

	upsert := true
	after := options.After
	opt := options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
		Upsert:         &upsert,
	}
	
	updateResult := collection.FindOneAndUpdate(ctx, filter, update, &opt)
	if updateResult.Err() != nil {
		panic(updateResult.Err())
	}
	fmt.Println("Inserted user with ID:", insertResult.InsertedID)
	
	if err := json.NewEncoder(res).Encode(newUser); err != nil {
		panic(err)
	}
}
