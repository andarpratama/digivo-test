# Flight Booking System - Database Schema Design

## Overview
This document contains the complete database schema design for a flight booking system using PostgreSQL. The schema is optimized for query efficiency and includes all required features plus bonus loyalty points functionality.

## Database Schema

### 1. Users Table
Stores user information including loyalty points (bonus feature):

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key (auto-increment)
- `name`: User's full name
- `email`: Unique email address
- `phone`: Phone number
- `loyalty_points`: Loyalty points balance (bonus feature)
- `created_at`, `updated_at`: Timestamps

### 2. Flights Table
Stores flight information with seat management:

```sql
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(20) UNIQUE NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key (auto-increment)
- `flight_number`: Unique flight number
- `origin`: Departure city
- `destination`: Arrival city
- `departure_time`: Flight departure time
- `arrival_time`: Flight arrival time
- `total_seats`: Total seats on aircraft
- `available_seats`: Available seats for booking
- `price`: Ticket price
- `created_at`, `updated_at`: Timestamps

### 3. Bookings Table
Connects users and flights with booking details:

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flight_id INTEGER NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'confirmed',
    seats_booked INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key (auto-increment)
- `user_id`: Foreign key to users table
- `flight_id`: Foreign key to flights table
- `booking_date`: Date of booking
- `status`: Booking status (confirmed, cancelled, etc.)
- `seats_booked`: Number of seats booked
- `total_price`: Total booking price
- `created_at`, `updated_at`: Timestamps

## Database Efficiency Features

### Indexes for Query Optimization
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_flights_number ON flights(flight_number);
CREATE INDEX idx_flights_route ON flights(origin, destination);
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_flight ON bookings(flight_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### Foreign Key Relationships
- `bookings.user_id` → `users.id` (CASCADE DELETE)
- `bookings.flight_id` → `flights.id` (CASCADE DELETE)

### Constraints
- Unique constraints on email and flight_number
- NOT NULL constraints on required fields
- Foreign key constraints for data integrity

## Sample Queries

### 1. Get all users with loyalty points
```sql
SELECT id, name, email, loyalty_points FROM users;
```

### 2. Get available flights
```sql
SELECT flight_number, origin, destination, departure_time, price 
FROM flights 
WHERE available_seats > 0;
```

### 3. Get booking details with user and flight info
```sql
SELECT 
    b.id,
    u.name as user_name,
    u.email as user_email,
    f.flight_number,
    f.origin,
    f.destination,
    b.seats_booked,
    b.total_price,
    b.status
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN flights f ON b.flight_id = f.id;
```

### 4. Search flights by route
```sql
SELECT flight_number, departure_time, arrival_time, price, available_seats
FROM flights
WHERE origin = 'Jakarta' AND destination = 'Bali' AND available_seats > 0;
```

### 5. Get user's booking history
```sql
SELECT 
    f.flight_number,
    f.origin,
    f.destination,
    b.booking_date,
    b.seats_booked,
    b.total_price,
    b.status
FROM bookings b
JOIN flights f ON b.flight_id = f.id
WHERE b.user_id = 1;
```

### 6. Update loyalty points (bonus feature)
```sql
UPDATE users 
SET loyalty_points = loyalty_points + 100 
WHERE id = 1;
```

## Requirements Fulfilled

### ✅ Core Requirements
1. **User Table**: Stores name, email, and phone number
2. **Flight Table**: Stores flight number, origin, destination, and departure time
3. **Booking Table**: Connects users and flights with booking date, status, and seats booked

### ✅ Bonus Requirements
1. **Loyalty Points**: Added to users table with default value of 0
2. **Query Efficiency**: 
   - Indexes on frequently queried columns
   - Optimized JOIN operations
   - Proper foreign key relationships
   - Composite indexes for route searches

## Usage

1. Create the database:
```sql
CREATE DATABASE flight_booking;
```

2. Run the schema file:
```bash
psql -d flight_booking -f flight_booking_schema.sql
```

3. Test the queries in the schema file to verify functionality.

## Schema Benefits

- **Scalability**: Efficient indexes support large datasets
- **Data Integrity**: Foreign keys and constraints prevent invalid data
- **Performance**: Optimized for common booking system queries
- **Flexibility**: Supports various booking statuses and loyalty programs
- **Maintainability**: Clear structure with proper relationships 