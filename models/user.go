package models

import (
	"time"
)

// User ...
type User struct { 
	ID            string    `bson:"id" json:"id"`
	FirstName     string    `bson:"firstname" json:"firstname"`
	LastName      string    `bson:"lastname" json:"lastname"`
	Email		  string    `bson:"email" json:"email"`
	Password      string    `bson:"password" json:"password"`
	IsAdmin 	  bool      `bson:"isAdmin" json:"isAdmin"`
	Avatar        string    `bson:"avatar" json:"avatar"`
	RegDate       time.Time `bson:"regDate" json:"regDate"`
}