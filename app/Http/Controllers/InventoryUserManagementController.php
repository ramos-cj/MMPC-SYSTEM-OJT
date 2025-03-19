<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;

class InventoryUserManagementController extends Controller
{
    // Fetch employee list and return JSON
    public function list()
    {
        return response()->json(
            Employee::orderBy('id', 'asc')->get() // Sorted by default in ascending order
        );
    }

    // ✅ Fetch single employee by ID
// ✅ Fetch single employee by ID
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
