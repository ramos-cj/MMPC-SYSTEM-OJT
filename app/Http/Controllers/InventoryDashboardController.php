<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\DeviceAssignment;
use App\Models\DisposedDevice;
use App\Models\Employee;
use App\Models\FileLog;
use App\Models\ImportedFile;
use Illuminate\Support\Facades\DB;

class InventoryDashboardController extends Controller
{
    public function getStats()
{
    $totalEmployees = Employee::count();
    $totalLaptops = Device::where('classification', 'Laptop')->count();
    // Remove tablets count or keep it but not used on frontend
    $totalPhones = Device::where('classification', 'Phone')->count();

    // Count disposed devices instead of tablets
    $totalDisposedDevices = DisposedDevice::count();

    $totalAccessories = DeviceAssignment::whereNotNull('accessories')
        ->where('accessories', '!=', 'N/A')
        ->pluck('accessories')
        ->flatMap(function ($accessory) {
            return array_filter(array_map('trim', explode(',', $accessory)));
        })
        ->count();      
    $totalGoodCondition = Device::where('condition', 'Good')->count();
    $totalBadCondition = Device::where('condition', 'Bad')->count();
    $totalImportedFiles = FileLog::count();

    $latestEmployeeUpdate = Employee::latest('updated_at')->value('updated_at');
    $latestDeviceUpdate = Device::latest('updated_at')->value('updated_at');
    $latestUpdate = max($latestEmployeeUpdate, $latestDeviceUpdate);

    $lastInventoryCount = Device::max('last_inventory_count'); // assuming 'last_inventory_count' is a date string

    $assetSummary = Device::selectRaw(
        'classification, COUNT(*) as total, 
        SUM(CASE WHEN with_warranty = "No" THEN 1 ELSE 0 END) as warrantyExpired'
    )->groupBy('classification')->get();

    return response()->json([
        'totalEmployees' => $totalEmployees,
        'totalLaptops' => $totalLaptops,
        'totalDisposedDevices' => $totalDisposedDevices, // new field
        'totalPhones' => $totalPhones,
        'totalAccessories' => $totalAccessories,
        'totalGoodCondition' => $totalGoodCondition,
        'totalBadCondition' => $totalBadCondition,
        'totalImportedFiles' => $totalImportedFiles,
        'latestUpdate' => $latestUpdate ? $latestUpdate->toDateTimeString() : "No recent updates",
        'lastInventoryCount' => $lastInventoryCount ? $lastInventoryCount : null,  // Add this line
        'assetSummary' => $assetSummary
    ]);
    }
}
