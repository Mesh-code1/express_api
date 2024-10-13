document.getElementById('appointmentForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect input values
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const token = localStorage.getItem('token'); // Retrieve the token

    // Make a POST request to book the appointment
    fetch('/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the request header
        },
        body: JSON.stringify({
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_time: appointmentTime
        }),
    })
    .then(response => {
        if (!response.ok) { // Check if the response is OK
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); // Parse JSON response
    })
    .then(data => {
        alert(data.message); // Alert the user of the response message
        // Dynamically add the newly booked appointment to the table
        addAppointmentRow(data.appointment_id, patientId, doctorId, appointmentTime);
    })
    .catch(error => console.error('Error booking appointment:', error)); // Handle errors

});

// Function to add a new row for the booked appointment
function addAppointmentRow(appointmentId, patientId, doctorId, appointmentTime) {
    const tableBody = document.querySelector('#appointmentsTable tbody');
    const row = document.createElement('tr');
    
    // Create and populate cells for the new appointment
    row.innerHTML = `
        <td>${appointmentId}</td>
        <td>${patientId}</td>
        <td>${doctorId}</td>
        <td>${new Date(appointmentTime).toLocaleString()}</td>
        <td><button class="delete-btn" data-id="${appointmentId}">Delete</button></td>
    `;
    
    // Append the new row to the table body
    tableBody.appendChild(row);
}

// Optional: Function to load existing appointments on page load
function loadAppointments() {
    fetch('/appointments')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#appointmentsTable tbody');
            tableBody.innerHTML = ''; // Clear existing appointments
            data.forEach(appointment => {
                addAppointmentRow(
                    appointment.appointment_id,
                    appointment.patient_id,
                    appointment.doctor_id,
                    appointment.appointment_time
                );
            });
        })
        .catch(error => console.error('Error loading appointments:', error));
}

// Call loadAppointments on page load to display existing appointments
loadAppointments();