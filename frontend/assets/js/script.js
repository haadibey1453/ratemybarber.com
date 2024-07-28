var isSignedIn = true; // Change this to false to simulate a non-signed-in user
var userName = "John Doe"; // Example user name

document.addEventListener('DOMContentLoaded', function () {
    var userInfo = document.getElementById('userInfo');
    var card = document.getElementById('floatingCard');

    if (isSignedIn) {
        userInfo.innerHTML = `<p class="text-black nav-text">Welcome ${userName} <a href="register.html" class="settings-icon"> <i class="fas fa-cog"></i></a></p>`;
        card.innerHTML = `
            <h2 class="register-heading text-black">Review</h2>
            <div class="input-container">
                <input type="text" class="input-field bg-black text-white" placeholder="Name">
            </div>
            <div class="input-container">
                <input type="text" class="input-field bg-black text-white" placeholder="Location">
            </div>
            <div class="input-container">
                <input type="text" class="input-field bg-black text-white" placeholder="Cut">
            </div>
            <div class="input-container">
                <textarea type="text" class="input-field bg-black text-white" placeholder="Experience" rows="5"></textarea>
            </div>
            <div class="input-container">
                <input type="text" class="input-field bg-black text-white" placeholder="Rating">
                <button class="paper-plane-btn"><i class="fa fa-paper-plane"></i></button>
            </div>
            
        `;
    } else {
        authLinks.innerHTML = `
            <a class="nav-link me-3 mt-2" href="login.html">Sign In</a>
            <a class="btn btn-dark register-btn text-caps" href="register.html">Register</a>
        `;
        card.innerHTML = '<a href="register.html">Sign In or Register to write a review</a>';
    }
});

document.getElementById('floatingBtn').addEventListener('click', function () {
    var card = document.getElementById('floatingCard');
    if (card.style.display === 'none' || card.style.display === '') {
        card.style.display = 'block';
    } else {
        card.style.display = 'none';
    }
});

document.addEventListener('click', function (event) {
    var card = document.getElementById('floatingCard');
    var floatingBtn = document.getElementById('floatingBtn');
    if (!card.contains(event.target) && !floatingBtn.contains(event.target)) {
        card.style.display = 'none';
    }
});