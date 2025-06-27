import { initBanner } from './banner.js';
import { getFileType, getUrlParameter, loadMediaFiles } from './utils.js';

const mediaGrid = document.getElementById('mediaGrid');
const searchHeading = document.getElementById('searchHeading');

function createMediaGrid(filenames) {
    mediaGrid.innerHTML = '';
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

async function loadSearchResults() {
    const searchTerm = getUrlParameter('search').toLowerCase();
    if (searchHeading) {
        searchHeading.textContent = `Search results for "${searchTerm}"`;
    }
    const filenames = await loadMediaFiles();
    const filtered = filenames.filter(name => name.toLowerCase().includes(searchTerm));
    createMediaGrid(filtered);
}

function setupSearchBar() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
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

initBanner(() => {
    loadSearchResults();
    setupSearchBar();
});
