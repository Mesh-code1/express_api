document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = 'login.html'; // Redirect to login
    })
    .catch(error => console.error('Error registering user:', error));
});