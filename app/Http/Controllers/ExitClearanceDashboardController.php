<?php


namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\FileLog;
use App\Models\IssuedEClearance;
use App\Models\ImportedFile;
use Illuminate\Http\Request;

class ExitClearanceDashboardController extends Controller
{
   public function stats()
{
    try {
        $latestUpdate = IssuedEClearance::latest()->first()?->updated_at;

        $clearanceData = IssuedEClearance::selectRaw("DATE_FORMAT(created_at, '%M') as month")
            ->selectRaw("SUM(CASE WHEN remarks IS NULL THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN remarks = 'Approved' THEN 1 ELSE 0 END) as completed")
            ->groupByRaw("DATE_FORMAT(created_at, '%M')")
            ->orderByRaw("MIN(created_at)")
            ->get()
            ->map(fn ($item) => [
                'month' => $item->month,
                'pending' => (int) $item->pending,
                'completed' => (int) $item->completed,
            ]);

        $departmentData = IssuedEClearance::select('division_department as department')
            ->selectRaw("COUNT(*) as count")
            ->groupBy('division_department')
            ->get()
            ->map(fn ($item) => [
                'department' => $item->department,
                'count' => (int) $item->count,
            ]);

        return response()->json([
            'totalEmployees' => Employee::count(),
            'issuedClearances' => IssuedEClearance::count(),
            'completedClearances' => IssuedEClearance::where('remarks', 'Approved')->count(),
            'totalImportedFiles' => FileLog::count(),
            'latestUpdate' => $latestUpdate,
            'clearanceData' => $clearanceData,
            'departmentData' => $departmentData,
        ]);
    } catch (\Throwable $e) {
        return response()->json(['error' => 'Dashboard error', 'message' => $e->getMessage()], 500);
    }
}

}
