package services

import (
	"GoTasker/models"
	"GoTasker/repositories"
	"GoTasker/utils"
	"errors"
)

type UserService interface {
	RegisterUser(user *models.User) error
	LoginUser(email, password string) (string, error)
	GetUserByID(id uint) (*models.User, error)
	UpdateProfile(id uint, username, email, newPassword string) error
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo}
}

func (s *userService) RegisterUser(user *models.User) error {
	// Hash the password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	return s.repo.CreateUser(user)
}

func (s *userService) LoginUser(email, password string) (string, error) {
	// Find user by email
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	// Verify password
	if !utils.CheckPasswordHash(password, user.Password) {
		return "", errors.New("invalid email or password")
	}

	// Generate JWT
	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *userService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.GetUserByID(id)
}

func (s *userService) UpdateProfile(id uint, username, email, newPassword string) error {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	if username != "" {
		user.Username = username
	}
	if email != "" {
		user.Email = email
	}
	if newPassword != "" {
		hashed, err := utils.HashPassword(newPassword)
		if err != nil {
			return err
		}
		user.Password = hashed
	}

	return s.repo.UpdateUser(user)
}
