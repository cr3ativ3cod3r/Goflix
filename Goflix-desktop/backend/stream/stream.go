package stream

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

var StreamApp *fiber.App

// Initialize and start Fiber server
func InitStreamApp() {
	StreamApp = fiber.New()

	StreamApp.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Range, Accept-Ranges, Content-Range")

		// Handle preflight requests
		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	})

	// Example route
	StreamApp.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	// Start Fiber in a separate goroutine
	go func() {
		if err := StreamApp.Listen(":8081"); err != nil {
			log.Fatal("Failed to start Fiber server:", err)
		}
	}()
}

// Get the global instance of StreamApp
func GetStreamApp() *fiber.App {
	if StreamApp == nil {
		InitStreamApp() // Ensure it's initialized before use
	}
	return StreamApp
}
