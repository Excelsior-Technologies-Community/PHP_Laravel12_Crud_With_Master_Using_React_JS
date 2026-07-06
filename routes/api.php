<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [ProductController::class, 'dashboard']);

    /*
    |--------------------------------------------------------------------------
    | Product Statistics
    |--------------------------------------------------------------------------
    */

    Route::get('/products/statistics', [ProductController::class, 'statistics']);

    /*
    |--------------------------------------------------------------------------
    | Product APIs
    |--------------------------------------------------------------------------
    */

    Route::get('/products-low-stock', [ProductController::class, 'lowStock']);

    Route::apiResource('products', ProductController::class);

    /*
    |--------------------------------------------------------------------------
    | Category APIs
    |--------------------------------------------------------------------------
    */

    Route::apiResource('categories', CategoryController::class);
});