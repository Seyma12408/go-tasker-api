package routes

import (
	"GoTasker/controllers"
	"GoTasker/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(userCtrl *controllers.UserController, taskCtrl *controllers.TaskController) *gin.Engine {
	r := gin.Default()

	// Serve Static Web Frontend
	r.StaticFile("/", "./public/index.html")
	r.StaticFile("/style.css", "./public/style.css")
	r.StaticFile("/app.js", "./public/app.js")

	// Public routes
	auth := r.Group("/auth")
	{
		auth.POST("/register", userCtrl.Register)
		auth.POST("/login", userCtrl.Login)
	}

	// Protected auth routes
	authProtected := r.Group("/auth")
	authProtected.Use(middleware.AuthMiddleware())
	{
		authProtected.GET("/me", userCtrl.GetMe)
		authProtected.PUT("/update", userCtrl.UpdateProfile)
	}

	// Protected task routes
	tasks := r.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware())
	{
		tasks.POST("/", taskCtrl.CreateTask)
		tasks.GET("/", taskCtrl.GetTasks)
		tasks.PUT("/:id", taskCtrl.UpdateTask)
		tasks.DELETE("/:id", taskCtrl.DeleteTask)
	}

	return r
}
