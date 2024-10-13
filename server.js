const express = require('express')
const app = express()
const connection = require('./db');

const cors = require('cors');
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Question 1 Retrieving all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth, gender, language FROM patients';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error retrieving patients.');
      }
      res.json(results);
    });
  });

// Create a new patient
app.post('/patients', (req, res) => {
  const { first_name, last_name, date_of_birth, gender, language } = req.body;
  const query = 'INSERT INTO patients (first_name, last_name, date_of_birth, gender, language) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [first_name, last_name, date_of_birth, gender, language], (err, result) => {
    if (err) {
      return res.status(500).send('Error creating patient.');
    }
    res.status(201).send({ message: 'Patient created successfully', patient_id: result.insertId });
  });
});
  
  // Update a patient
  app.put('/patients/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth } = req.body;
    const query = 'UPDATE patients SET first_name = ?, last_name = ?, date_of_birth = ? WHERE patient_id = ?';
    connection.query(query, [first_name, last_name, date_of_birth, id], (err) => {
      if (err) {
        return res.status(500).send('Error updating patient.');
      }
      res.send({ message: 'Patient updated successfully' });
    });
  });
  
  // Delete a patient
  app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;

    // Lock the table before performing the delete operation
    const lockQuery = 'LOCK TABLES patients WRITE';
    connection.query(lockQuery, (lockErr) => {
        if (lockErr) {
            console.error('Error locking table:', lockErr);
            return res.status(500).send('Error locking table.');
        }

        // Perform the delete operation
        const deleteQuery = 'DELETE FROM patients WHERE patient_id = ?';
        connection.query(deleteQuery, [id], (deleteErr, result) => {
            if (deleteErr) {
                console.error('Error deleting patient from database:', deleteErr);
                return res.status(500).send('Error deleting patient.');
            }

            if (result.affectedRows === 0) {
                console.warn(`Patient with ID ${id} not found.`);
                return res.status(404).send('Patient not found.');
            }

            // Unlock the table after the delete operation
            const unlockQuery = 'UNLOCK TABLES';
            connection.query(unlockQuery, (unlockErr) => {
                if (unlockErr) {
                    console.error('Error unlocking table:', unlockErr);
                    return res.status(500).send('Error unlocking table.');
                }

                res.send({ message: 'Patient deleted successfully' });
            });
        });
    });
});



// Question 2
app.get('/providers', (req, res) => {
    const query = 'SELECT provider_id, first_name, last_name, provider_specialty, email_address, phone_number, date_joined FROM providers';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error retrieving providers.');
      }
      res.json(results);
    });
  });
// Question 3 Filtering patients by first name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(query, [first_name], (err, results) => {
    if (err) {
      return res.status(500).send('Error filtering patients.');
    }
    res.json(results);
  });
});
// Question 4
app.get('/providers/specialty', (req, res) => {
    const { specialty } = req.query;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    connection.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).send('Error retrieving providers by specialty.');
      }
      res.json(results);
    });
  });

const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})