// Function to display the media (video or image)
import {getFileType, getUrlParameter, loadComments, loadMediaFiles} from "./utils.js";
import {initBanner} from "./banner.js";

function displayMedia(filename) {
    const videoContainer = document.getElementById('videoContainer');
    const fileType = getFileType(filename);

    if (fileType === 'video') {
        videoContainer.innerHTML = `
            <video controls autoplay>
                <source src="/media/${filename}" type="video/${filename.split('.').pop()}">
                Your browser does not support the video tag.
            </video>
        `;
    } else if (fileType === 'image') {
        videoContainer.innerHTML = `
            <img src="/media/${filename}" alt="${filename}">
        `;
    } else {
        videoContainer.innerHTML = `
            <div class="error-message">Unsupported file type</div>
        `;
    }

    // Update the video title
    document.getElementById('videoTitle').textContent = `Hot ${fileType === 'video' ? 'Video' : 'Image'} - ${filename}`;
}

// Function to display comments
function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');

    // Get 1-3 random comments
    const numComments = Math.floor(Math.random() * 3) + 1;
    const commentStartIndex = Math.floor(Math.random() * (comments.length - numComments + 1));
    const randomComments = comments.slice(commentStartIndex, commentStartIndex + numComments);

    // Update the comment count
    commentCount.textContent = String(randomComments.length);

    // Clear existing comments
    commentsList.innerHTML = '';

    // Add the comments to the DOM
    randomComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <img src="/${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <a href="#" class="comment-author">${comment.author}</a>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Function to display related videos
function displayRelatedVideos(currentFilename, allFilenames) {
    const relatedVideos = document.getElementById('relatedVideos');

    // Find the index of the current file
    const currentIndex = allFilenames.indexOf(currentFilename);

    // Get files that come after the current one (wrap around if needed)
    let relatedFilenames = [];
    if (currentIndex !== -1) {
        // Get up to 6 related videos
        for (let i = 1; i <= 6; i++) {
            const index = (currentIndex + i) % allFilenames.length;
            relatedFilenames.push(allFilenames[index]);
        }
    } else {
        // If current file not found, just use the first 6 files
        relatedFilenames = allFilenames.slice(0, 6);
    }

    // Clear existing related videos
    relatedVideos.innerHTML = '';

    // Add the related videos to the DOM
    relatedFilenames.forEach((filename, index) => {
        const fileType = getFileType(filename);
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.dataset.filename = filename;

        // Create HTML structure for media item
        mediaItem.innerHTML = `
            <div class="media-thumbnail">
                ${fileType === 'video'
            ? `<video src="/media/${filename}" muted></video>`
            : `<img src="/media/${filename}" alt="${filename}">`
        }
                <div class="media-type">${fileType === 'video' ? 'VIDEO' : 'IMAGE'}</div>
            </div>
            <div class="media-info">
                <div class="media-title">Hot ${fileType === 'video' ? 'Video' : 'Image'} ${index + 1}</div>
                <div class="media-meta">
                    <span>1.2M views</span>
                    <span>95%</span>
                </div>
            </div>
        `;

        // Add click event to navigate to view_video page
        mediaItem.addEventListener('click', () => {
            window.location.href = `/view_video/?id=${filename}`;
        });

        relatedVideos.appendChild(mediaItem);
    });
}

// Initialize the page
async function initPage() {
    const mediaId = getUrlParameter('id');

    if (!mediaId) {
        window.location.href = '/';
        return
    }
    // Load and display the media
    displayMedia(mediaId);

    // Load all media files for related videos
    const allFilenames = await loadMediaFiles();
    displayRelatedVideos(mediaId, allFilenames);

    // Load and display comments
    const comments = await loadComments();
    displayComments(comments);
}

// Initialize the page
initBanner(initPage)
