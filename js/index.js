// Import modules
import {initBanner} from './banner.js';
import {createMediaGrid, loadMediaFiles} from './utils.js';

// Function to create media grid items

// Function to load and display media
async function loadAndDisplayMedia() {
    const filenames = await loadMediaFiles();
    createMediaGrid(filenames);
}

// Initialize the banner with callback
initBanner(loadAndDisplayMedia);
