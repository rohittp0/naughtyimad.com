import { initBanner } from './banner.js';
import {createMediaGrid, getUrlParameter, loadMediaFiles} from './utils.js';

const searchHeading = document.getElementById('searchHeading');

async function loadSearchResults() {
    const searchTerm = getUrlParameter('search').toLowerCase();
    if (searchHeading) {
        searchHeading.textContent = `Search results for "${searchTerm}"`;
    }
    const filenames = await loadMediaFiles();
    const filtered = filenames.filter(name => name.toLowerCase().includes(searchTerm));

    if (filtered.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results';
        noResultsMessage.textContent = 'No results found.';
        document.getElementById('mediaGrid').appendChild(noResultsMessage);
    }
    else
        createMediaGrid(filtered);
}

initBanner(loadSearchResults);
