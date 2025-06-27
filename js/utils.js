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
