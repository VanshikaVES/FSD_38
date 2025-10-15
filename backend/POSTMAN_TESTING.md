# Hospital Appointment System API Testing with Postman

This guide provides step-by-step instructions to test the RESTful APIs using Postman.

## Prerequisites

1. **Install MongoDB**: Make sure MongoDB is installed and running on your system.
   - Download from: https://www.mongodb.com/try/download/community
   - Start MongoDB service

2. **Install Node.js**: Ensure Node.js (v14+) is installed.

3. **Install Postman**: Download from https://www.postman.com/downloads/

## Setup Steps

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run seed  # Populate database with initial data
npm run dev   # Start server in development mode
```

The server will run on `http://localhost:5000`

### 2. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Select "File" tab
4. Choose `backend/hospital-appointment.postman_collection.json`
5. Click "Import"

### 3. Set Environment Variables

The collection uses variables. You can set them in Postman:

1. Click on "Environments" (left sidebar)
2. Create a new environment called "Hospital API"
3. Add these variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: (leave empty, will be set automatically)
   - `doctorId`: (leave empty, will be set as needed)
   - `appointmentId`: (leave empty, will be set as needed)

## Step-by-Step CRUD Operations in Postman

### Step 1: Authentication (POST)

1. **Login as Admin**:
   - In Postman, select the collection "Hospital Appointment System API"
   - Open "Authentication" folder
   - Click on "Login" request
   - Verify the request details:
     - Method: POST
     - URL: `{{baseUrl}}/api/auth/login`
     - Headers: `Content-Type: application/json`
     - Body (raw JSON):
       ```json
       {
         "email": "admin@hospital.com",
         "password": "admin123"
       }
       ```
   - Click the blue "Send" button
   - ✅ **Expected Response**: Status 200 OK
   - The response body will contain a JWT token
   - **Important**: The token is automatically saved to the `{{token}}` collection variable by the test script

### Step 2: Get All Doctors (GET)

1. **Fetch Doctors List**:
   - Open "Doctors" folder
   - Click on "Get All Doctors" request
   - Verify the request details:
     - Method: GET
     - URL: `{{baseUrl}}/api/doctors`
     - Headers: `Authorization: Bearer {{token}}`
   - Click "Send"
   - ✅ **Expected Response**: Status 200 OK with array of doctors
   - **Copy a Doctor ID**: From the response, copy one doctor's `_id` field (e.g., "507f1f77bcf86cd799439011") - you'll need this for creating appointments

### Step 3: Create Appointment (POST)

1. **Create New Appointment**:
   - Open "Appointments" folder
   - Click on "Create Appointment" request
   - Update the request body to include the doctor ID you copied:
     ```json
     {
       "fullName": "John Doe",
       "doctor": "507f1f77bcf86cd799439011",  // Replace with actual doctor ID
       "date": "2024-12-01",
       "time": "10:00",
       "reason": "Regular checkup"
     }
     ```
   - Verify headers: `Authorization: Bearer {{token}}`
   - Click "Send"
   - ✅ **Expected Response**: Status 201 Created
   - **Copy Appointment ID**: From the response, copy the `_id` field for the next operations

### Step 4: Get User Appointments (GET)

1. **View Your Appointments**:
   - In "Appointments" folder, click "Get User Appointments"
   - Verify:
     - Method: GET
     - URL: `{{baseUrl}}/api/appointments`
     - Headers: `Authorization: Bearer {{token}}`
   - Click "Send"
   - ✅ **Expected Response**: Status 200 OK with array containing your appointment

### Step 5: Update Appointment (PUT)

1. **Modify Appointment**:
   - Click on "Update Appointment" request
   - Update the URL to include your appointment ID:
     - Change `{{appointmentId}}` to the actual ID you copied
   - In the request body, specify what to update:
     ```json
     {
       "date": "2024-12-02",
       "time": "11:00",
       "reason": "Updated: Regular checkup with new time"
     }
     ```
   - Headers: `Authorization: Bearer {{token}}`
   - Click "Send"
   - ✅ **Expected Response**: Status 200 OK with updated appointment details

### Step 6: Delete Appointment (DELETE)

1. **Remove Appointment**:
   - Click on "Delete Appointment" request
   - Ensure the URL contains your appointment ID:
     - URL should be: `{{baseUrl}}/api/appointments/YOUR_APPOINTMENT_ID`
   - Headers: `Authorization: Bearer {{token}}`
   - Click "Send"
   - ✅ **Expected Response**: Status 200 OK with message "Appointment removed"

### Step 7: Admin Operations (GET/PUT)

1. **Get All Appointments (Admin)**:
   - Open "Admin" folder
   - Click "Get All Appointments"
   - This shows all appointments in the system (admin only)
   - ✅ Expected: Status 200 OK with all appointments array

2. **Update Appointment Status (Admin)**:
   - Click "Update Appointment Status"
   - Update URL with an appointment ID
   - Body: `{"status": "confirmed"}`
   - ✅ Expected: Status 200 OK

## Visual Guide for Each Operation

### POST (Create) - Login
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "admin@hospital.com",
  "password": "admin123"
}

Response: 200 OK with token
```

### GET (Read) - Get Doctors
```
Method: GET
URL: http://localhost:5000/api/doctors
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK with doctors array
```

### POST (Create) - Create Appointment
```
Method: POST
URL: http://localhost:5000/api/appointments
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "doctor": "507f1f77bcf86cd799439011",
  "date": "2024-12-01",
  "time": "10:00",
  "reason": "Checkup"
}

Response: 201 Created with appointment object
```

### GET (Read) - Get Appointments
```
Method: GET
URL: http://localhost:5000/api/appointments
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK with appointments array
```

### PUT (Update) - Update Appointment
```
Method: PUT
URL: http://localhost:5000/api/appointments/60f1b2b3c4d5e6f7g8h9i0j1
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Body:
{
  "date": "2024-12-02",
  "time": "11:00",
  "reason": "Updated reason"
}

Response: 200 OK with updated appointment
```

### DELETE (Delete) - Delete Appointment
```
Method: DELETE
URL: http://localhost:5000/api/appointments/60f1b2b3c4d5e6f7g8h9i0j1
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK with {"message": "Appointment removed"}
```

## Test Credentials

### Admin User
- Email: `admin@hospital.com`
- Password: `admin123`

### Regular Users
- User 1: `user1@hospital.com` / `user123`
- User 2: `user2@hospital.com` / `user456`

## Troubleshooting

1. **401 Unauthorized**: Check if token is set correctly
2. **404 Not Found**: Verify the endpoint URL and method
3. **500 Internal Server Error**: Check server logs
4. **Connection Refused**: Ensure server is running on port 5000

## Additional Testing

- Test with invalid tokens
- Test with missing required fields
- Test role-based access (user vs admin endpoints)
- Test duplicate appointments for same doctor/time
- Test appointment updates with invalid data

## Running Automated Tests

You can also run the Jest tests:

```bash
cd backend
npm test
```

This will run automated tests for the appointments API.
