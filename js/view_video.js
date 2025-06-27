// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to detect file type based on extension
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();

    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (videoExtensions.includes(extension)) {
        return 'video';
    } else if (imageExtensions.includes(extension)) {
        return 'image';
    } else {
        return 'unknown';
    }
}

// Function to load media files from index.txt
async function loadMediaFiles() {
    try {
        const response = await fetch('/index.txt');
        if (!response.ok) {
            throw new Error('Failed to load media files');
        }

        const text = await response.text();
        return text.trim().split('\n');
    } catch (error) {
        console.error('Error loading media files:', error);
        return [];
    }
}

// Function to load comments from comments.json
async function loadComments() {
    try {
        const response = await fetch('/comments.json');
        if (!response.ok) {
            throw new Error('Failed to load comments');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
}

// Function to display the media (video or image)
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
    const randomComments = [];

    // Ensure we don't pick the same comment twice
    const commentIndices = new Set();
    while (commentIndices.size < numComments && commentIndices.size < comments.length) {
        const randomIndex = Math.floor(Math.random() * comments.length);
        commentIndices.add(randomIndex);
    }

    // Add the selected comments to our array
    commentIndices.forEach(index => {
        randomComments.push(comments[index]);
    });

    // Update the comment count
    commentCount.textContent = randomComments.length;

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
async function displayRelatedVideos(currentFilename, allFilenames) {
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
    // Check if user has already verified age
    if (localStorage.getItem('ageVerified') === 'true') {
        document.getElementById('ageVerification').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

        // Get the media ID from URL
        const mediaId = getUrlParameter('id');

        if (mediaId) {
            // Load and display the media
            displayMedia(mediaId);

            // Load all media files for related videos
            const allFilenames = await loadMediaFiles();
            displayRelatedVideos(mediaId, allFilenames);

            // Load and display comments
            const comments = await loadComments();
            displayComments(comments);
        } else {
            // No media ID provided, redirect to home
            window.location.href = '/';
        }
    }
}

// Initialize the page
initPage();
