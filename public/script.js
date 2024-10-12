document.getElementById('retrievePatientsBtn').addEventListener('click', retrievePatients);
document.getElementById('patientForm').addEventListener('submit', handleFormSubmit);

function retrievePatients() {
    fetch('/patients')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#patientsTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.patient_id}</td>
                    <td>${patient.first_name}</td>
                    <td>${patient.last_name}</td>
                    <td>${new Date(patient.date_of_birth).toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editPatient(${patient.patient_id}, '${patient.first_name}', '${patient.last_name}', '${patient.date_of_birth}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deletePatient(${patient.patient_id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error retrieving patients:', error));
}

function handleFormSubmit(event) {
    event.preventDefault();

    const patientId = document.getElementById('patientId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;

    if (patientId) {
        // Update patient
        updatePatient(patientId, firstName, lastName, dateOfBirth);
    } else {
        // Create new patient
        createPatient(firstName, lastName, dateOfBirth);
    }
}

document.getElementById('submitBtn').addEventListener('click', createPatient);
function createPatient(firstName, lastName, dateOfBirth) {
    fetch('/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth }),
    })
    .then(response => response.json())
    .then(() => {
        retrievePatients();
        resetForm();
    })
    .catch(error => console.error('Error creating patient:', error));
}

function updatePatient(id, firstName, lastName, dateOfBirth) {
    fetch(`/patients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth }),
    })
    .then(() => {
        retrievePatients();
        resetForm();
    })
    .catch(error => console.error('Error updating patient:', error));
}

function deletePatient(id) {
    fetch(`/patients/${id}`, {
        method: 'DELETE',
    })
    .then(() => retrievePatients())
    .catch(error => console.error('Error deleting patient:', error));
}

function editPatient(id, firstName, lastName, dateOfBirth) {
    document.getElementById('patientId').value = id;
    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('dateOfBirth').value = new Date(dateOfBirth).toISOString().split('T')[0];
    document.getElementById('submitBtn').textContent = 'Update Patient';
}

function resetForm() {
    document.getElementById('patientId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('dateOfBirth').value = '';
    document.getElementById('submitBtn').textContent = 'Add Patient';
}