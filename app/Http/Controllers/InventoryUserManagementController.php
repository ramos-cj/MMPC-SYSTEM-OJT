<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

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
                'employee_type' => $employee->employee_type
            ];
        })->values();
    
        return response()->json($groupedEmployees);
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
        'middle_initial' => 'nullable|string|max:1',
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

}
