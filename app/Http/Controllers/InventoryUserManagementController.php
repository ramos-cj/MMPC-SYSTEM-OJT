<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Style\Table;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use TCPDF;

class InventoryUserManagementController extends Controller
{
    // Fetch employee list and return JSON
    // Fetch employee list and return JSON with assigned device computer_name
    public function list()
    {
        $employees = Employee::leftJoin('device_assignments', 'employees.id', '=', 'device_assignments.employee_id')
                            ->leftJoin('devices', 'device_assignments.device_id', '=', 'devices.id')
                            ->select(
                                'employees.id as employee_id',
                                'employees.employee_number',
                                'employees.first_name',
                                'employees.middle_initial',
                                'employees.last_name',
                                'employees.position',
                                'employees.division_department',
                                'employees.division_code',
                                'employees.department_code',
                                'employees.section_code',
                                'devices.brand_model',
                                'devices.computer_name',
                                DB::raw('IFNULL(employees.employee_type, "N/A") as employee_type')
                            )
                            ->orderBy('employees.id', 'asc')
                            ->get();
    
                            $groupedEmployees = $employees->groupBy('employee_id')->map(function ($devices, $employeeId) {
                                $employee = $devices->first();
                            
                                $deviceList = $devices->map(function ($device) {
                                    return $device->brand_model && $device->computer_name
                                        ? "{$device->brand_model} ({$device->computer_name})"
                                        : null;
                                })->filter()->all();
                            
                                return [
                                    'employee_id' => $employee->employee_id,
                                    'employee_number' => $employee->employee_number,
                                    'first_name' => $employee->first_name,
                                    'middle_initial' => $employee->middle_initial,
                                    'last_name' => $employee->last_name,
                                    'position' => $employee->position,
                                    'division_department' => $employee->division_department,
                                    'division_code' => $employee->division_code,
                                    'department_code' => $employee->department_code,
                                    'section_code' => $employee->section_code,
                                    'assigned_devices' => $deviceList,
                                    'employee_type' => $this->formatEmployeeType($employee->employee_type)
                                ];
                            })->values();                            
    
        return response()->json($groupedEmployees);
    }
    
    private function formatEmployeeType($type)
{
    $type = strtolower(trim($type));

    return match($type) {
        'regular employee' => 'Regular Employee',
        'third-party', 'third party' => 'Third-Party',
        'hourly personnel' => 'Hourly Personnel',
        'japanese executives' => 'Japanese Executives',
        default => 'N/A'
    };
}   
    
    public function getEmployee($id)
    {
    $employee = Employee::findOrFail($id);
    return response()->json($employee);
    }

    // Store new employee
    public function getDivisions()
    {
        $divisions = Employee::distinct()->pluck('division_department');
        return response()->json($divisions);
    }

    public function store(Request $request)
{
    $request->validate([
        'employee_number' => 'required|string|unique:employees',
        'first_name' => 'required|string',
        'middle_initial' => 'nullable|string|max:1',
        'last_name' => 'required|string',
        'division_department' => 'required|string',
        'position' => 'required|string',
        'section_code' => 'required|string',
        'division_code' => 'required|string',
        'department_code' => 'required|string',
        'employee_type' => 'required|string',
    ]);

    $employee = Employee::create($request->all());

    return redirect()->route('inventory-userlist')->with([
        'success' => true,
        'message' => 'Employee saved successfully!',
        'employee' => $employee
    ]);
    }



    // ✅ Update employee details
    public function update(Request $request, $id)
{
    $employee = Employee::findOrFail($id);

    $request->validate([
        'employee_number' => 'required|string|unique:employees,employee_number,' . $id,
        'first_name' => 'required|string',
        'middle_initial' => 'nullable|string|max:3',
        'last_name' => 'required|string',
        'division_department' => 'required|string',
        'position' => 'required|string',
        'section_code' => 'required|string',
        'division_code' => 'required|string',
        'department_code' => 'required|string',
        'employee_type' => 'required|string',
    ]);

    $employee->update(array_merge($request->all(), [
        'employee_type' => $request->employee_type ?? 'N/A',
    ]));
    

    return response()->json($employee);
}


// ✅ Delete employees
    public function delete($id)
    {
    $employee = Employee::findOrFail($id);
    $employee->delete();

    return response()->json(['message' => 'Employee deleted successfully']);
    }

     // Generate the AAR in a table format
     public function generateAAR($id)
{
    // Fetch the employee data along with the device assignments and the associated device remarks
    $employee = Employee::with(['deviceAssignments.device'])->findOrFail($id);

    // Create a new PHPWord object
    $phpWord = new PhpWord();

    // Add a new section
    $section = $phpWord->addSection();

    // Add the company name and other header details
    $section->addImage(public_path('../../../mmpc-system-ojt (with backend)/MMPC-SYSTEM-OJT/resources/js/assets/mmpc-logo1.png'), [
        'width' => 60,
        'height' => 50,
        'align' => 'center'
    ]);

    $section->addText('ASSET ACCOUNTABILITY RECORD', ['bold' => true, 'size' => 16], ['alignment' => 'center']);
    $section->addText('Mitsubishi Motors Philippines Corp.', ['bold' => true, 'size' => 12], ['alignment' => 'center']);
    
     // Generate the unique control number based on the employee's ID
     $controlNo = str_pad($employee->id, 4, '0', STR_PAD_LEFT);  // Ensure it's a 4-digit number, adjust padding if needed
     $section->addText('Control No. ' . $controlNo, ['bold' => true, 'size' => 12], ['alignment' => 'center']);

    $section->addTextBreak(1);  // Adds a line break after the control number section

    // 2ND to 4TH COLUMNS: FROM/TO + Employee Info
    $table = $section->addTable(['borderColor' => '000000', 'borderSize' => 6, 'cellMargin' => 50]);

    // Add the "FROM" and "TO" table structure
    $tableStyle = array(
        'borderColor' => '000000',
        'borderSize' => 6,
        'cellMargin' => 50,
        'alignment' => 'center'
    );

    // Add the table to the section with style
    $table = $section->addTable($tableStyle);

    // Add the "FROM" section
    $table->addRow();
    $table->addCell(3000)->addText('FROM:', array('bold' => true, 'size' => 10, 'alignment' => 'center'));
    $table->addCell(3000)->addText('', array('bold' => true, 'size' => 10));
    $table->addCell(3000)->addText('TO:', array('bold' => true, 'size' => 10, 'alignment' => 'center'));
    $table->addCell(3000)->addText('', array('bold' => true, 'size' => 10));

    // Employee name and number (FROM / TO)
    $table->addRow();
    $table->addCell(3000)->addText('NAME OF ASSIGNEE:');
    $table->addCell(3000)->addText('EMPLOYEE NO:');
    $cell = $table->addCell(3000);
    $cell->addText('NAME OF ASSIGNEE: ' . $employee->first_name . ' ' . $employee->last_name);
    $cell = $table->addCell(3000);
    $cell->addText('EMPLOYEE NO: ' . $employee->employee_number);

    $table->addRow();
    $table->addCell(3000)->addText('DEPT/SECTION:');
    $table->addCell(3000)->addText('LOCATION:');
    $cell = $table->addCell(3000);
    $cell->addText('DEPT/SECTION: ' . $employee->division_department);
    $cell = $table->addCell(3000);
    $cell->addText('LOCATION: BGC');  // Static value for location

    // Add a blank line after the table
    $section->addTextBreak(1);

    // Add the "TRANSACTION TYPE" table
    $transactionTypeTable = $section->addTable($tableStyle);

    // Add the "TRANSACTION TYPE" header row
    $transactionTypeTable->addRow();
    $transactionTypeTable->addCell(12000)->addText('TRANSACTION TYPE:', array('bold' => true, 'size' => 10, 'underline' => true));

    // Add the checkboxes for transaction types
    $transactionTypeTable->addRow();
    $transactionTypeTable->addCell(12000)->addText('⬜ EMPLOYEE TRANSFER' . ' ' . '⬜ EMPLOYEE SEPARATION' . ' ' . '⬜ OEFF ACQUISITION' . ' ' . '⬜ OEFF DISPOSAL');

    // Add a blank line after the transaction table
    $section->addTextBreak(1);

    // Add "ASSET DETAILS" section for asset tags, etc.
    $section->addText('ASSET DETAILS:', array('bold' => true));

    // Asset Details Table Style
    $assetDetailsTableStyle = array(
        'borderColor' => '000000',
        'borderSize' => 6,
        'alignment' => 'center',
        'width' => 100
    );

    // Add the asset details table to the section
    $assetDetailsTable = $section->addTable($assetDetailsTableStyle);

    // Add the header row for the asset details table
    $assetDetailsTable->addRow();
    $assetDetailsTable->addCell(4000)->addText('ASSET TAG NO.', array('bold' => true, 'size' => 9, 'alignment' => 'center'));
    $assetDetailsTable->addCell(2000)->addText('NAME OF OEFF', array('bold' => true, 'size' => 9, 'alignment' => 'center'));
    $assetDetailsTable->addCell(4000)->addText('BRAND/MODEL/SERIAL #', array('bold' => true, 'size' => 9));
    $assetDetailsTable->addCell(4000)->addText('REMARKS/CONDITION', array('bold' => true, 'size' => 9));

    // Iterate over each device and add the details into the asset details table
    foreach ($employee->deviceAssignments as $assignment) {
        $device = $assignment->device;

        // Handle asset details
        $assetTag = $device->tag_no ?? 'N/A';
        $nameOfOeff = $this->getNameOfOeff($device->classification);
        $brandModel = $device->brand_model . ' / ' . $device->serial_number;
        $remarks = $device->remarks ?? 'N/A';
        $deviceRemarks = $assignment->device_remarks ?? 'N/A'; // Fetching from device_assignments
        $combinedRemarks = $remarks . ' | ' . $deviceRemarks; // Combine remarks

        // Add asset data to the asset details table
        $assetDetailsTable->addRow();
        $assetDetailsTable->addCell(4000)->addText($assetTag);
        $assetDetailsTable->addCell(4000)->addText($nameOfOeff);
        $assetDetailsTable->addCell(4000)->addText($brandModel);
        $assetDetailsTable->addCell(4000)->addText($combinedRemarks);
    }

    // Add a blank line after the asset details table
    $section->addTextBreak(1);

    // Add "TURNED OVER BY, RECEIVED BY AND APPROVED BY" table
    $turnoverTableStyle = array(
        'borderColor' => '000000',
        'borderSize' => 6,
        'cellMargin' => 50,
        'alignment' => 'center',
        'width' => 100
    );

    // Add the table to the section
    $turnoverTable = $section->addTable($turnoverTableStyle);

    // Add the row for Turned Over By, Received By, and Approved By (in one line)
    $turnoverTable->addRow();
    $turnoverTable->addCell(3000)->addText('TURNED OVER BY:', array('bold' => true, 'size' => 9));
    $turnoverTable->addCell(1500)->addText('DATE:', array('bold' => true, 'size' => 9));
    $turnoverTable->addCell(3000)->addText('RECEIVED BY:', array('bold' => true, 'size' => 9));
    $turnoverTable->addCell(1500)->addText('DATE:', array('bold' => true, 'size' => 8));
    $turnoverTable->addCell(3000)->addText('APPROVED BY:', array('bold' => true, 'size' => 9));

    // Add the data in one line for each field
    $turnoverTable->addRow();
    $turnoverTable->addCell(3000)->addText('Neil M. Mariano', array('size' => 10));
    $turnoverTable->addCell(1500)->addText('', array('size' => 10));
    $turnoverTable->addCell(3000)->addText($employee->first_name . ' ' . $employee->last_name, array('size' => 9));  // Received By
    $turnoverTable->addCell(1500)->addText('', array('size' => 10));
    $turnoverTable->addCell(3000)->addText('Department Head of Receiver', array('size' => 9));

    // Add a blank line after the asset details table
    $section->addTextBreak(1);

    // Add "ASSET DETAILS" section for asset tags, etc.
    $section->addText('Please use additional sheets, if necessary.', array('bold' => true));

    // Save the generated file
    $fullName = str_replace(' ', '_', $employee->first_name . '_' . $employee->last_name);
    $fileName = 'aar_' . $fullName . '.docx';
    $outputPath = storage_path('app/generated/' . $fileName);
    $phpWord->save($outputPath);

    // Return the file as a download response
    return response()->download($outputPath)->deleteFileAfterSend(true);
}

     

private function getNameOfOeff($classification)
{
    // Map the classification to name_of_oeff
    return match(strtolower(trim($classification))) {
        'laptop' => 'Laptop',
        'phone' => 'Mobile Phone',
        'tablet' => 'Tablet',
        'desktop' => 'Desktop Computer',
        'printer' => 'Printer',
        'other' => 'Other Equipment',
        default => 'N/A'
    };
}


public function createTemplatesFolder()
{
    // Define the path to the templates folder
    $templatesPath = resource_path('templates');

    // Check if the folder exists, if not create it
    if (!File::exists($templatesPath)) {
        // Create the directory with 775 permissions
        File::makeDirectory($templatesPath, 0775, true);

        Log::info('Templates folder created at: ' . $templatesPath);
        return response()->json(['message' => 'Templates folder created successfully.'], 200);
    }

    return response()->json(['message' => 'Templates folder already exists.'], 200);
}

public function uploadAAR(Request $request, $id)
{
    $employee = Employee::findOrFail($id);
    if (!$request->hasFile('aar')) return response()->json(['error' => 'No file uploaded'], 400);

    $file = $request->file('aar');
    $extension = $file->getClientOriginalExtension();
    $fileName = 'aar_' . str_replace(' ', '_', $employee->first_name . '_' . $employee->last_name) . '.' . $extension;
    $path = $file->storeAs('public/aar_files', $fileName);

    return response()->json(['message' => 'AAR uploaded successfully', 'path' => $path]);
}

public function viewAAR($id)
{
    $employee = Employee::findOrFail($id);
    $basePath = storage_path('app/private/public/aar_files');
    $baseName = 'aar_' . str_replace(' ', '_', $employee->first_name . '_' . $employee->last_name);

    $extensions = ['docx', 'pdf', 'jpg', 'jpeg', 'png', 'webp'];
    foreach ($extensions as $ext) {
        $filePath = "$basePath/{$baseName}.$ext";
        if (file_exists($filePath)) {
            $mime = mime_content_type($filePath);

            if (str_starts_with($mime, 'image/')) {
                return response()->file($filePath);
            }

            return response()->download($filePath);
        }
    }

    return response()->json(['error' => 'No uploaded AAR found for this employee.'], 404);
}

}
