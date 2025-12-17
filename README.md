## PHP_Laravel12_Crud_With_Master_Using_React.JS

A complete full-stack CRUD application with a Laravel REST API backend and React.js frontend, demonstrating Master–Detail relationships between Categories and Products.

Project Overview

This project demonstrates a multi-CRUD application with:

Backend: Laravel RESTful API

Frontend: React.js with Material-UI

Database: MySQL with relationships

Features: Full CRUD for Categories (Master) and Products (Detail)

Quick Start
Prerequisites

PHP 8.0+

Composer

Node.js 14+

npm or yarn

MySQL

Installation Steps
1. Clone Repository
git clone https://github.com/yourusername/laravel-react-crud.git
cd laravel-react-crud
2. Backend Setup (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate

Update .env with database credentials, then:

php artisan migrate
php artisan db:seed
php artisan serve --port=8000
3. Frontend Setup (React)
cd frontend
npm install
npm start
Project Structure

Backend

backend/
├── app/Http/Controllers/API
├── app/Models
├── database/migrations
├── database/seeders
└── routes/api.php

Frontend

frontend/
├── src/components
├── src/services
├── src/App.js
└── src/index.js
Features

Backend

RESTful API with Laravel

Category & Product CRUD

One-to-Many relationship

Validation & error handling

Database seeding

Frontend

Material-UI design

React Router navigation

Formik + Yup validation

Axios API integration

Responsive UI

API Endpoints

Categories

GET /api/categories

POST /api/categories

GET /api/categories/{id}

PUT /api/categories/{id}

DELETE /api/categories/{id}

Products

GET /api/products

POST /api/products

GET /api/products/{id}

PUT /api/products/{id}

DELETE /api/products/{id}

Database Schema

Categories Table

id, name, description, timestamps

Products Table

id, name, description, price, stock, category_id, timestamps
Usage Flow

Add categories

Add products linked to categories

Update or delete records

Test complete CRUD lifecycle

Troubleshooting

Configure CORS for http://localhost:3000

Verify database credentials

Change ports if already in use

License

This project is licensed under the MIT License.

Final Note

This repository is ideal for:

MCA / BCA final projects

Interview preparation

Full‑stack Laravel + React learning

If you find this project helpful, consider giving it a ⭐ on GitHub.
