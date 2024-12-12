# Park N Go

A web-based application designed to simplify parking space management and enhance user experience. This app allows users to view available parking spots, book a space, and manage their parking session, all in real-time.

## Features
- **User Authentication:** Secure login and registration for users.
- **Parking Spot Availability:** Real-time updates on available parking spaces.
- **Parking Management:** Users can create, book, and manage parking sessions.
- **Image Processing:** Detect parking spots from images using machine learning models.
- **Admin Panel:** Manage and monitor parking spots and bookings.

## Tech Stack
- **Backend:** Django (Python)
- **Frontend:** React Vite
- **Database:** PostgreSQL

## Setup

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/smart-parking-app.git
```

### 2. Create django venv
```bash
cd backend
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
```

### 3. Install react vite dependencies
```bash
cd frontend
npm i
```

### 4. To run backend
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

### 5. To run fronted
```bash
cd frontend
npm run dev -- --host
```
