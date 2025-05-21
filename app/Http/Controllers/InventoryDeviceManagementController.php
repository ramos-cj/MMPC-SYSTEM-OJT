<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use App\Models\DeviceAssignment;
use App\Models\DisposedDevice;
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
        $device = Device::with('employeeAssignments')->findOrFail($id);

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
            'ticket_number' => 'nullable|string',
            'reason_for_disposal' => 'nullable|string',
        ]);

        $previousRemarks = $device->remarks;
        $newRemarks = $request->remarks;

        $isDisposing = ($previousRemarks !== "Disposed" && $newRemarks === "Disposed");

        if ($isDisposing) {
            // Move device to disposed_devices
            $disposedDevice = DisposedDevice::create([
                'tag_no' => $device->tag_no,
                'activation_updates' => $device->activation_updates,
                'brand_model' => $device->brand_model,
                'accessories' => $device->accessories,
                'classification' => $device->classification,
                'estimated_acquisition_year' => $device->estimated_acquisition_year,
                'location' => $device->location,
                'serial_number' => $device->serial_number,
                'qr_code' => $device->qr_code,
                'with_warranty' => $device->with_warranty,
                'computer_name' => $device->computer_name,
                'remarks' => $newRemarks,
                'assigned_to' => $device->assigned_to,
                'condition' => $device->condition,
                'image_file' => $device->image_file,
                'need_to_be_repair' => $device->need_to_be_repair,
                'supplier_name' => $device->supplier_name,
                'invoice_number' => $device->invoice_number,
                'warranty_years' => $device->warranty_years,
                'last_inventory_count' => $device->last_inventory_count,
                'it_in_charge' => $device->it_in_charge,
                'ticket_number' => $request->ticket_number,
                'reason_for_disposal' => $request->reason_for_disposal,
            ]);

            // Delete assignment if any
            $assignment = DeviceAssignment::where('device_id', $device->id)->first();
            if ($assignment) {
                $assignment->delete();
            }

            // Delete original device
            $device->delete();

            // Return JSON with redirect instruction
            return response()->json([
                'success' => true,
                'message' => 'Device moved to disposed devices successfully.',
                'redirect' => '/inventory-disposedlist',
                'disposedDevice' => $disposedDevice,
            ]);
        }

        // Normal update when not disposing
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
        $device->remarks = $newRemarks;
        $device->condition = $request->condition;
        $device->need_to_be_repair = $request->condition === "Bad" ? $request->need_to_be_repair : null;
        $device->supplier_name = $request->supplier_name;
        $device->invoice_number = $request->invoice_number;
        $device->warranty_years = $request->warranty_years;
        $device->last_inventory_count = $request->last_inventory_count;
        $device->it_in_charge = $request->it_in_charge;

        if ($request->hasFile('image_file')) {
            if ($device->image_file) {
                Storage::delete('public/device-images/' . $device->image_file);
            }
            $file = $request->file('image_file');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/device-images', $filename);
            $device->image_file = $filename;
        }

        $device->save();

        // Remove assignment if remarks changed to Free or Disposed
        if (($previousRemarks !== $newRemarks) && ($newRemarks === 'Free' || $newRemarks === 'Disposed')) {
            $assignment = DeviceAssignment::where('device_id', $device->id)->first();
            if ($assignment) {
                $assignment->delete();
            }
        }

        // Update assignment remarks if provided
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
            'device' => $device,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
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

public function disposeDevice(Request $request, $id)
{
    $device = Device::findOrFail($id);

    // Validate disposal-related data from $request as needed

    // Create disposed device record
    $disposedDevice = DisposedDevice::create([
        'tag_no' => $device->tag_no,
        'activation_updates' => $device->activation_updates,
        'brand_model' => $device->brand_model,
        'accessories' => $device->accessories,
        'classification' => $device->classification,
        'estimated_acquisition_year' => $device->estimated_acquisition_year,
        'location' => $device->location,
        'serial_number' => $device->serial_number,
        'qr_code' => $device->qr_code,
        'with_warranty' => $device->with_warranty,
        'computer_name' => $device->computer_name,
        'remarks' => $device->remarks,
        'assigned_to' => $device->assigned_to,
        'condition' => $device->condition,
        'image_file' => $device->image_file,
        'need_to_be_repair' => $device->need_to_be_repair,
        'supplier_name' => $device->supplier_name,
        'invoice_number' => $device->invoice_number,
        'warranty_years' => $device->warranty_years,
        'last_inventory_count' => $device->last_inventory_count,
        'it_in_charge' => $device->it_in_charge,
        'ticket_number' => $request->input('ticket_number'),
        'reason_for_disposal' => $request->input('reason_for_disposal'),
    ]);

    // Delete from devices table
    $device->delete();

    return response()->json([
        'success' => true,
        'message' => 'Device marked as disposed and moved successfully.',
        'disposedDevice' => $disposedDevice,
    ]);
}

public function storeDisposed(Request $request)
{
    $rules = [
        'tag_no' => ['required', 'string'],
        'activation_updates' => 'required|string',
        'classification' => 'required|string',
        'estimated_acquisition_year' => 'required|string',
        'brand_model' => 'required|string',
        'location' => 'required|string',
        'serial_number' => 'required|string|unique:disposed_devices',
        'qr_code' => 'required|string',
        'with_warranty' => 'required|string',
        'computer_name' => 'nullable|string',
        'remarks' => 'required|string',
        'condition' => 'required|string',
        'need_to_be_repair' => 'nullable|string',
        'supplier_name' => 'nullable|string',
        'invoice_number' => 'nullable|string',
        'warranty_years' => 'nullable|string',
        'last_inventory_count' => 'nullable|string',
        'it_in_charge' => 'nullable|string',
        'ticket_number' => 'nullable|string',
        'reason_for_disposal' => 'nullable|string',
        'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ];

    $request->validate($rules);

    $disposedDevice = new DisposedDevice();

    foreach ($rules as $field => $rule) {
        if ($request->has($field)) {
            $disposedDevice->$field = $request->$field;
        }
    }

    if ($request->hasFile('image_file')) {
        $file = $request->file('image_file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/device-images', $filename);
        $disposedDevice->image_file = $filename;
    }

    $disposedDevice->save();

    return redirect()->route('inventory-disposedlist')->with([
        'success' => true,
        'message' => 'Disposed device saved successfully!',
        'device' => $disposedDevice
    ]);
}

public function getDisposedDevices()
{
    $disposedDevices = DisposedDevice::all();
    return response()->json($disposedDevices);
}

}
