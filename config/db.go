package config

import (
	"fmt"
	"log"
	"context"
	"time"
	"os"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ConnectMongoDB ...
func ConnectMongoDB() (*mongo.Client, context.Context, error)  {
	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")
	cluster := os.Getenv("MONGODB_CLUSTER")
	dbname := os.Getenv("MONGODB_DBNAME")

	client, err := mongo.NewClient(options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://%s:%s!@%s-tnwpj.mongodb.net/%s?retryWrites=true&w=majority", username, password, cluster, dbname)))
    if err != nil {
        log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
    err = client.Connect(ctx)
    if err != nil {
            log.Fatal(err)
    }
	
	return client, ctx, err
}