package main

import (
	"log"
	"os"

	"GoTasker/config"
	"GoTasker/controllers"
	"GoTasker/repositories"
	"GoTasker/routes"
	"GoTasker/services"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading it, using system environment variables")
	}

	// Connect to Database & AutoMigrate
	config.ConnectDB()

	// Dependency Injection Setup
	// Repositories
	userRepo := repositories.NewUserRepository(config.DB)
	taskRepo := repositories.NewTaskRepository(config.DB)

	// Services
	userService := services.NewUserService(userRepo)
	taskService := services.NewTaskService(taskRepo)

	// Controllers
	userCtrl := controllers.NewUserController(userService)
	taskCtrl := controllers.NewTaskController(taskService)

	// Router Setup
	r := routes.SetupRouter(userCtrl, taskCtrl)

	// Start Server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to run server: ", err)
	}
}
