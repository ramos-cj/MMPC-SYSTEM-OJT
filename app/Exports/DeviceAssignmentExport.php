<?php

namespace App\Exports;

use App\Models\DeviceAssignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DeviceAssignmentExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return DeviceAssignment::select(
            'id', 'employee_id', 'device_id', 'classification', 'brand_model', 
            'serial_number', 'accessories', 'device_remarks', 'created_at', 'updated_at', 
            'previous_assignee', 'transferred_date'
        )->get();
    }

    public function headings(): array
    {
        return [
            ['Device Assignments Data'],  // Title
            [
                'ID', 'Employee ID', 'Device ID', 'Classification', 'Brand / Model', 
                'Serial Number', 'Accessories', 'Assigned Devices Remarks', 'Created At', 'Updated At', 
                'Previous Assignee', 'Transferred Date'
            ]
        ];
    }
}
