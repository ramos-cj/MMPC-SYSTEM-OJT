<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\DeviceAssignment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class InventoryDeviceManagementController extends Controller
{

    public function getDevices()
{
    $devices = Device::leftJoin('device_assignments', 'devices.id', '=', 'device_assignments.device_id')
        ->leftJoin('employees', 'device_assignments.employee_id', '=', 'employees.id')
        ->select(
            'devices.*',
            'device_assignments.device_remarks',
            'employees.first_name',
            'employees.last_name',
            'device_assignments.employee_id'
        )
        ->get()
        ->map(function ($device) {
            $device->employee_name = $device->first_name && $device->last_name ? $device->first_name . ' ' . $device->last_name : 'Unassigned';
            return $device;
        });

    return response()->json($devices);
}

public function getDevice($id)
{
    $device = Device::findOrFail($id);
    return response()->json($device);
}

public function store(Request $request)
{
    // Define the validation rules for all fields
    $rules = [
        'tag_no' => ['required', 'string'],
        'activation_updates' => 'required|string',
        'classification' => 'required|string',
        'estimated_acquisition_year' => 'required|string',
        'brand_model' => 'required|string',
        'location' => 'required|string',
        'serial_number' => 'required|string|unique:devices',
        'qr_code' => 'required|string',
        'with_warranty' => 'required|string',
        'computer_name' => 'nullable|string',
        'remarks' => 'nullable|string',
        'condition' => 'required|string',
        'need_to_be_repair' => 'nullable|string',
        'supplier_name' => 'nullable|string',  // Add validation for the new fields
        'invoice_number' => 'nullable|string',
        'warranty_years' => 'nullable|string',
        'last_inventory_count' => 'nullable|string',
        'it_in_charge' => 'nullable|string',
        'ticket_number' => 'nullable|string',  // For "Disposed" devices
        'reason_for_disposal' => 'nullable|string',  // For "Disposed" devices
        'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',  // Image validation
    ];

    // Only enforce uniqueness if tag_no is not N/A
    if ($request->tag_no !== 'N/A') {
        $rules['tag_no'][] = Rule::unique('devices');
    }

    // Validate incoming data
    $request->validate($rules);

    // Initialize a new device
    $device = new Device();

    // Assign values from the request to the device
    $device->tag_no = $request->tag_no;
    $device->activation_updates = $request->activation_updates;
    $device->classification = $request->classification;
    $device->estimated_acquisition_year = $request->estimated_acquisition_year;
    $device->brand_model = $request->brand_model;
    $device->location = $request->location;
    $device->serial_number = $request->serial_number;
    $device->qr_code = $request->qr_code;
    $device->with_warranty = $request->with_warranty;
    $device->computer_name = $request->computer_name;
    $device->remarks = $request->remarks;
    $device->condition = $request->condition;
    $device->need_to_be_repair = ($request->condition === "Bad") ? $request->need_to_be_repair : null;
    
    // Set the new fields
    $device->supplier_name = $request->supplier_name;
    $device->invoice_number = $request->invoice_number;
    $device->warranty_years = $request->warranty_years;
    $device->last_inventory_count = $request->last_inventory_count;
    $device->it_in_charge = $request->it_in_charge;
    $device->ticket_number = $request->ticket_number;
    $device->reason_for_disposal = $request->reason_for_disposal;

    // Handle image upload (if present)
    if ($request->hasFile('image_file')) {
        $file = $request->file('image_file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/device-images', $filename);
        $device->image_file = $filename;
    }

    // Save the device in the database
    $device->save();

    // Return success message
    return redirect()->route('inventory-devicelist')->with([
        'success' => true,
        'message' => 'Device saved successfully!',
        'device' => $device
    ]);
}


public function getDeviceImage($filename)
{
    $path = storage_path("app/private/public/device-images/{$filename}");

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
}

public function update(Request $request, $id)
{
    try {
        $device = Device::with('employeeAssignments')->findOrFail($id); // Ensure you load employeeAssignments

        // Validate incoming request
        $request->validate([
            'tag_no' => 'nullable|string|max:255',
            'activation_updates' => 'required|string',
            'classification' => 'required|string',
            'estimated_acquisition_year' => 'required|string',
            'brand_model' => 'required|string',
            'location' => 'required|string',
            'serial_number' => 'required|string|unique:devices,serial_number,' . $id,
            'qr_code' => 'required|string',
            'with_warranty' => 'required|string',
            'computer_name' => 'nullable|string',
            'remarks' => 'nullable|string',
            'condition' => 'required|string',
            'need_to_be_repair' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'ticket_number' => 'nullable|string', // Added for "Disposed" devices
            'reason_for_disposal' => 'nullable|string', // Added for "Disposed" devices
        ]);

        // Update device fields
        $device->tag_no = $request->tag_no;
        $device->activation_updates = $request->activation_updates;
        $device->classification = $request->classification;
        $device->estimated_acquisition_year = $request->estimated_acquisition_year;
        $device->brand_model = $request->brand_model;
        $device->location = $request->location;
        $device->serial_number = $request->serial_number;
        $device->qr_code = $request->qr_code;
        $device->with_warranty = $request->with_warranty;
        $device->computer_name = $request->computer_name;
        $device->remarks = $request->remarks;
        $device->condition = $request->condition;
        $device->need_to_be_repair = $request->condition === "Bad" ? $request->need_to_be_repair : null;

        // Add the new fields
        $device->supplier_name = $request->supplier_name;
        $device->invoice_number = $request->invoice_number;
        $device->warranty_years = $request->warranty_years;
        $device->last_inventory_count = $request->last_inventory_count;
        $device->it_in_charge = $request->it_in_charge;

        // Handle employee assignment removal if device is free or disposed
        if ($request->remarks === "Free" || $request->remarks === "Disposed") {
            $deviceAssignment = DeviceAssignment::where('device_id', $device->id)->first();
            if ($deviceAssignment) {
                // Remove the device assignment
                $deviceAssignment->delete();
            }
        }

        // If remarks are "Disposed", handle ticket number and reason for disposal
        if ($request->remarks === "Disposed") {
            $device->ticket_number = $request->ticket_number;
            $device->reason_for_disposal = $request->reason_for_disposal;
        }

        // If image file is uploaded, handle file storage
        if ($request->hasFile('image_file')) {
            // Delete old image if it exists
            if ($device->image_file) {
                Storage::delete('public/device-images/' . $device->image_file);
            }

            // Store new image
            $file = $request->file('image_file');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/device-images', $filename);

            // Assign new image to device
            $device->image_file = $filename;
        }

        // Save the updated device details
        $device->save();

        // Update the device assignment remarks if necessary
        if ($request->has('device_remarks')) {
            $assignment = DeviceAssignment::where('device_id', $device->id)->first();
            if ($assignment) {
                $assignment->device_remarks = $request->device_remarks;
                $assignment->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Device updated successfully!',
            'device' => $device
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}


// Remove assignment of device when condition is updated to "Bad"
public function removeAssignment($device_id)
{
    try {
        $assignment = DeviceAssignment::where('device_id', $device_id)->first();

        if ($assignment) {
            // Remove the assignment
            $assignment->delete();
            return response()->json(['message' => 'Device assignment removed successfully.']);
        }

        return response()->json(['message' => 'No assignment found for this device.'], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function delete($id)
{
    $device = Device::findOrFail($id);
    $device->delete();

    // Reset AUTO_INCREMENT to the next available value (Optional)
    $maxId = Device::max('id');
    DB::statement("ALTER TABLE devices AUTO_INCREMENT = " . ($maxId + 1));

    return response()->json(['message' => 'Device deleted successfully']);
}
}
