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
            'tag_no', 'brand_model', 'serial_number','computer_name',
            'activation_updates', 'estimated_acquisition_year',
            'location', 'with_warranty', 'remarks', 'condition'
        )->get();
    }

    public function headings(): array
    {
        return [
            ['Devices Data'],  // Title of the sheet
            [
                'Tag No', 'Brand / Model', 'Serial Number','Computer Name', 'Activation Updates', 'Estimated Acquisition Year',
                'Location', 'Warranty', 'Remarks', 'Condition'
            ]
        ];
    }
}
