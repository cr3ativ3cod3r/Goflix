package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
)

type VideoStream struct {
	Path string
	ID   string
}

var (
	videoStreams = make(map[string]string)
	mux          = sync.Mutex{}
	port         string
)

func main() {
	var videoPath, videoId string
	flag.StringVar(&videoPath, "file", "", "Path to the video file to stream")
	flag.StringVar(&videoId, "videoId", "", "ID for the video stream")
	flag.StringVar(&port, "port", "3000", "Port for the server")
	flag.Parse()

	app := fiber.New()

	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Range, Accept-Ranges, Content-Range")
		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	})

	app.Get("/stream/:id", handleVideoStream)
	app.Post("/register", registerNewStream)

	log.Printf("Starting server on port %s...", port)
	log.Fatal(app.Listen(":" + port))
}

func registerNewStream(c *fiber.Ctx) error {
	var stream VideoStream
	if err := json.Unmarshal(c.Body(), &stream); err != nil {
		return c.Status(http.StatusBadRequest).SendString("Invalid request body")
	}

	mux.Lock()
	videoStreams[stream.ID] = stream.Path
	mux.Unlock()

	return c.Status(http.StatusOK).SendString("Stream registered successfully")
}

func handleVideoStream(ctx *fiber.Ctx) error {
	requestedId := ctx.Params("id")

	mux.Lock()
	videoPath, exists := videoStreams[requestedId]
	mux.Unlock()

	if !exists {
		return ctx.Status(fiber.StatusNotFound).SendString("Video not found")
	}

	videoFile, err := os.Open(videoPath)
	if err != nil {
		log.Printf("Error opening video file: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}
	defer videoFile.Close()

	videoInfo, err := videoFile.Stat()
	if err != nil {
		log.Printf("Error retrieving video file info: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	videoSize := videoInfo.Size()
	contentType := mime.TypeByExtension(filepath.Ext(videoPath))
	if contentType == "" {
		contentType = "video/mp4"
	}

	rangeHeader := ctx.Get(fiber.HeaderRange)
	if rangeHeader != "" {
		return handlePartialContent(ctx, videoFile, rangeHeader, videoSize, contentType)
	}

	ctx.Set(fiber.HeaderContentLength, strconv.FormatInt(videoSize, 10))
	ctx.Set(fiber.HeaderContentType, contentType)
	ctx.Status(fiber.StatusOK)

	if _, err := io.Copy(ctx.Response().BodyWriter(), videoFile); err != nil {
		log.Printf("Error streaming video: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	return nil
}

func handlePartialContent(ctx *fiber.Ctx, file *os.File, rangeHeader string, fileSize int64, contentType string) error {
	ranges := strings.Split(strings.Replace(rangeHeader, "bytes=", "", 1), "-")
	if len(ranges) != 2 {
		return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range format")
	}

	start, err := strconv.ParseInt(ranges[0], 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range start")
	}

	var end int64
	if ranges[1] == "" {
		end = fileSize - 1
	} else {
		end, err = strconv.ParseInt(ranges[1], 10, 64)
		if err != nil {
			return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range end")
		}
	}

	if start >= fileSize || end >= fileSize || start > end {
		ctx.Set(fiber.HeaderContentRange, fmt.Sprintf("bytes */%d", fileSize))
		return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range")
	}

	contentLength := end - start + 1
	ctx.Set(fiber.HeaderContentRange, fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
	ctx.Set(fiber.HeaderContentLength, strconv.FormatInt(contentLength, 10))
	ctx.Set(fiber.HeaderContentType, contentType)
	ctx.Status(fiber.StatusPartialContent)

	if _, err := file.Seek(start, io.SeekStart); err != nil {
		log.Printf("Error seeking file: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	if _, err := io.CopyN(ctx.Response().BodyWriter(), file, contentLength); err != nil {
		log.Printf("Error streaming partial content: %v", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	return nil
}
