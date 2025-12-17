# PHP_Laravel12_Crud_With_Master_Using_React.JS

A complete full-stack CRUD application built with **Laravel 12** (REST API) and **React.js** (frontend), demonstrating a clean **Master–Detail** relationship between **Categories** and **Products**.

---

## Project Overview

This project demonstrates a multi-CRUD full-stack architecture with clear separation of concerns.

**Backend**

* Laravel RESTful API
* MySQL relational database
* One-to-Many relationship handling

**Frontend**

* React.js
* Material-UI based layout
* Axios-driven API communication

**Core Features**

* Full CRUD for Categories (Master)
* Full CRUD for Products (Detail)
* Data validation and error handling
* Scalable project structure

---

## Quick Start

### Prerequisites

Ensure the following are installed on your system:

* PHP 8.0 or higher
* Composer
* Node.js 14 or higher
* npm or yarn
* MySQL

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/laravel-react-crud.git
cd laravel-react-crud
```

---

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update your **.env** file with correct database credentials, then run:

```bash
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

The React application will start on `http://localhost:3000` by default.

---

## Project Structure

### Backend (Laravel)

```
backend/
├── app/Http/Controllers/API
├── app/Models
├── database/migrations
├── database/seeders
└── routes/api.php
```

### Frontend (React)

```
frontend/
├── src/components
├── src/services
├── src/App.js
└── src/index.js
```

---

## Features

### Backend

* RESTful API using Laravel
* Category and Product CRUD operations
* One-to-Many database relationship
* Request validation
* Proper error responses
* Database seeding support

### Frontend

* Clean Material-UI based design
* React Router for navigation
* Formik and Yup for form validation
* Axios for API requests
* Responsive layout

---

## API Endpoints

### Categories

```
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

### Products

```
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

---

## Database Schema

### Categories Table

```
id
name
description
timestamps
```

### Products Table

```
id
name
description
price
stock
category_id
timestamps
```

---

## Usage Flow

1. Create categories
2. Add products linked to categories
3. Update or delete categories and products
4. Test the complete CRUD lifecycle

---

## Troubleshooting

* Ensure CORS is configured for `http://localhost:3000`
* Verify database credentials in `.env`
* Change ports if already in use
* Run migrations if tables are missing

---

## screenshot
## 1. Dashboard
<img width="1638" height="714" alt="image" src="https://github.com/user-attachments/assets/c9f8c84e-2a98-4b80-b1b5-1115ecb775d5" />

## 2. Categories
<img width="1425" height="969" alt="image" src="https://github.com/user-attachments/assets/cd25c40a-a4d3-4026-8870-de82d83019c6" />

## 3. ADD Categories 
<img width="1372" height="667" alt="image" src="https://github.com/user-attachments/assets/409b6e94-d7ce-4e2f-9946-51f085677d2f" />

## 4. Products
<img width="1456" height="929" alt="image" src="https://github.com/user-attachments/assets/1313defd-d62f-4394-9b9a-781ce7b4f3af" />

## 5. ADD Products 
<img width="1404" height="964" alt="image" src="https://github.com/user-attachments/assets/24a3b92a-f37a-466a-8951-ddb7616b1c58" />


