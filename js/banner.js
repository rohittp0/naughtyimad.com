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

/**
 * Initialize the age verification banner
 * @param {Function} onProceed - Callback function to execute when user proceeds
 */
export function initBanner(onProceed) {
    const ageVerification = document.getElementById('ageVerification');
    const mainContent = document.getElementById('mainContent');
    const yesButton = document.getElementById('ageVerificationYes');
    const noButton = document.getElementById('ageVerificationNo');

    setupSearchBar()

    // Check if user has already verified age
    if (localStorage.getItem('ageVerified') === 'true') {
        ageVerification.style.display = 'none';
        mainContent.style.display = 'block';

        // Execute the callback function if provided
        if (typeof onProceed === 'function') {
            onProceed();
        }
    }

    // User confirms they are of age
    yesButton.addEventListener('click', function() {
        localStorage.setItem('ageVerified', 'true');
        ageVerification.style.display = 'none';
        mainContent.style.display = 'block';

        // Execute the callback function if provided
        if (typeof onProceed === 'function') {
            onProceed();
        }
    });

    // User confirms they are underage
    noButton.addEventListener('click', function() {
        window.location.href = 'https://www.google.com';
    });
}
