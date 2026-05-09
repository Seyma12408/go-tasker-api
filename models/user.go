package models

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"uniqueIndex;not null" json:"username"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"` // "-" ensures password isn't returned in JSON
	CreatedAt time.Time `json:"created_at"`
	Tasks     []Task    `gorm:"foreignKey:UserID" json:"tasks,omitempty"`
}
