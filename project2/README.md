# Project2 - Order Management System

A TypeScript-based order management system with unique code generation and MySQL integration.

## Features

- ✅ **Order Management**: Create, read, update orders with unique codes
- ✅ **Unique Code Generation**: Generate codes 1-10 ensuring no duplicates
- ✅ **Fixed Pricing**: All products priced at 299,000 IDR
- ✅ **Status Management**: Track order status (pending, paid, cancelled, completed)
- ✅ **RESTful API**: Complete CRUD operations with pagination
- ✅ **TypeScript**: Full type safety and modern development experience
- ✅ **MySQL Integration**: Robust database operations with connection pooling
- ✅ **Docker Support**: Containerized application with MySQL
- ✅ **Security**: Helmet, CORS, rate limiting
- ✅ **Testing Support**: Generate 50+ test transactions

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f project2

# Stop services
docker-compose down
```

### Manual Setup

```bash
# Install dependencies
cd project2
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Orders

#### Create Order
```
POST /api/v1/orders
Content-Type: application/json

{
  "produk_id": 1,
  "nama_produk": "Produk A"
}
```

#### Get Order by ID
```
GET /api/v1/orders/:id
```

#### Get All Orders (with pagination)
```
GET /api/v1/orders?page=1&limit=10
```

#### Update Order Status
```
PATCH /api/v1/orders/:id/status
Content-Type: application/json

{
  "status": "paid"
}
```

#### Get Orders by Status
```
GET /api/v1/orders/status/pending?page=1&limit=10
```

#### Get Order by Unique Code
```
GET /api/v1/orders/code/05
```

#### Generate Test Orders
```
POST /api/v1/orders/generate-test?count=50
```

#### Get Order Statistics
```
GET /api/v1/orders/statistics
```

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produk_id INT NOT NULL,
    nama_produk VARCHAR(255) NOT NULL,
    harga DECIMAL(10,2) NOT NULL DEFAULT 299000.00,
    kode_unik VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('pending', 'paid', 'cancelled', 'completed') DEFAULT 'pending',
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Unique Code Generation

- **Range**: 01-10 (2-digit format)
- **Uniqueness**: Ensures no duplicate codes
- **Algorithm**: Random generation with database validation
- **Fallback**: Maximum 100 attempts to prevent infinite loops

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `DB_HOST` | mysql | Database host |
| `DB_PORT` | 3306 | Database port |
| `DB_USER` | digivo_user | Database user |
| `DB_PASSWORD` | digivo_password | Database password |
| `DB_NAME` | digivo_db | Database name |

## Development

### Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Build
npm run build        # Compile TypeScript to JavaScript

# Production
npm start           # Start production server

# Testing
npm test            # Run tests

# Linting
npm run lint        # Check code style
npm run lint:fix    # Fix code style issues
```

### Project Structure

```
project2/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # TypeScript interfaces
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── utils/          # Utilities (database, code generator)
│   └── index.ts        # Application entry point
├── database/
│   └── init.sql        # Database initialization
├── dist/               # Compiled JavaScript
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── Dockerfile          # Docker configuration
└── README.md          # This file
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Create an Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "produk_id": 1,
    "nama_produk": "Produk A"
  }'
```

### 3. Generate Test Orders
```bash
curl -X POST "http://localhost:3000/api/v1/orders/generate-test?count=50"
```

### 4. Get Statistics
```bash
curl http://localhost:3000/api/v1/orders/statistics
```

### 5. Get All Orders
```bash
curl "http://localhost:3000/api/v1/orders?page=1&limit=10"
```

## Features Implementation

### ✅ Requirements Met

1. **Order Table**: Complete with all required fields
2. **Unique Code Generation**: 1-10 range with no duplicates
3. **Fixed Price**: 299,000 IDR for all products
4. **50+ Transactions**: Test generation function included
5. **Node.js Functions**: Complete CRUD operations
6. **MySQL Connection**: Robust database integration
7. **TypeScript**: Full type safety implementation

### 🔧 Technical Features

- **Connection Pooling**: Efficient database connections
- **Transaction Support**: ACID compliance for critical operations
- **Error Handling**: Comprehensive error management
- **Input Validation**: Request validation and sanitization
- **Security**: CORS, Helmet, rate limiting
- **Logging**: Detailed error and access logging
- **Graceful Shutdown**: Proper cleanup on termination

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart services
docker-compose restart
```

### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 docker-compose up
```

### TypeScript Compilation Errors
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

## License

MIT License - see LICENSE file for details. 