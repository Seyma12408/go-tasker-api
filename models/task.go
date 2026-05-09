package models

import (
	"time"
)

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `json:"description"`
	Status      string    `gorm:"default:'pending'" json:"status"` // pending, in_progress, done
	Priority    string    `gorm:"default:'medium'" json:"priority"` // low, medium, high
	UserID      uint      `gorm:"not null" json:"user_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
