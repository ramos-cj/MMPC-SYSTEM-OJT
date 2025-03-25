<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;

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
                            'devices.general_name',
                            'devices.model',
                            'devices.computer_name'
                        )
                        ->orderBy('employees.id', 'asc')
                        ->get();

    $groupedEmployees = $employees->groupBy('employee_id')->map(function ($devices, $employeeId) {
        $employee = $devices->first();
        
        $deviceList = $devices->map(function ($device) {
            return $device->general_name && $device->model && $device->computer_name 
                ? "{$device->general_name} {$device->model} ({$device->computer_name})"
                : null;
        })->filter()->all(); // Filter out null entries

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
            'assigned_devices' => $deviceList
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
        ]);

        Employee::create($request->all());

        return redirect()->route('inventory-userlist')->with('success', 'User registered successfully!');
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
    ]);

    $employee->update($request->all());

    return response()->json(['message' => 'Employee updated successfully']);
    }

// ✅ Delete employees
    public function delete($id)
    {
    $employee = Employee::findOrFail($id);
    $employee->delete();

    return response()->json(['message' => 'Employee deleted successfully']);
    }

}
