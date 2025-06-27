// utils.js - Module for common utility functions

/**
 * Get URL parameter by name
 * @param {string} name - The name of the parameter to get
 * @returns {string} The value of the parameter
 */
export function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Detect file type based on extension
 * @param {string} filename - The filename to check
 * @returns {string} The file type ('video', 'image', or 'unknown')
 */
export function getFileType(filename) {
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

/**
 * Load media files from index.txt
 * @param {string} [basePath=''] - Optional base path to prepend to the fetch URL
 * @returns {Promise<string[]>} Array of filenames
 */
export async function loadMediaFiles(basePath = '') {
    try {
        const response = await fetch(`${basePath}/index.txt`);
        if (!response.ok) {
            console.error('Failed to load media files');
            return [];
        }

        const text = await response.text();
        return text.trim().split('\n');
    } catch (error) {
        console.error('Error loading media files:', error);
        return [];
    }
}

/**
 * Load comments from comments.json
 * @param {string} [basePath=''] - Optional base path to prepend to the fetch URL
 * @returns {Promise<Object[]>} Array of comment objects
 */
export async function loadComments(basePath = '') {
    try {
        const response = await fetch(`${basePath}/comments.json`);
        if (!response.ok) {
            console.error('Failed to load comments');
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
}

export function createMediaGrid(filenames) {
    const mediaGrid = document.getElementById('mediaGrid');

    mediaGrid.innerHTML = '';
    filenames.forEach((filename, index) => {
        const fileType = getFileType(filename);
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.dataset.filename = filename;

        // Create HTML structure for media item
        mediaItem.innerHTML = `
            <div class="media-thumbnail">
                ${fileType === 'video'
            ? `<video src="media/${filename}" muted></video>`
            : `<img src="media/${filename}" alt="${filename}">`
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

        mediaGrid.appendChild(mediaItem);
    });
    filenames.forEach((filename, index) => {
        const fileType = getFileType(filename);
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.dataset.filename = filename;
        mediaItem.innerHTML = `
            <div class="media-thumbnail">
                ${fileType === 'video'
            ? `<video src="media/${filename}" muted></video>`
            : `<img src="media/${filename}" alt="${filename}">`}
                <div class="media-type">${fileType === 'video' ? 'VIDEO' : 'IMAGE'}</div>
            </div>
            <div class="media-info">
                <div class="media-title">Hot ${fileType === 'video' ? 'Video' : 'Image'} ${index + 1}</div>
                <div class="media-meta">
                    <span>1.2M views</span>
                    <span>95%</span>
                </div>
            </div>`;
        mediaItem.addEventListener('click', () => {
            window.location.href = `/view_video/?id=${filename}`;
        });
        mediaGrid.appendChild(mediaItem);
    });
}
