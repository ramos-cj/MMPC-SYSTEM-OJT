<?php

namespace App\Imports;

use App\Models\Device;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class YourImportClass implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {

        if (isset($row['employee_number']) && isset($row['first_name'])) {
            return Employee::updateOrCreate(
                ['employee_number' => $row['employee_number']],
                [
                    'first_name' => $row['first_name'],
                    'middle_initial' => $row['middle_initial'],
                    'last_name' => $row['last_name'],
                    'division_department' => $row['division_department'],
                    'position' => $row['position'],
                    'section_code' => $row['section_code'],
                    'division_code' => $row['division_code'],
                    'department_code' => $row['department_code'],
                ]
            );
        } elseif (isset($row['tag_no']) && isset($row['general_name'])) {
            return Device::updateOrCreate(
                ['tag_no' => $row['tag_no']],
                [
                    'pi_guard' => $row['pi_guard'],
                    'general_name' => $row['general_name'],
                    'activation_updates' => $row['activation_updates'],
                    'brand_name' => $row['brand_name'],
                    'classification' => $row['classification'],
                    'model' => $row['model'],
                    'location' => $row['location'],
                    'serial_number' => $row['serial_number'],
                    'qr_code' => $row['qr_code'],
                    'property_tag' => $row['property_tag'],
                    'with_warranty' => $row['with_warranty'],
                    'computer_name' => $row['computer_name'],
                    'remarks' => $row['remarks'],
                    'condition' => $row['condition'],
                    'assigned_to' => $row['assigned_to'],
                    'need_to_be_repair' => $row['need_to_be_repair']
                ]
            );
        }

        return null;
    }
}
