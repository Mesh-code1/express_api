document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('token', data.token); // Store token for authenticated requests
        window.location.href = 'appointments.html'; // Redirect to appointments
    })
    .catch(error => console.error('Error logging in:', error));
});