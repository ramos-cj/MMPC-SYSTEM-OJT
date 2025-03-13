<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\Employee;
use App\Models\ImportedFile;
use Illuminate\Support\Facades\DB;

class InventoryDashboardController extends Controller
{
    public function getStats()
    {
        $totalEmployees = Employee::count();
        $totalLaptops = Device::where('classification', 'Laptop')->count();
        $totalTablets = Device::where('classification', 'Tablet')->count();
        $totalPhones = Device::where('classification', 'Phone')->count();
        $totalAccessories = Device::whereNotNull('accessories')->count();
        $totalGoodCondition = Device::where('condition', 'Good')->count();
        $totalBadCondition = Device::where('condition', 'Bad')->count();
        //$totalImportedFiles = ImportedFile::count();

        // Fetch latest update date
        $latestEmployeeUpdate = Employee::latest('updated_at')->value('updated_at');
        $latestDeviceUpdate = Device::latest('updated_at')->value('updated_at');
        $latestUpdate = max($latestEmployeeUpdate, $latestDeviceUpdate);

        // Fetch warranty summary
        $assetSummary = Device::selectRaw(
            'classification, COUNT(*) as total, 
            SUM(CASE WHEN with_warranty = "No" THEN 1 ELSE 0 END) as warrantyExpired'
        )->groupBy('classification')->get();

        return response()->json([
            'totalEmployees' => $totalEmployees,
            'totalLaptops' => $totalLaptops,
            'totalTablets' => $totalTablets,
            'totalPhones' => $totalPhones,
            'totalAccessories' => $totalAccessories,
            'totalGoodCondition' => $totalGoodCondition,
            'totalBadCondition' => $totalBadCondition,
            //'totalImportedFiles' => $totalImportedFiles,
            'latestUpdate' => $latestUpdate ? $latestUpdate->toDateTimeString() : "No recent updates",
            'assetSummary' => $assetSummary
        ]);
    }
}
