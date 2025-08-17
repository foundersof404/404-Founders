<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\GalleryItemController;

// Public routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/gallery', [GalleryItemController::class, 'index']);

// Auth routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/verify', [AuthController::class, 'verify']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Job routes
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

    // Gallery routes
    Route::get('/gallery/my-items', [GalleryItemController::class, 'userItems']);
    Route::post('/gallery', [GalleryItemController::class, 'store']);
    Route::put('/gallery/{item}/status', [GalleryItemController::class, 'updateStatus']);
    Route::delete('/gallery/{item}', [GalleryItemController::class, 'destroy']);
}); 