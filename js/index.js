// Import modules
import { initBanner } from './banner.js';
import {getFileType, loadMediaFiles, uniqueNumberFromString} from './utils.js';

const mediaGrid = document.getElementById('mediaGrid');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');

// Function to create media grid items
function createMediaGrid(filenames) {
    mediaGrid.innerHTML = '';

    filenames.forEach((filename) => {
        const fileType = getFileType(filename);
        const mediaItem = document.createElement('div');
        const name = filename.split('.')[0]; // Get the name without extension
        const number = uniqueNumberFromString(filename);
        const views = (number % 10) / 10 || 1

        mediaItem.className = 'media-item';
        mediaItem.dataset.filename = filename;

        // Create HTML structure for media item
        mediaItem.innerHTML = `
            <div class="media-thumbnail">
                ${fileType === 'video' 
                    ? `<video src="media/${filename}" muted></video>` 
                    : `<img src="media/${filename}" alt="${name}">`
                }
                <div class="media-type">${fileType === 'video' ? 'VIDEO' : 'IMAGE'}</div>
            </div>
            <div class="media-info">
                <div class="media-title">Hot ${fileType === 'video' ? 'Video' : 'Image'} ${name}</div>
                <div class="media-meta">
                    <span>${views}M views</span>
                    <span>${number % 100}</span>
                </div>
            </div>
        `;

        // Add click event to navigate to view_video page
        mediaItem.addEventListener('click', () => {
            window.location.href = `/view_video?id=${filename}`;
        });

        mediaGrid.appendChild(mediaItem);
    });
}

// Function to load and display media
async function loadAndDisplayMedia() {
    const filenames = await loadMediaFiles();
    createMediaGrid(filenames);
}

function setupSearchBar() {
    const handler = () => {
        const term = searchInput.value.trim();
        if (term) {
            window.location.href = `/search/?search=${encodeURIComponent(term)}`;
        }
    };
    searchBtn.addEventListener('click', handler);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handler();
    });
}

// Initialize the banner with callback
initBanner(() => {
    loadAndDisplayMedia();
    setupSearchBar();
});
