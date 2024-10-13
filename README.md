 ## Completed the Telemed Web application
 Key Features
 ``` User Authentication and Role Management:
Registration and Login: Secure user registration and login system, with role-based access control for patients and doctors. Profile Management: Users can manage their profiles, update personal information, and view their appointment history.
 ```
 ``` Location-Based Services:
Health Center Locator: Integration with Google Maps API to help users find and view nearby health centers based on their current location or a specified area.
 ```
 ``` Appointment Booking:
Doctor Availability: Patients can view doctors' availability and book appointments directly through the platform. Appointment Management: Users can schedule, reschedule, or cancel appointments, and receive notifications about their bookings.
 ```
 ``` Doctor Management:
Specialization and Availability: Doctors can manage their availability, specializations, and appointment slots, ensuring patients have up-to-date information when booking. Consultation Services: The platform allows for virtual consultations through a secure communication channel.
 ```
 ``` User-Friendly Interface:
Responsive Design: The application features a clean, responsive design that ensures a seamless experience across all devices. Intuitive Navigation: Easy-to-use interface with clear navigation paths for all users, whether they are booking an appointment or managing their doctor profile.
 ```
  ``` Security and Compliance:
Data Security: Implementation of HTTPS, JWT-based authentication, and data encryption to protect user information. Compliance: Adherence to healthcare standards and regulations, ensuring that user data is handled with the utmost confidentiality.
 ```
 
 ## Testing API endpoints
 ```Retrieve all patients: ``` [GET http://localhost:3000/patients]

 ```Retrieve all providers: ``` [GET http://localhost:3000/providers]

 ```Filter patients by first name: ``` [GET http://localhost:3000/patients/filter?first_name=John]

 ```Retrieve all providers by specialty: ``` [GET http://localhost:3000/providers/specialty?specialty=Cardiology]

 ## Setup
1. Clone the repository
2. Initialize the node.js environment
   ```
   npm init -y
   ```
3. Install the necessary dependancies
   ```
   npm install express mysql2 dotenv nodemon cors bcrypt jwt
   ```
4. Create a ``` server.js ``` and ```.env``` files
5. Basic ```server.js``` setup
   <br>
   
   ```js
   const express = require('express')
   const app = express()

  
   const PORT = 3000
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   })
   ```
<br><br>

## Run the server
   ```
   nodemon server.js
   ```
<br><br>

## Setup the ```.env``` file
```.env
DB_USERNAME=root
DB_HOST=localhost
DB_PASSWORD=your_password
DB_NAME=hospital_db
```

<br><br>

## Configure the database connection and test the connection
Configure the ```server.js``` file to access the credentials in the ```.env``` to use them in the database connection

<br>

## 1. Retrieve all patients
Create a ```GET``` endpoint that retrieves all patients and displays their:
- ```patient_id```
- ```first_name```
- ```last_name```
- ```date_of_birth```

<br>

## 2. Retrieve all providers
Create a ```GET``` endpoint that displays all providers with their:
- ```first_name```
- ```last_name```
- ```provider_specialty```

<br>

## 3. Filter patients by First Name
Create a ```GET``` endpoint that retrieves all patients by their first name

<br>

## 4. Retrieve all providers by their specialty
Create a ```GET``` endpoint that retrieves all providers by their specialty

<br>


<br>

## Process of reverse and forward engineering the hospital_db
### Step 1: Export the Database Schema from MySQL Workbench

1. **Open MySQL Workbench** and connect to your database.

2. **Navigate to "Database" > "Reverse Engineer"**:
   - Click on **"Database"** in the top menu.
   - Select **"Reverse Engineer"** from the dropdown. This will allow you to generate an Entity-Relationship (ER) diagram, which can be saved as a visual representation of your schema.

3. **Select the Schema to Export**:
   - Choose the **database** you want to export.
   - Follow the steps to reverse engineer the schema. This will generate a visual ER model.

4. **Export the Model to a File**:
   - Once the ER model is generated, go to **"File" > "Export" > "Export as SQL CREATE Script…"**.
   - Save the **SQL file** containing the `CREATE TABLE` statements for all your tables.

Alternatively, you can **export the schema directly** using the **"Data Export" tool**:

- Go to **"Server" > "Data Export"**.
- Select the **database** and the **"Export to Self-Contained File"** option.
- This will export the entire schema, including the structure and data if selected.
<br>
