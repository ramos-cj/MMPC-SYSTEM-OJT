<?php

use App\Http\Controllers\Auth\InventoryAuthController;
use App\Http\Controllers\Auth\ExitClearanceAuthController;
use App\Http\Controllers\ClearanceStatusController;
use App\Http\Controllers\ExitClearanceController;
use App\Http\Controllers\ExitClearanceDashboardController;
use App\Http\Controllers\InventoryDashboardController;
use App\Http\Controllers\InventoryDeviceManagementController;
use App\Http\Controllers\InventoryUserManagementController;
use App\Http\Controllers\InventoryDeviceAssignmentController;
use App\Http\Controllers\InventoryFileController;
use App\Http\Controllers\InventoryRepairManagementController;
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

    Route::get('/devices', [InventoryDeviceManagementController::class, 'getDevices']);
    Route::get('/device-image/{filename}', [InventoryDeviceManagementController::class, 'getDeviceImage'])
    ->where('filename', '.*')
    ->name('device.image');


    Route::get('/inventory-usermanagement', function () {
        return Inertia::render('inventory-page/InventoryUserManagement');
    })->name('inventory-usermanagement');


    Route::get('/inventory-user-management/list', [InventoryUserManagementController::class, 'list']);
    Route::get('/inventory-user-management/get/{id}', [InventoryUserManagementController::class, 'getEmployee']);
    Route::post('/inventory-user-management/save', [InventoryUserManagementController::class, 'store']);
    Route::match(['PUT', 'POST'], '/inventory-user-management/update/{id}', [InventoryUserManagementController::class, 'update']);
    Route::get('/inventory-user-management/print-aar/{id}', [InventoryUserManagementController::class, 'generateAAR']);
    Route::get('/create-templates-folder', [InventoryUserManagementController::class, 'createTemplatesFolder']);

    Route::delete('/inventory-user-management/delete/{id}', [InventoryUserManagementController::class, 'delete']);


    Route::get('/inventory-devicemanagement', function () {
        return Inertia::render('inventory-page/InventoryDeviceManagement');
    })->name('inventory-devicemanagement');

    Route::post('/inventory-devicemanagement/dispose/{id}', [InventoryDeviceManagementController::class, 'disposeDevice']);
    Route::get('/disposed-devices', [InventoryDeviceManagementController::class, 'getDisposedDevices']);
    Route::post('/inventory-devicemanagement/save-disposed', [InventoryDeviceManagementController::class, 'storeDisposed']);


    Route::get('/inventory-devicemanagement/list', [InventoryDeviceManagementController::class, 'list']);
    Route::get('/inventory-devicemanagement/get/{id}', [InventoryDeviceManagementController::class, 'getDevice']);
    Route::post('/inventory-devicemanagement/save', [InventoryDeviceManagementController::class, 'store']);
    Route::delete('/inventory-devicemanagement/delete/{id}', [InventoryDeviceManagementController::class, 'delete']);
    Route::delete('/inventory-deviceassignment/remove-assignment/{device_id}', [InventoryDeviceAssignmentController::class, 'removeAssignment']);

    Route::match(['PUT', 'POST'], '/inventory-devicemanagement/update/{id}', [InventoryDeviceManagementController::class, 'update']);
    Route::post('/inventory-devicemanagement/update/{id}', [InventoryDeviceManagementController::class, 'update']);
    Route::get('/device-images/{filename}', [InventoryDeviceManagementController::class, 'getDeviceImage'])
    ->where('filename', '.*')
    ->name('device.image');

     Route::get('/inventory-disposedlist', function () {
        return Inertia::render('inventory-page/InventoryDisposedList');
    })->name('inventory-disposedlist');


    Route::get('/inventory-deviceassignment', function () {
        return Inertia::render('inventory-page/InventoryDeviceAssignment');
    })->name('inventory-deviceassignment');

    Route::get('/employees', [InventoryDeviceAssignmentController::class, 'getEmployees']);
    Route::get('/available-devices', [InventoryDeviceAssignmentController::class, 'getAvailableDevices']);
    Route::get('/assigned-devices', [InventoryDeviceAssignmentController::class, 'getAssignedDevices']);
    Route::post('/assign-device', [InventoryDeviceAssignmentController::class, 'assignDevice']);
    Route::post('/transfer-device', [InventoryDeviceAssignmentController::class, 'transferDevice']);
    Route::delete('/delete-assignment/{id}', [InventoryDeviceAssignmentController::class, 'deleteAssignment']);
    Route::get('/repair-management/list', [InventoryRepairManagementController::class, 'listBadDevices']);
    Route::post('/repair-management/update/{id}', [InventoryRepairManagementController::class, 'updateDeviceIssues']);

    Route::get('/inventory-repairmanagement', function () {
        return Inertia::render('inventory-page/InventoryRepairManagement');
    })->name('inventory-repairmanagement');

    Route::get('/inventory-importfiles', function () {
        return Inertia::render('inventory-page/InventoryImportFiles');
    })->name('inventory-importfiles');

    Route::post('/inventory/import', [InventoryFileController::class, 'importFile']);
    Route::get('/inventory/file-logs', [InventoryFileController::class, 'getLogs']);
    Route::post('/inventory/export/employees', [InventoryFileController::class, 'exportEmployees']);
    Route::post('/inventory/export/devices', [InventoryFileController::class, 'exportDevices']);
    Route::post('/inventory/export/device-assignments', [InventoryFileController::class, 'exportDeviceAssignments']);
    Route::post('/inventory/export', [InventoryFileController::class, 'exportFile']);
    Route::get('/inventory-user-management/print-aar/{id}', [InventoryUserManagementController::class, 'generateAAR']);
    Route::post('/inventory-user-management/upload-aar/{id}', [InventoryUserManagementController::class, 'uploadAAR']);
    Route::get('/inventory-user-management/view-aar/{id}', [InventoryUserManagementController::class, 'viewAAR']);

    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/');
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

    Route::get('/exit-exitclearance', function () {
        return Inertia::render('exit-page/ExitExitClearance');
    })->name('exit-exitclearance');

    Route::get('/exit-clearancestatus', function () {
        return Inertia::render('exit-page/ExitClearanceStatus');
    })->name('exit-clearancestatus');

    Route::get('/exit-usermanagement', function () {
        return Inertia::render('exit-page/ExitUserManagement');
    })->name('exit-usermanagement');

    Route::get('/exit-importfiles', function () {
        return Inertia::render('exit-page/ExitImportFiles');
    })->name('exit-importfiles');
    Route::get('/exit-userlist', function () {
        return Inertia::render('exit-page/ExitUserList');
    })->name('exit-userlist');

    Route::get('/inventory-user-management/list', [InventoryUserManagementController::class, 'list']);
    Route::get('/inventory-user-management/get/{id}', [InventoryUserManagementController::class, 'getEmployee']);
    Route::post('/inventory-user-management/save', [InventoryUserManagementController::class, 'store']);
    Route::get('/inventory-user-management/divisions', [InventoryUserManagementController::class, 'getDivisions']);

    Route::put('/inventory-user-management/update/{id}', [InventoryUserManagementController::class, 'update']);
    Route::delete('/inventory-user-management/delete/{id}', [InventoryUserManagementController::class, 'delete']);

    Route::post('/exit-clearance/issue/{id}', [ExitClearanceController::class, 'issueExitClearance']);
    Route::get('/exit-clearance/list', [ExitClearanceController::class, 'listIssuedClearances']);
    Route::put('/exit-clearance/update-wiseda/{id}', [ExitClearanceController::class, 'updateWisedaLink']);
    Route::delete('/exit-clearance/delete/{id}', [ExitClearanceController::class, 'deleteIssuedClearance']);
    Route::get('/clearance-status/list', [ClearanceStatusController::class, 'index']);
    Route::put('/clearance-status/approve/{id}', [ClearanceStatusController::class, 'approve']);
    Route::get('/exit-dashboard/stats', [ExitClearanceDashboardController::class, 'stats']);
});