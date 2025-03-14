<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Employee;
use App\Models\DeviceAssignment;
use Illuminate\Http\Request;

class InventoryDeviceAssignmentController extends Controller
{
    // Fetch Employees
    public function getEmployees()
    {
        return response()->json(Employee::select('id', 'first_name', 'last_name', 'employee_number')->get());
    }

    // Fetch Available Devices
    public function getAvailableDevices()
    {
        return response()->json(
            Device::where('condition', 'Good')
                ->whereIn('remarks', ['Available', 'Free'])
                ->get()
        );
    }

    // Fetch Assigned Devices
    public function getAssignedDevices()
{
    $assignments = DeviceAssignment::with(['employee', 'device'])->get();

    $assignments = $assignments->map(function ($assignment) {
        return [
            'id' => $assignment->id,
            'employee_id' => $assignment->employee->id ?? null,
            'employee_name' => $assignment->employee ? $assignment->employee->first_name . ' ' . $assignment->employee->last_name : 'N/A',
            'employee_number' => $assignment->employee->employee_number ?? 'N/A',
            'previous_assignee' => $assignment->previous_assignee ? $assignment->previous_assignee : "",
            'classification' => $assignment->classification,
            'brand_name' => $assignment->brand_name,
            'model' => $assignment->model,
            'serial_number' => $assignment->serial_number
        ];
    });

    return response()->json($assignments);
}

    // Assign a Device to an Employee
    public function assignDevice(Request $request)
    {
        $employee = Employee::whereRaw("CONCAT(first_name, ' ', last_name) = ?", [$request->employee])->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        $device = Device::where('classification', $request->classification)
            ->where('brand_name', $request->brand)
            ->where('model', $request->model)
            ->where('condition', 'Good')
            ->whereIn('remarks', ['Available', 'Free'])
            ->first();

        if (!$device) {
            return response()->json(['error' => 'Device not available'], 400);
        }

        // Create a new assignment record
        $assignment = DeviceAssignment::create([
            'employee_id' => $employee->id,
            'device_id' => $device->id,
            'classification' => $device->classification,
            'brand_name' => $device->brand_name,
            'model' => $device->model,
            'serial_number' => $device->serial_number
        ]);

        // Mark the device as assigned
        $device->remarks = 'Assigned';
        $device->save();

        return response()->json([
            'message' => 'Device assigned successfully!',
            'redirect' => route('inventory-devicelist') // Pass redirect URL
        ]);
    }

    public function transferDevice(Request $request)
{
    $assignment = DeviceAssignment::find($request->assignment_id);

    if (!$assignment) {
        return response()->json(['error' => 'Assignment not found'], 404);
    }

    $newEmployee = Employee::whereRaw("CONCAT(first_name, ' ', last_name) = ?", [$request->new_assignee])->first();

    if (!$newEmployee) {
        return response()->json(['error' => 'New assignee not found'], 404);
    }

    // Update the current assignment
    $assignment->previous_assignee = $assignment->employee->first_name . ' ' . $assignment->employee->last_name;
    $assignment->transferred_date = $request->transferred_date;
    $assignment->employee_id = $newEmployee->id;
    $assignment->save();

    return response()->json(['message' => 'Device transferred successfully!', 'updatedAssignment' => $assignment]);
}
public function deleteAssignment($id)
{
    $assignment = DeviceAssignment::find($id);

    if (!$assignment) {
        return response()->json(['error' => 'Assignment not found'], 404);
    }

    // Retrieve device and mark as 'Free'
    $device = Device::find($assignment->device_id);
    if ($device) {
        $device->remarks = 'Free';
        $device->save();
    }

    // Delete the assignment record
    $assignment->delete();

    return response()->json(['message' => 'Device assignment deleted successfully!']);
}


}
