# PHP_Laravel12_Crud_With_Master_Using_React.JS

A complete **full‑stack CRUD application** built with **Laravel 12 (REST API)** and **React.js (frontend)** that demonstrates a clear **Master–Detail relationship** between **Categories (Master)** and **Products (Detail)**.

This project is designed for **learning**, **college projects**, **interviews**, and as a **starter architecture** for real‑world applications.

---

## Project Overview

This application follows a clean separation of concerns between backend and frontend.

### Backend (Laravel 12)

* RESTful API architecture
* MySQL relational database
* One‑to‑Many relationship (Category → Products)
* Request validation & structured API responses
* Database migrations and seeders

### Frontend (React.js)

* React functional components
* Material‑UI based modern UI
* Axios for API communication
* React Router for navigation
* Form handling with validation

---

## Core Features

* Full CRUD operations for **Categories** (Master)
* Full CRUD operations for **Products** (Detail)
* Products linked to Categories using foreign keys
* Form validation and error handling
* Clean, scalable folder structure
* Easy to extend and customize

---

## Prerequisites

Make sure the following are installed:

* PHP 8.0 or higher
* Composer
* Node.js 14 or higher
* npm or yarn
* MySQL

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/laravel-react-crud.git
cd laravel-react-crud
```

---

### 2. Backend Setup (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update database details in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_react_crud
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed
```

Start Laravel server:

```bash
php artisan serve --port=8000
```

---

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```
http://localhost:3000
```

Backend API runs on:

```
http://localhost:8000
```

---

## Project Structure

### Backend (Laravel)

```
backend/
├── app/
│   ├── Http/Controllers/API
│   ├── Models
├── database/
│   ├── migrations
│   └── seeders
├── routes/
│   └── api.php
└── .env
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/
│   ├── services/
│   ├── pages/
│   ├── App.js
│   └── index.js
└── package.json
```

---

## API Endpoints

### Category APIs (Master)

```
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

### Product APIs (Detail)

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

| Column      | Type      |
| ----------- | --------- |
| id          | bigint    |
| name        | string    |
| description | text      |
| created_at  | timestamp |
| updated_at  | timestamp |

### Products Table

| Column      | Type        |
| ----------- | ----------- |
| id          | bigint      |
| name        | string      |
| description | text        |
| price       | decimal     |
| stock       | integer     |
| category_id | foreign key |
| created_at  | timestamp   |
| updated_at  | timestamp   |

---

## Usage Flow

1. Create one or more **Categories**
2. Add **Products** linked to a category
3. View category‑wise products
4. Update or delete categories and products
5. Test full CRUD lifecycle

---

## Common Issues & Solutions

**CORS Error**

* Configure CORS for `http://localhost:3000` in Laravel

**Database Connection Error**

* Verify `.env` credentials
* Ensure MySQL service is running

**API Not Responding**

* Check Laravel server port
* Verify Axios base URL

---

## Screenshots

### Dashboard

<img width="1638" height="714" alt="image" src="https://github.com/user-attachments/assets/c9f8c84e-2a98-4b80-b1b5-1115ecb775d5" />

### Categories List

<img width="1425" height="969" alt="image" src="https://github.com/user-attachments/assets/cd25c40a-a4d3-4026-8870-de82d83019c6" />

### Add Category

<img width="1372" height="667" alt="image" src="https://github.com/user-attachments/assets/409b6e94-d7ce-4e2f-9946-51f085677d2f" />

### Products List

<img width="1456" height="929" alt="image" src="https://github.com/user-attachments/assets/1313defd-d62f-4394-9b9a-781ce7b4f3af" />

### Add Product

<img width="1404" height="964" alt="image" src="https://github.com/user-attachments/assets/24a3b92a-f37a-466a-8951-ddb7616b1c58" />

---

## Learning Outcomes

* Understand Master–Detail relationships
* Build REST APIs using Laravel
* Consume APIs using React
* Handle forms and validation
* Structure scalable full‑stack projects

---

