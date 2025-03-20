<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\YourImportClass;
use App\Exports\YourExportClass; 
use App\Models\FileLog; 

class InventoryFileController extends Controller
{
    public function importFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,xlsx'
        ]);

        $file = $request->file('file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('private/public/imported-files', $filename);

        try {
            if ($file->getClientOriginalExtension() === 'xlsx') {
                Excel::import(new YourImportClass, $file); // ✅ Correct Excel import handling
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

    public function exportFile(Request $request)
    {
        $request->validate([
            'template_name' => 'required',
            'export_format' => 'required|in:pdf,xlsx',
        ]);

        $filename = $request->template_name . '.' . $request->export_format;

        try {
            if ($request->export_format === 'xlsx') {
                return Excel::download(new YourExportClass, $filename);
            } 
            // Handle PDF export if required

            FileLog::create([
                'file_name' => $filename,
                'action' => 'Export',
            ]);

            return response()->json(['success' => true, 'message' => 'File exported successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error exporting file.', 'error' => $e->getMessage()]);
        }
    }

    public function getLogs()
    {
        $logs = FileLog::all();
        return response()->json($logs);
    }
}
