package controllers

import (
	"GoTasker/models"
	"GoTasker/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TaskController struct {
	taskService services.TaskService
}

func NewTaskController(taskService services.TaskService) *TaskController {
	return &TaskController{taskService}
}

func (ctrl *TaskController) CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(uint)
	task.UserID = userID

	if err := ctrl.taskService.CreateTask(&task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (ctrl *TaskController) GetTasks(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	tasks, err := ctrl.taskService.GetTasksByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (ctrl *TaskController) UpdateTask(c *gin.Context) {
	taskIDParam := c.Param("id")
	taskID, err := strconv.ParseUint(taskIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task.ID = uint(taskID)

	userID := c.MustGet("userID").(uint)

	if err := ctrl.taskService.UpdateTask(&task, userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task updated successfully"})
}

func (ctrl *TaskController) DeleteTask(c *gin.Context) {
	taskIDParam := c.Param("id")
	taskID, err := strconv.ParseUint(taskIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	userID := c.MustGet("userID").(uint)

	if err := ctrl.taskService.DeleteTask(uint(taskID), userID); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
