const baseUrl = 'http://localhost:5000'; // Replace with actual server URL when deployed

// Register User
async function registerUser(userData) {
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        console.log('User registered:', data);
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

// Login User
async function loginUser(loginData) {
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        console.log('Login:', data);
        return data.jwtToken; 
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

// Add Barber Profile
async function addBarberProfile(barberData, token) {
    try {
        const response = await fetch(`${baseUrl}/barbers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(barberData)
        });
        const data = await response.json();
        console.log('Barber profile added:', data);
    } catch (error) {
        console.error('Error adding barber profile:', error);
    }
}

// Add Review
async function addReview(reviewData, token) {
    try {
        const response = await fetch(`${baseUrl}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        });
        const data = await response.json();
        console.log('Review added:', data);
    } catch (error) {
        console.error('Error adding review:', error);
    }
}

// Get Barber Reviews
async function getBarberReviews(barberId) {
    try {
        const response = await fetch(`${baseUrl}/barbers/${barberId}/reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Barber reviews:', data);
        return data;
    } catch (error) {
        console.error('Error fetching barber reviews:', error);
    }
}

// Search Barbers or Reviews
async function search(query) {
    try {
        const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Search results:', data);
        return data;
    } catch (error) {
        console.error('Error searching:', error);
    }
}

// Example usage with form submissions
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const account_name = document.getElementById('account_name').value;

    const userData = { name, email, password, role, account_name };
    await registerUser(userData);
});

// Add event listeners for other forms or actions as needed
// For example, for login:
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const loginData = { email, password };
    const token = await loginUser(loginData);

    // Use the token for authenticated requests
    if (token) {
        // Example: Add a barber profile
        const barberData = {
            name: 'Barber Name',
            location: 'Location',
            barber_shop_name: 'Shop Name',
            expertise: 'Expertise',
            phone_number: 'Phone Number',
            account_name: 'Account Name'
        };
        await addBarberProfile(barberData, token);
    }
});
