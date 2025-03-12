<?php

use App\Http\Controllers\Auth\InventoryAuthController;
use App\Http\Controllers\Auth\ExitClearanceAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ✅ Inventory System Routes
Route::get('/inventory-login', function () {
    return Inertia::render('auth/InventoryLogin');
})->name('inventory-login-page'); 

Route::post('/inventory-login', [InventoryAuthController::class, 'login'])->name('inventory-login'); 
Route::post('/inventory-register', [InventoryAuthController::class, 'register'])->name('inventory-register');

// ✅ Inventory Dashboard Route (with Authentication Middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory-dashboard', function () {
        return Inertia::render('dashboard/InventoryDashboard');
    })->name('inventory-dashboard');

    Route::get('/inventory-userlist', function () {
        return Inertia::render('inventory-page/InventoryUserList');
    })->name('inventory-userlist');

    Route::get('/inventory-usermanagement', function () {
        return Inertia::render('inventory-page/InventoryUserManagement');
    })->name('inventory-usermanagement');
});

// ✅ Exit Clearance System Routes
Route::get('/exitclearance-login', function () {
    return Inertia::render('auth/ExitClearanceLogin');
})->name('exitclearance-login-page'); 

Route::post('/exitclearance-login', [ExitClearanceAuthController::class, 'login'])->name('exitclearance-login');
Route::post('/exitclearance-register', [ExitClearanceAuthController::class, 'register'])->name('exitclearance-register');

// ✅ Exit Clearance Dashboard Route (with Authentication Middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/exitclearance-dashboard', function () {
        return Inertia::render('dashboard/ExitClearanceDashboard');
    })->name('exitclearance-dashboard');
});
