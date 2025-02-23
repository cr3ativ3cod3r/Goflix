package handlers

import (
	"fmt"
	"io"
	"log"
	"mime"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"github.com/gofiber/fiber/v2"
)

func HandleVideoStream(ctx *fiber.Ctx,videoPath string) error {

        videoFile, err := os.Open(videoPath)
        if err != nil {
                log.Printf("Error opening video file: %v\n", err)
                return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
        }
        defer videoFile.Close()

        videoInfo, err := videoFile.Stat()
        if err != nil {
                log.Printf("Error retrieving video file info: %v\n", err)
                return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
        }

        videoSize := videoInfo.Size()
        contentType := mime.TypeByExtension(filepath.Ext(videoPath))
        if contentType == "" {
                contentType = "video/mp4"
        }

        // Always set Accept-Ranges header
        ctx.Set(fiber.HeaderAcceptRanges, "bytes")

        rangeHeader := ctx.Get(fiber.HeaderRange)
        if rangeHeader != "" {
                return handlePartialContent(ctx, videoFile, rangeHeader, videoSize, contentType)
        }

        // Full content response
        ctx.Set(fiber.HeaderContentLength, strconv.FormatInt(videoSize, 10))
        ctx.Set(fiber.HeaderContentType, contentType)
        ctx.Status(fiber.StatusOK)

        if _, err := io.Copy(ctx.Response().BodyWriter(), videoFile); err != nil {
                log.Printf("Error streaming entire video file: %v\n", err)
                return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
        }

        return nil
}

func handlePartialContent(ctx *fiber.Ctx, file *os.File, rangeHeader string, fileSize int64, contentType string) error {
        // Parse range header
        ranges := strings.Split(strings.Replace(rangeHeader, "bytes=", "", 1), "-")
        if len(ranges) != 2 {
                return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range format")
        }

        // Parse start and end positions
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

        // Validate ranges
        if start >= fileSize || end >= fileSize || start > end {
                ctx.Set(fiber.HeaderContentRange, fmt.Sprintf("bytes */%d", fileSize))
                return ctx.Status(fiber.StatusRequestedRangeNotSatisfiable).SendString("Invalid range")
        }

        // Set response headers
        contentLength := end - start + 1
        ctx.Set(fiber.HeaderContentRange, fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
        ctx.Set(fiber.HeaderContentLength, strconv.FormatInt(contentLength, 10))
        ctx.Set(fiber.HeaderContentType, contentType)
        ctx.Status(fiber.StatusPartialContent)

        // Seek to start position
        if _, err := file.Seek(start, io.SeekStart); err != nil {
                log.Printf("Error seeking file position: %v\n", err)
                return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
        }

        // Stream the range
        if _, err := io.CopyN(ctx.Response().BodyWriter(), file, contentLength); err != nil {
                log.Printf("Error streaming partial content: %v\n", err)
                return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
        }

        return nil
}