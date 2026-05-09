package repositories

import (
	"GoTasker/models"
	"gorm.io/gorm"
)

type TaskRepository interface {
	CreateTask(task *models.Task) error
	GetTasksByUserID(userID uint) ([]models.Task, error)
	GetTaskByID(id uint) (*models.Task, error)
	UpdateTask(task *models.Task) error
	DeleteTask(id uint) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db}
}

func (r *taskRepository) CreateTask(task *models.Task) error {
	return r.db.Create(task).Error
}

func (r *taskRepository) GetTasksByUserID(userID uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.Where("user_id = ?", userID).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) GetTaskByID(id uint) (*models.Task, error) {
	var task models.Task
	err := r.db.First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) UpdateTask(task *models.Task) error {
	return r.db.Save(task).Error
}

func (r *taskRepository) DeleteTask(id uint) error {
	return r.db.Delete(&models.Task{}, id).Error
}
