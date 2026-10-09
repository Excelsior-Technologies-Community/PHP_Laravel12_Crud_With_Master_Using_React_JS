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

    /* Dashboard & Statistics */
    Route::get('/dashboard', [ProductController::class, 'dashboard']);
    Route::get('/products/statistics', [ProductController::class, 'statistics']);
    Route::get('/products-low-stock', [ProductController::class, 'lowStock']);
    Route::get('/categories/valuation', [ProductController::class, 'categoryAssetValuation']);

    /* Bulk Actions & CSV Import */
    Route::post('/products/bulk', [ProductController::class, 'bulkAction']);
    Route::post('/products/import-csv', [ProductController::class, 'importCsv']);
    Route::get('/inventory/audit-logs', [ProductController::class, 'inventoryAuditLogs']);

    /* Master-Detail Resources */
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
});