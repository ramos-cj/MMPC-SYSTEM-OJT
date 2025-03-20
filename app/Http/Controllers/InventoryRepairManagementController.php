<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Device;

class InventoryRepairManagementController extends Controller
{
    public function listBadDevices()
{
    $badDevices = Device::where('condition', 'Bad')
        ->select(
            'id', 'tag_no', 'general_name', 'brand_name', 'classification',
            'model', 'computer_name', 'with_warranty', 'location',
            'need_to_be_repair', 'condition'
        )
        ->get();

    return response()->json($badDevices);
}

public function updateDeviceIssues(Request $request, $id)
{
    $device = Device::findOrFail($id);

    $device->need_to_be_repair = $request->input('need_to_be_repair');
    if ($device->need_to_be_repair === "") {
        $device->condition = "Good"; // Change condition to Good if no issues remain
    }

    $device->save();

    return response()->json(['message' => 'Device issues updated successfully!']);
}


}
