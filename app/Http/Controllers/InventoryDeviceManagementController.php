<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use Illuminate\Support\Facades\Storage;

class InventoryDeviceManagementController extends Controller
{

    public function getDevices()
{
    $devices = Device::leftJoin('device_assignments', 'devices.id', '=', 'device_assignments.device_id')
        ->leftJoin('employees', 'device_assignments.employee_id', '=', 'employees.id')
        ->select(
            'devices.*',
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
    $request->validate([
        'tag_no' => 'required|string|unique:devices',
        'pi_guard' => 'required|string',
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
        'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $device = new Device();
    $device->tag_no = $request->tag_no;
    $device->pi_guard = $request->pi_guard;
    $device->activation_updates = $request->activation_updates;
    $device->classification = $request->classification;
    $device->estimated_acquisition_year = $request->estimated_acquisition_year;
    $device->brand_model = $request->brand_model;
    $device->location = $request->location;
    $device->serial_number = $request->serial_number;
    $device->qr_code = $request->qr_code;
    $device->with_warranty = $request->with_warranty;
    $device->computer_name = $request->computer_name;
    $device->condition = $request->condition;
    $device->remarks = $request->remarks;
    $device->need_to_be_repair = ($request->condition === "Bad") ? $request->need_to_be_repair : null;

    // ✅ Save Image in Private Directory
    if ($request->hasFile('image_file')) {
        $file = $request->file('image_file');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/device-images', $filename);
        $device->image_file = $filename;
    }    

    $device->save();

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
        $device = Device::findOrFail($id);

        $request->validate([
            'tag_no' => 'required|string|unique:devices,tag_no,' . $id,
            'pi_guard' => 'required|string',
            'activation_updates' => 'required|string',
            'accessories' => 'nullable|string',
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
        ]);

        // ✅ Assign new values (excluding image)
        $device->tag_no = $request->tag_no;
        $device->pi_guard = $request->pi_guard;
        $device->activation_updates = $request->activation_updates;
        $device->accessories = $request->accessories;
        $device->classification = $request->classification;
        $device->estimated_acquisition_year = $request->estimated_acquisition_year;
        $device->brand_model = $request->brand_model;
        $device->location = $request->location;
        $device->serial_number = $request->serial_number;
        $device->qr_code = $request->qr_code;
        $device->with_warranty = $request->with_warranty;
        $device->computer_name = $request->computer_name;
        $device->condition = $request->condition;
        $device->remarks = $request->remarks;
        $device->need_to_be_repair = ($request->condition === "Bad") ? $request->need_to_be_repair : null;

        // ✅ Handle image replacement
        if ($request->hasFile('image_file')) {
            // ✅ Delete old image if it exists
            if ($device->image_file) {
                Storage::delete('public/device-images/' . $device->image_file);
            }

            // ✅ Store new image
            $file = $request->file('image_file');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/device-images', $filename);

            // ✅ Assign new image to device
            $device->image_file = $filename;
        }

        // ✅ Save changes
        $device->save();

        return response()->json(['success' => true, 'message' => 'Device updated successfully!', 'device' => $device]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

public function delete($id)
{
    $device = Device::findOrFail($id);
    $device->delete();

    return response()->json(['message' => 'Device deleted successfully']);
}
}
