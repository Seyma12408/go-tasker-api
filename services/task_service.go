package services

import (
	"GoTasker/models"
	"GoTasker/repositories"
	"errors"
)

type TaskService interface {
	CreateTask(task *models.Task) error
	GetTasksByUserID(userID uint) ([]models.Task, error)
	GetTaskByID(id uint, userID uint) (*models.Task, error)
	UpdateTask(task *models.Task, userID uint) error
	DeleteTask(id uint, userID uint) error
}

type taskService struct {
	repo repositories.TaskRepository
}

func NewTaskService(repo repositories.TaskRepository) TaskService {
	return &taskService{repo}
}

func (s *taskService) CreateTask(task *models.Task) error {
	return s.repo.CreateTask(task)
}

func (s *taskService) GetTasksByUserID(userID uint) ([]models.Task, error) {
	return s.repo.GetTasksByUserID(userID)
}

func (s *taskService) GetTaskByID(id uint, userID uint) (*models.Task, error) {
	task, err := s.repo.GetTaskByID(id)
	if err != nil {
		return nil, err
	}
	
	// Ensure the task belongs to the requesting user
	if task.UserID != userID {
		return nil, errors.New("unauthorized to access this task")
	}

	return task, nil
}

func (s *taskService) UpdateTask(task *models.Task, userID uint) error {
	existingTask, err := s.repo.GetTaskByID(task.ID)
	if err != nil {
		return err
	}

	if existingTask.UserID != userID {
		return errors.New("unauthorized to update this task")
	}

	// Update allowed fields
	existingTask.Title = task.Title
	existingTask.Description = task.Description
	existingTask.Status = task.Status
	existingTask.Priority = task.Priority

	return s.repo.UpdateTask(existingTask)
}

func (s *taskService) DeleteTask(id uint, userID uint) error {
	existingTask, err := s.repo.GetTaskByID(id)
	if err != nil {
		return err
	}

	if existingTask.UserID != userID {
		return errors.New("unauthorized to delete this task")
	}

	return s.repo.DeleteTask(id)
}
