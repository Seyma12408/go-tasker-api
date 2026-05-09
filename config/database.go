package config

import (
	"fmt"
	"log"
	"os"

	"GoTasker/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!\n", err)
	}

	DB = db
	log.Println("Database connection successfully opened")

	// Auto Migrate
	err = db.AutoMigrate(&models.User{}, &models.Task{})
	if err != nil {
		log.Fatal("Failed to migrate database!\n", err)
	}
	log.Println("Database migration completed")
}
