<?php

namespace App\Exports;

use App\Models\Device;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DeviceExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Device::select(
            'tag_no', 'general_name', 'brand_name', 'serial_number', 'property_tag',
            'computer_name', 'pi_guard', 'activation_updates', 'estimated_acquisition_year',
            'location', 'with_warranty', 'remarks', 'condition'
        )->get();
    }

    public function headings(): array
    {
        return [
            ['Devices Data'],  // Title of the sheet
            [
                'Tag No', 'General Name', 'Brand Name', 'Serial Number', 'Property Tag',
                'Computer Name', 'IP-Guard', 'Activation Updates', 'Estimated Acquisition Year',
                'Location', 'Warranty', 'Remarks', 'Condition'
            ]
        ];
    }
}
