<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;
use Illuminate\Support\Facades\Storage;

class InventoryDeviceManagementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tag_no' => 'required|string|unique:devices',
            'pi_guard' => 'required|string',
            'general_name' => 'required|string',
            'activation_updates' => 'required|string',
            'brand_name' => 'required|string',
            'accessories' => 'nullable|string',
            'classification' => 'required|string',
            'estimated_acquisition_year' => 'required|string',
            'model' => 'required|string',
            'location' => 'required|string',
            'serial_number' => 'required|string|unique:devices',
            'qr_code' => 'required|string',
            'property_tag' => 'nullable|string',
            'with_warranty' => 'required|string',
            'computer_name' => 'nullable|string',
            'remarks' => 'nullable|string',
            'condition' => 'required|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        // Create a new device entry
        $device = new Device();
        $device->tag_no = $request->tag_no;
        $device->pi_guard = $request->pi_guard;
        $device->general_name = $request->general_name;
        $device->activation_updates = $request->activation_updates;
        $device->brand_name = $request->brand_name;
        $device->accessories = $request->accessories;
        $device->classification = $request->classification;
        $device->estimated_acquisition_year = $request->estimated_acquisition_year;
        $device->model = $request->model;
        $device->location = $request->location;
        $device->serial_number = $request->serial_number;
        $device->qr_code = $request->qr_code;
        $device->property_tag = $request->property_tag;
        $device->with_warranty = $request->with_warranty;
        $device->computer_name = $request->computer_name;
        $device->remarks = $request->remarks;
        $device->remarks = $request->condition;

        // Handle Image Upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/device_images', $filename);
            $device->image_file = $filename;
        }

        // Save device entry to the database
        $device->save();

        return redirect()->route('inventory-devicelist')->with('success', 'Device saved successfully!');
    }
}
