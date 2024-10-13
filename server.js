const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');


const express = require('express')
const app = express()
const connection = require('./db');

const cors = require('cors');
app.use(cors());


//Middleware for session management
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));


// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Default route that serves landing.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/landing.html');
});


// Register User
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
  connection.query(query, [email, hashedPassword, role], (err, result) => {
      if (err) {
          return res.status(500).send('Error registering user.');
      }
      res.status(201).send({ message: 'User registered successfully' });
  });
});

// Login User
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], async (err, results) => {
      if (err || results.length === 0) {
          return res.status(401).send('Invalid credentials');
      }
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).send('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.user_id, role: user.role }, 'your_jwt_secret');
      res.json({ token });
  });
});

//Middleware function
function checkRole(role) {
  return (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).send('Access denied');
      jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
          if (err || decoded.role !== role) {
              return res.status(403).send('Forbidden');
          }
          req.user = decoded;
          next();
      });
  };
}

// Retrieving all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth, gender, language FROM patients';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error retrieving patients.');
      }
      res.json(results);
    });
  });

// Creating a new patient
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
  
  // Updating a patient
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
  
  // Deleting a patient
  app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;

    // Locking the table before performing the delete operation
    const lockQuery = 'LOCK TABLES patients WRITE';
    connection.query(lockQuery, (lockErr) => {
        if (lockErr) {
            console.error('Error locking table:', lockErr);
            return res.status(500).send('Error locking table.');
        }

        // Performing the delete operation
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

            // Unlocking the table after the delete operation
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



// Getting providers
app.get('/providers', (req, res) => {
    const query = 'SELECT provider_id, first_name, last_name, provider_specialty, email_address, phone_number, date_joined FROM providers';
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send('Error retrieving providers.');
      }
      res.json(results);
    });
  });
//Filtering patients by first name
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
// Getting provider specialty
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

//Appointments
app.post('/appointments', (req, res) => {
  const { patient_id, doctor_id, appointment_time } = req.body;

  // Here, implement your logic to insert the appointment into the database
  const query = 'INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES (?, ?, ?)';
  connection.query(query, [patient_id, doctor_id, appointment_time], (err, result) => {
      if (err) {
          return res.status(500).send({ message: 'Error booking appointment.' });
      }
      res.status(201).send({ message: 'Appointment booked successfully!', appointment_id: result.insertId });
  });
});




const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})