<?php

use App\Http\Controllers\Auth\InventoryAuthController;
use App\Http\Controllers\Auth\ExitClearanceAuthController;
use App\Http\Controllers\InventoryDashboardController;
use App\Http\Controllers\InventoryDeviceManagementController;
use App\Http\Controllers\InventoryUserManagementController;
use App\Http\Controllers\InventoryDeviceAssignmentController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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

    Route::get('/inventory-dashboard/stats', [InventoryDashboardController::class, 'getStats']);
    

    Route::get('/inventory-userlist', function () {
        return Inertia::render('inventory-page/InventoryUserList');
    })->name('inventory-userlist');

    Route::get('/inventory-devicelist', function () {
        return Inertia::render('inventory-page/InventoryDeviceList');
    })->name('inventory-devicelist');

    Route::get('/inventory-usermanagement', function () {
        return Inertia::render('inventory-page/InventoryUserManagement');
    })->name('inventory-usermanagement');


    Route::get('/inventory-user-management/list', [InventoryUserManagementController::class, 'list']);
    Route::post('/inventory-user-management/save', [InventoryUserManagementController::class, 'store']);

    Route::get('/inventory-devicemanagement', function () {
        return Inertia::render('inventory-page/InventoryDeviceManagement');
    })->name('inventory-devicemanagement');

    Route::post('/inventory-device-management/save', [InventoryDeviceManagementController::class, 'store']);

    Route::get('/inventory-deviceassignment', function () {
        return Inertia::render('inventory-page/InventoryDeviceAssignment');
    })->name('inventory-deviceassignment');

    Route::get('/inventory-device-assignment/available-devices', [InventoryDeviceAssignmentController::class, 'getAvailableDevices']);
    Route::get('/inventory-device-assignment/assigned-devices', [InventoryDeviceAssignmentController::class, 'getAssignedDevices']);
    Route::post('/inventory-device-assignment/assign', [InventoryDeviceAssignmentController::class, 'assignDevice']);
    Route::post('/inventory-device-assignment/remove', [InventoryDeviceAssignmentController::class, 'removeDevice']);
    Route::post('/inventory-device-assignment/transfer', [InventoryDeviceAssignmentController::class, 'transferDevice']);

    Route::get('/inventory-repairmanagement', function () {
        return Inertia::render('inventory-page/InventoryRepairManagement');
    })->name('inventory-repairmanagement');

    Route::get('/inventory-importfiles', function () {
        return Inertia::render('inventory-page/InventoryImportFiles');
    })->name('inventory-importfiles');

    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/'); // Redirect to welcome page after logout
    })->name('logout');
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