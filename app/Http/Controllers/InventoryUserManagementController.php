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
    // Fetch the employee data from the database
    $employee = Employee::findOrFail($id);

    // Create a new PHPWord object
    $phpWord = new PhpWord();

    // Add a new section
    $section = $phpWord->addSection();
    
    // Add title
    $section->addText('ASSET ACCOUNTABILITY RECORD', array('bold' => true, 'size' => 16, 'align' => 'center'));
    $section->addText('Mitsubishi Motors Philippines Corp.', array('bold' => true, 'size' => 12, 'align' => 'center'));
    $section->addTextBreak(1); // Blank line

    // Add the "FROM" and "TO" table structure
    $tableStyle = array(
        'borderColor' => '000000',
        'borderSize' => 6,
        'cellMargin' => 50,
        'alignment' => 'center',
        'width' => 100
    );
    
    // Add the table to the section with style
    $table = $section->addTable($tableStyle);

    // Add the "FROM" and "TO" sections in merged format
    $table->addRow();
    $table->addCell(6000)->addText('FROM:', array('bold' => true, 'size' => 12));
    $table->addCell(6000)->addText('', array('bold' => true, 'size' => 12));
    $table->addCell(6000)->addText('TO:', array('bold' => true, 'size' => 12));
    $table->addCell(6000)->addText('', array('bold' => true, 'size' => 12));
    
    // Employee name and number (FROM / TO)
    $table->addRow();
    $table->addCell(3000)->addText('NAME OF ASSIGNEE:');
    $table->addCell(3000)->addText('EMPLOYEE NO:');
    $cell = $table->addCell(6000);
    $cell->addText('NAME OF ASSIGNEE: ' . $employee->first_name . ' ' . $employee->middle_initial . ' ' . $employee->last_name);
    $cell = $table->addCell(6000);
    $cell->addText('EMPLOYEE NO: ' . $employee->employee_number);

    $table->addRow();
    $table->addCell(3000)->addText('DEPT/SECTION:');
    $table->addCell(3000)->addText('LOCATION:');
    $cell = $table->addCell(6000);
    $cell->addText('DEPT/SECTION: ' . $employee->division_department);
    $cell = $table->addCell(6000);
    $cell->addText('LOCATION: BGC');  // Static value for location

    
    // Add a blank line after the table
    $section->addTextBreak(1);

    // Add the "TRANSACTION TYPE" table
    $transactionTypeTable = $section->addTable($tableStyle);
    
    // Add the "TRANSACTION TYPE" header row
    $transactionTypeTable->addRow();
    $transactionTypeTable->addCell(12000)->addText('TRANSACTION TYPE:', array('bold' => true, 'size' => 12, 'underline' => true));

    // Add the checkboxes for transaction types
    $transactionTypeTable->addRow();
    $transactionTypeTable->addCell(12000)->addText('[] EMPLOYEE TRANSFER' . ' ' . '[] EMPLOYEE SEPARATION' . ' ' . '[] OEFF ACQUISITION' . ' ' . '[] OEFF DISPOSAL');

    // Add "ASSET DETAILS" section for asset tags, etc.
    $section->addText('ASSET DETAILS:', array('bold' => true));
    
    // Static data for Asset Example (Replace with real dynamic values)
    $section->addText('Asset Tag: N/A'); // Replace with actual asset tag data
    $section->addText('Name of Asset: Laptop'); // Replace with actual asset data
    $section->addText('Brand/Model/Serial #: HP EliteBook 850 G7 / ABC123456'); // Replace with actual asset data
    $section->addText('Remarks/Condition: New'); // Replace with actual remarks data

    // Save the generated file
    $outputPath = storage_path('app/generated/aar_' . $employee->employee_number . '.docx');
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


}
