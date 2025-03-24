<?php

namespace App\Imports;

use App\Models\Device;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class YourImportClass implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Log the row data for debugging
        Log::info('Imported Row Data: ', $row);

        // If the row contains Employee Data
        if ($this->isEmployeeData($row)) {
            $this->importEmployeeData($row);
        }

        // If the row contains Device Data
        if ($this->isDeviceData($row)) {
            $this->importDeviceData($row);
        }

        return null; // Not returning model instance directly
    }

    // ✅ Check if row contains Employee Data
    private function isEmployeeData(array $row): bool
    {
        return isset($row['employee_number']) && isset($row['name']) && isset($row['surname']);
    }

    // ✅ Check if row contains Device Data
    private function isDeviceData(array $row): bool
    {
        return isset($row['tag_no']) && isset($row['with_ipguard']);
    }

    // ✅ Save Employee Data to Database
    private function importEmployeeData(array $row)
    {
        Employee::updateOrCreate(
            ['employee_number' => $row['employee_number']],
            [
                'first_name' => $row['name'],
                'middle_initial' => $row['mi'] ?? null,
                'last_name' => $row['surname'],
                'division_department' => $row['division_department'] ?? null,
                'position' => $row['position'] ?? null,
                'section_code' => $row['section_code'] ?? null,
                'division_code' => $row['division_code'] ?? null,
                'department_code' => $row['department_code'] ?? null,
            ]
        );
    }

    // ✅ Save Device Data to Database
    private function importDeviceData(array $row)
    {
        Device::updateOrCreate(
            ['tag_no' => $row['tag_no']],
            [
                'pi_guard' => $row['with_ipguard'] ?? null,
                'general_name' => $row['general_name'],
                'activation_updates' => $row['activation_updates'] ?? null,
                'brand_name' => $row['brand_name'],
                'classification' => $row['classification'],
                'estimated_acquisition_year' => $row['estimated_acquisition_year'] ?? null,
                'model' => $row['model'] ?? null,
                'location' => $row['location'] ?? null,
                'serial_number' => $row['serial_number'] ?? null,
                'qr_code' => $row['qr_code'] ?? null,
                'property_tag' => $row['property_tag'] ?? null,
                'with_warranty' => $row['warranty'] ?? null,
                'computer_name' => $row['computer_name'] ?? null,
                'remarks' => $row['remarks'] ?? null,
                'condition' => ($row['remarks'] ?? '') === 'Free' ? 'Good' : 'Bad',
            ]
        );
    }
}
