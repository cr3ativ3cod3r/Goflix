const generateThumbnail = (videoPath) => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const mkImg = canvas.getContext('2d');

        video.autoplay = false;
        video.muted = true;
        video.src = videoPath;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.currentTime = Math.min(1, video.duration * 0.25);
        };
        video.onseeked = () => {
            mkImg.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
            video.remove();
            resolve(thumbnailUrl);
        };

        // Handle errors
        video.onerror = () => {
            video.remove();
            resolve('/api/placeholder/160/90');
        };
    });
};
