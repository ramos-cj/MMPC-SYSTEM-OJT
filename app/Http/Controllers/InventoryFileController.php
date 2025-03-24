<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\YourImportClass;
use App\Exports\EmployeeExport;
use App\Exports\DeviceExport;
use App\Exports\DeviceAssignmentExport;
use App\Models\FileLog;
use Maatwebsite\Excel\Excel as ExcelType;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class InventoryFileController extends Controller
{
    public function importFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,pdf'
        ]);

        $file = $request->file('file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('private/public/imported-files', $filename);

        try {
            if ($file->getClientOriginalExtension() === 'xlsx') {
                Excel::import(new YourImportClass, $file);
            }

            FileLog::create([
                'file_name' => $filename,
                'action' => 'Import',
            ]);

            return response()->json(['success' => true, 'message' => 'File imported successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error importing file.', 'error' => $e->getMessage()]);
        }
    }

    public function exportEmployees()
    {
    return Excel::download(new EmployeeExport, 'EmployeesData.xlsx');
    }

    public function exportDevices()
    {
    return Excel::download(new DeviceExport, 'DevicesData.xlsx');
    }
    public function exportDeviceAssignments()
    {
    return Excel::download(new DeviceAssignmentExport, 'DeviceAssignmentsData.xlsx');
    }

    public function exportFile(Request $request)
{
    $selectedData = $request->input('selectedData');
    $filename = 'ExportedData_' . time() . '.xlsx';

    $exportClasses = [
        'Employees' => new EmployeeExport(),
        'Devices' => new DeviceExport(),
        'DeviceAssignments' => new DeviceAssignmentExport()
    ];

    $exports = [];
    $sheetNames = [];

    foreach ($selectedData as $dataType) {
        if (isset($exportClasses[$dataType])) {
            $exports[] = $exportClasses[$dataType];
            $sheetNames[] = $dataType;
        }
    }

    if (empty($exports)) {
        return response()->json(['success' => false, 'message' => 'No data selected for export.']);
    }

    $multiExport = new class($exports, $sheetNames) implements WithMultipleSheets {
        use Exportable;

        private $exports;
        private $sheetNames;

        public function __construct($exports, $sheetNames)
        {
            $this->exports = $exports;
            $this->sheetNames = $sheetNames;
        }

        public function sheets(): array
        {
            $sheets = [];
            foreach ($this->exports as $index => $export) {
                $sheets[] = new class($export, $this->sheetNames[$index]) implements FromCollection, WithHeadings {
                    private $export;
                    private $sheetName;

                    public function __construct($export, $sheetName)
                    {
                        $this->export = $export;
                        $this->sheetName = $sheetName;
                    }

                    public function collection()
                    {
                        return $this->export->collection();
                    }

                    public function headings(): array
                    {
                        return $this->export->headings();
                    }
                };
            }
            return $sheets;
        }
    };

    FileLog::create([
        'file_name' => $filename,
        'action' => 'Export',
    ]);

    return Excel::download($multiExport, $filename);
}

    public function getLogs()
    {
        $logs = FileLog::all();
        return response()->json($logs);
    }
}
