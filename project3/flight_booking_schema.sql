-- Flight Booking System Database Schema
-- Database: PostgreSQL

-- Create database
CREATE DATABASE flight_booking;

-- Connect to database
\c flight_booking;

-- Users table - stores user information including loyalty points
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table - stores flight information
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

-- Bookings table - connects users and flights with booking details
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

-- Create indexes for query efficiency
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_flights_number ON flights(flight_number);
CREATE INDEX idx_flights_route ON flights(origin, destination);
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_flight ON bookings(flight_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Insert sample data for testing
INSERT INTO users (name, email, phone, loyalty_points) VALUES
('John Doe', 'john@example.com', '+1234567890', 0),
('Jane Smith', 'jane@example.com', '+0987654321', 0),
('Bob Johnson', 'bob@example.com', '+1122334455', 0);

INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, total_seats, available_seats, price) VALUES
('FL001', 'Jakarta', 'Bali', '2024-01-15 10:00:00', '2024-01-15 11:30:00', 150, 150, 500000),
('FL002', 'Jakarta', 'Surabaya', '2024-01-16 14:00:00', '2024-01-16 15:00:00', 120, 120, 300000),
('FL003', 'Bali', 'Jakarta', '2024-01-17 08:00:00', '2024-01-17 09:30:00', 150, 150, 500000);

INSERT INTO bookings (user_id, flight_id, seats_booked, total_price) VALUES
(1, 1, 2, 1000000),
(2, 2, 1, 300000),
(3, 3, 3, 1500000);

-- Sample queries for testing the schema

-- 1. Get all users with their loyalty points
SELECT id, name, email, loyalty_points FROM users;

-- 2. Get all available flights
SELECT flight_number, origin, destination, departure_time, price 
FROM flights 
WHERE available_seats > 0;

-- 3. Get bookings with user and flight details
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

-- 4. Search flights by route
SELECT flight_number, departure_time, arrival_time, price, available_seats
FROM flights
WHERE origin = 'Jakarta' AND destination = 'Bali' AND available_seats > 0;

-- 5. Get user's booking history
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

-- 6. Update loyalty points (bonus feature)
UPDATE users 
SET loyalty_points = loyalty_points + 100 
WHERE id = 1;

-- 7. Get flights with low availability
SELECT flight_number, origin, destination, available_seats
FROM flights
WHERE available_seats < 10;

-- 8. Get booking statistics
SELECT 
    status,
    COUNT(*) as booking_count,
    SUM(total_price) as total_revenue
FROM bookings
GROUP BY status; 