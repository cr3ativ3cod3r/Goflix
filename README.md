# Goflix

## A Self-Hosted Media Streaming Platform

Goflix is a self-hosted media streaming platform built using Golang, designed to simplify sharing and streaming video content within a local network. Users can easily share media files from their local storage with others on the same network, create interactive watch parties, or enjoy casual streaming sessions. The application also includes a real-time chat feature, allowing users to communicate during streaming.

## Features

- **Local Media Streaming** – Stream video content within a local network without the need for external servers.
- **Watch Parties** – Synchronized playback for multiple users watching together.
- **Real-Time Chat** – Built-in chat functionality for user interaction during streaming sessions.
- **Automatic Metadata Extraction** – Fetch movie details such as posters, frames, cast, genres, subtitles, and additional metadata through API calls.
- **Multi-Platform Support** – Built with Wails for seamless distribution across Windows, Linux, and macOS.
- **Efficient Performance** – Powered by Golang for optimized memory usage and concurrency.

## Technology Stack

- **Golang** – The core backend of the application, enabling high-performance streaming and efficient memory management.
- **Wails** – Used for building the desktop UI, ensuring a native experience across platforms.
- **SQLite** – Stores chat data for each streaming session.

## How It Works

1. **Browse and Select** – Users can browse and select a downloaded movie.
2. **Automatic Metadata Fetching** – The app makes API calls to retrieve:
   - Movie poster
   - Frames from movie
   - Details (title, release date, duration, etc.)
   - Cast and crew information
   - Genres
   - Available subtitles
   - Audio files
   - Additional metadata
3. **Streaming & Interaction** – Once added, the movie becomes available for streaming, and users can join sessions, watch together, and chat in real time.

## Development guidelines

### Prerequisites
- Go 1.24
- Node.js (for Wails UI)
- SQLite (included in Go dependencies)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/cr3ativ3cod3r/Goflix.git
   cd goflix
   ```
2. Install dependencies:
   ```sh
   go mod tidy
   ```
3. Build the application:
   ```sh
   wails build
   ```
4. Run the application:
   ```sh
   wails serve
   ```

## Contribution

We welcome contributions! Feel free to fork the repo, open issues, or submit pull requests.

## License
[LICENSE](./LICENSE)


