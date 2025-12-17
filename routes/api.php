<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;

Route::middleware('api')->group(function () {
    // Category Routes
    Route::apiResource('categories', CategoryController::class);
    
    // Product Routes
    Route::apiResource('products', ProductController::class);
});