<?php

namespace App\Imports;

use App\Models\Device;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;
use Illuminate\Support\Facades\Log;

class YourImportClass implements OnEachRow, WithHeadingRow
{
    public function onRow(Row $row)
    {
        $row = $row->toArray();

        Log::info('Processing Row Data: ', $row);

        try {
            if (isset($row['employee_number'])) {
                $this->importEmployeeData($row);
            }
            
            if (isset($row['tag_no'])) {
                $this->importDeviceData($row);
            }
        } catch (\Exception $e) {
            Log::error("Error processing row: " . $e->getMessage());
        }
    }

    // ✅ Save Employee Data to Database
    private function importEmployeeData(array $row)
    {
        try {
            Employee::updateOrCreate(
                ['employee_number' => $row['employee_number']],
                [
                    'first_name' => $row['name'] ?? 'N/A',
                    'middle_initial' => $row['mi'] ?? 'N/A',
                    'last_name' => $row['surname'] ?? 'N/A',
                    'division_department' => $row['division_department'] ?? 'N/A',
                    'position' => $row['position'] ?? 'N/A',
                    'section_code' => $row['section_code'] ?? 'N/A',
                    'division_code' => $row['division_code'] ?? 'N/A',
                    'department_code' => $row['department_code'] ?? 'N/A',
                ]
            );

            Log::info("Employee Data Saved: " . $row['employee_number']);

        } catch (\Exception $e) {
            Log::error("Error saving Employee Data: " . $e->getMessage());
        }
    }

    // ✅ Save Device Data to Database
    private function importDeviceData(array $row)
    {
        try {
            Device::updateOrCreate(
                ['tag_no' => $row['tag_no']],
                [
                    'pi_guard' => $row['with_ipguard'] ?? 'N/A',
                    'general_name' => $row['general_name'] ?? 'N/A',
                    'activation_updates' => $row['activation_updates'] ?? 'N/A',
                    'brand_name' => $row['brand_name'] ?? 'N/A',
                    'classification' => $row['classification'] ?? 'N/A',
                    'estimated_acquisition_year' => $row['estimated_acquisition_year'] ?? 'N/A',
                    'model' => $row['model'] ?? 'N/A',
                    'location' => $row['location'] ?? 'N/A',
                    'serial_number' => $row['serial_number'] ?? 'N/A',
                    'qr_code' => $row['qr_code'] ?? 'N/A',
                    'property_tag' => $row['property_tag'] ?? 'N/A',
                    'with_warranty' => $row['warranty'] ?? 'N/A',
                    'computer_name' => $row['computer_name'] ?? 'N/A',
                    'remarks' => $row['remarks'] ?? 'N/A',
                    'condition' => ($row['remarks'] ?? '') === 'Free' ? 'Good' : 'Bad',
                ]
            );

            Log::info("Device Data Saved: " . $row['tag_no']);

        } catch (\Exception $e) {
            Log::error("Error saving Device Data: " . $e->getMessage());
        }
    }
}
