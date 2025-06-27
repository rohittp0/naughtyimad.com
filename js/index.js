const ageVerification = document.getElementById('ageVerification');
const mainContent = document.getElementById('mainContent');
const yesButton = document.getElementById('ageVerificationYes');
const noButton = document.getElementById('ageVerificationNo');
const mediaGrid = document.getElementById('mediaGrid');

// Function to load media files from index.txt
async function loadMediaFiles() {
    try {
        const response = await fetch('index.txt');
        if (!response.ok) {
            throw new Error('Failed to load media files');
        }

        const text = await response.text();
        const filenames = text.trim().split('\n');

        return filenames;
    } catch (error) {
        console.error('Error loading media files:', error);
        return [];
    }
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

// Function to create media grid items
function createMediaGrid(filenames) {
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
}

// Initialize the page
async function initPage() {
    // Check if user has already verified age
    if (localStorage.getItem('ageVerified') === 'true') {
        ageVerification.style.display = 'none';
        mainContent.style.display = 'block';

        // Load media files
        const filenames = await loadMediaFiles();
        createMediaGrid(filenames);
    }

    // User confirms they are of age
    yesButton.addEventListener('click', async function() {
        localStorage.setItem('ageVerified', 'true');
        ageVerification.style.display = 'none';
        mainContent.style.display = 'block';

        // Load media files
        const filenames = await loadMediaFiles();
        createMediaGrid(filenames);
    });

    // User confirms they are underage
    noButton.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
}

// Initialize the page
initPage();
