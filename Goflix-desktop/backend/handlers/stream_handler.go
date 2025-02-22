package main

import (
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func handleVideoStream(ctx *fiber.Ctx, videoPath string) error {

	videoFile, err := os.Open(videoPath)
	if err != nil {
		log.Println("Error opening video file:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}
	defer videoFile.Close()

	videoInfo, err := videoFile.Stat()
	if err != nil {
		log.Println("Error retrieving video file info:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	contentType := mime.TypeByExtension(filepath.Ext(videoPath))
	videoSize := videoInfo.Size()

	rangeHeaders := ctx.GetReqHeaders()["range"]
	if len(rangeHeaders) > 0 {
		return handlePartialContent(ctx, videoFile, rangeHeaders[0], videoSize, contentType)
	}

	ctx.Set("Content-Length", strconv.FormatInt(videoSize, 10))
	ctx.Set("Content-Type", contentType)

	if _, err := io.Copy(ctx.Response().BodyWriter(), videoFile); err != nil {
		log.Println("Error streaming entire video file:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	return nil
}

func handlePartialContent(ctx *fiber.Ctx, file *os.File, rangeHeader string, fileSize int64, contentType string) error {
	rangeParts := strings.Split(rangeHeader, "=")
	if len(rangeParts) != 2 {
		log.Println("Invalid Range Header")
		return ctx.Status(http.StatusInternalServerError).SendString("Internal Server Error")
	}

	rangeValues := strings.Split(rangeParts[1], "-")
	start, err := strconv.ParseInt(rangeValues[0], 10, 64)
	if err != nil {
		log.Println("Error parsing range start:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	end := fileSize - 1
	if len(rangeValues) > 1 && rangeValues[1] != "" {
		end, err = strconv.ParseInt(rangeValues[1], 10, 64)
		if err != nil {
			log.Println("Error parsing range end:", err)
			return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
		}
	}

	ctx.Set(fiber.HeaderContentRange, fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
	ctx.Set(fiber.HeaderContentLength, strconv.FormatInt(end-start+1, 10))
	ctx.Set(fiber.HeaderContentType, contentType)
	ctx.Set(fiber.HeaderAcceptRanges, "bytes")
	ctx.Status(fiber.StatusPartialContent)

	if _, err := file.Seek(start, io.SeekStart); err != nil {
		log.Println("Error seeking file position:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	if _, err := io.CopyN(ctx.Response().BodyWriter(), file, end-start+1); err != nil {
		log.Println("Error streaming partial content:", err)
		return ctx.Status(fiber.StatusInternalServerError).SendString("Internal Server Error")
	}

	return nil
}
