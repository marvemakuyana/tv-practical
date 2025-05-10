# Fibertime Backend

This is the backend for the Fibertime project, a service that allows pairing devices and managing user data. The backend is built using NestJS and is connected to a PostgreSQL database.

## Table of Contents

- [Setup](#setup)
- [API Usage](#api-usage)
- [Database Schema](#database-schema)

---

## Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (version 16 or higher)
- PostgreSQL
- Docker (optional, if you prefer to run PostgreSQL in a container)

### 1. Clone the repository

```bash
git clone https://github.com/marvemakuyana/tv-practical.git
cd tv-practical-full-stack-starter
cd fibertime-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

```bash
cp .env.example .env
```

### 4. Run the application

```bash
npm run start:dev
```

### 5. Database setup

Make sure you have PostgreSQL running, either locally or via a cloud service like Railway.

postgresql://postgres:<password>@<hostname>:5432/<dbname>

### 6. API Usage

Base URL
https://tv-practical-production.up.railway.app/api/

### 7. Database Schema

devices
This table stores information about the devices that are paired to a bundle.
| Column | Type | Description |
| ------------ | ------------ | --------------------------------------- |
| id | SERIAL | Primary Key |
| device_name | VARCHAR(255) | Name of the device |
| tv_code | VARCHAR(255) | Unique code for the device |
| bundle_id | INTEGER | Foreign key referencing bundles |
| created_at | TIMESTAMP | Time when the device was created |
| updated_at | TIMESTAMP | Time when the device record was updated |

users Table
This table stores user information.

| Column       | Type        | Description                           |
| ------------ | ----------- | ------------------------------------- |
| id           | SERIAL      | Primary Key                           |
| phone_number | VARCHAR(20) | User's phone number                   |
| otp          | VARCHAR(6)  | OTP generated for login               |
| created_at   | TIMESTAMP   | Time when the user record was created |
| updated_at   | TIMESTAMP   | Time when the user record was updated |

### 8. Troubleshooting

If you're facing issues with deployment or connection errors, ensure that the following are correctly configured:

The database URL and credentials in the .env file are correct.

The PostgreSQL service is up and running.

Network/firewall settings allow for external connections.

# Fibertime Frontend

This is the frontend for the Fibertime project, built with React and Redux. The frontend interacts with the backend services to manage device pairing and user data.

## Table of Contents

- [Setup](#setup)
- [API Usage](#api-usage)
- [Frontend Structure](#frontend-structure)
- [Troubleshooting](#troubleshooting)

---

## Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (version 16 or higher)
- npm (Node package manager)

### 1. Clone the repository

```bash
cd tv-practical-full-stack-starter
cd fibertime-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

```bash
cp .env.example .env
```

### 4. Frontend Structure

The frontend is built using React and Redux for state management. Below is a breakdown of the main directories and files:

src/
components/: Reusable UI components such as buttons, forms, and loading spinners.

redux/: Contains actions, reducers, and store setup for managing global state.

services/: Contains utility functions to interact with the backend API.

pages/: React components representing different pages in the app, such as the login and pairing screens.

App.js: The main app component that sets up routing and global providers.

index.js: The entry point for rendering the React app.

### 5. Troubleshooting

Common Issues
Backend not reachable: Ensure your backend is running and the REACT_APP_API_URL in the .env file is set correctly.

CORS issues: If you encounter CORS issues, ensure that the backend enables CORS with the correct origin in the main.ts file.

App not loading: Make sure there are no errors in the browser console. If you see an error regarding the API or network requests, verify your network connection and backend status.

### 6. Run the application

```bash
npm run start
```

### 7. Run the entire app (backend + frontend) using Docker

```bash
cd tv-practical-full-stack-starter
docker-compose up --build
```
