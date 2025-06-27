const ageVerification = document.getElementById('ageVerification');
const mainContent = document.getElementById('mainContent');
const yesButton = document.getElementById('ageVerificationYes');
const noButton = document.getElementById('ageVerificationNo');

// Check if user has already verified age
if (localStorage.getItem('ageVerified') === 'true') {
    ageVerification.style.display = 'none';
    mainContent.style.display = 'block';
}

// User confirms they are of age
yesButton.addEventListener('click', function() {
    localStorage.setItem('ageVerified', 'true');
    ageVerification.style.display = 'none';
    mainContent.style.display = 'block';
});

// User confirms they are underage
noButton.addEventListener('click', function() {
    window.location.href = 'https://www.google.com';
});
