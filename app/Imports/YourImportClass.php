<?php

namespace App\Imports;

use App\Models\Device;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;
use Illuminate\Support\Facades\Log;
use App\Models\DeviceAssignment;

class YourImportClass implements OnEachRow, WithHeadingRow
{
    public function onRow(Row $row): void
{
    $row = $row->toArray();

    Log::info('Processing Row Data: ', $row);

    try {
        if (isset($row['employee_number'])) {
            $this->importEmployeeData($row);
        }

        // ✅ Check for devices more flexibly
        if (isset($row['classification'])) {
            $this->importDeviceData($row);
        }
    } catch (\Exception $e) {
        Log::error("Error processing row: " . $e->getMessage());
    }
}


    private function importEmployeeData(array $row)
    {
        try {
            Employee::updateOrCreate(
                ['employee_number' => $row['employee_number']],
                [
                    'first_name' => $row['first_name'] ?? 'N/A',
                    'middle_initial' => $row['mi'] ?? '-',
                    'last_name' => $row['surname'] ?? 'N/A',
                    'employee_type' => $row['user_type'] ?? 'N/A',
                    'division_department' => $row['division_department'] ?? 'N/A',
                    'position' => $row['position'] ?? 'N/A',
                    'section_code' => $row['section_code'] ?? 'N/A',
                    'division_code' => $row['division_code'] ?? 'N/A',
                    'department_code' => $row['department_code'] ?? 'N/A',
                ]
            );

            Log::info("Employee Saved: " . $row['employee_number']);
        } catch (\Exception $e) {
            Log::error("Error saving employee: " . $e->getMessage());
        }
    }

    private function importDeviceData(array $row)
{
    try {
        $employee = null;

        if (!empty($row['employee_number'])) {
            $employee = Employee::where('employee_number', $row['employee_number'])->first();
        }

        // Determine Unique Identifier
        $uniqueKey = [];
        if (!empty($row['computer_name'])) {
            $uniqueKey = ['computer_name' => $row['computer_name']];
        } elseif (!empty($row['tag_no'])) {
            $uniqueKey = ['tag_no' => $row['tag_no']];
        } elseif (!empty($row['serial_number'])) {
            $uniqueKey = ['serial_number' => $row['serial_number']];
        } else {
            Log::warning("Skipping device, no unique identifier found.");
            return;
        }

        // Normalize condition
        $rawCondition = $row['condition'] ?? null;
        $assigned = !empty($employee);

        if (!$rawCondition && $assigned) {
            $normalizedCondition = 'Good';
        } else {
            $normalizedCondition = match (strtolower(trim((string)$rawCondition))) {
                'good' => 'Good Condition',
                'bad' => 'Bad Condition',
                default => 'N/A'
            };
        }

        $remarks = $employee ? 'Assigned' : ($row['remarks'] ?? 'Free');

        // Save or Update Device
        $device = Device::updateOrCreate(
            $uniqueKey,
            [
                'pi_guard' => $row['with_ipguard'] ?? 'N/A',
                'activation_updates' => $row['activation_updates'] ?? 'N/A',
                'classification' => $row['classification'] ?? 'N/A',
                'estimated_acquisition_year' => $row['estimated_acquisition_year'] ?? 'N/A',
                'brand_model' => $row['brand_model'] ?? 'N/A',
                'location' => $row['location'] ?? 'N/A',
                'serial_number' => $row['serial_number'] ?? 'N/A',
                'qr_code' => $row['qr_code'] ?? 'N/A',
                'with_warranty' => $row['warranty'] ?? 'N/A',
                'tag_no' => $row['tag_no'] ?? 'N/A',
                'computer_name' => $row['computer_name'] ?? null,
                'remarks' => $remarks,
                'condition' => $normalizedCondition
            ]
        );

        // Assign if applicable
        if ($employee && $device) {
            DeviceAssignment::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'device_id' => $device->id
                ],
                [
                    'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                    'classification' => $device->classification ?? 'N/A',
                    'brand_model' => $device->brand_model ?? 'N/A',
                    'model' => $device->model ?? 'N/A',
                    'serial_number' => $device->serial_number ?? 'N/A',
                    'computer_name' => $device->computer_name ?? 'N/A',
                    'accessories' => $row['accessories'] ?? 'N/A',
                    'device_remarks' => $row['device_remarks'] ?? 'N/A'
                ]
            );
        }

        Log::info("Device processed: " . ($row['computer_name'] ?? $row['tag_no'] ?? $row['serial_number']));

    } catch (\Exception $e) {
        Log::error("Error saving Device Data: " . $e->getMessage());
    }
}

    private function assignDeviceToEmployee(array $row, $device)
    {
        if (!$device) return;

        $employee = Employee::where('employee_number', $row['employee_number'])->first();
        if (!$employee) {
            Log::warning("No employee found for device assignment: " . $row['employee_number']);
            return;
        }

        // Avoid duplicate assignments
        $existing = DeviceAssignment::where('employee_id', $employee->id)
                                    ->where('device_id', $device->id)
                                    ->first();
        if ($existing) return;

        DeviceAssignment::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'device_id' => $device->id
            ],
            [
                'employee_name' => $employee->first_name . ' ' . $employee->last_name,
                'classification' => $device->classification ?? 'N/A',
                'brand_model' => $device->brand_model ?? 'N/A',
                'serial_number' => $device->serial_number ?? 'N/A',
                'computer_name' => $device->computer_name ?? 'N/A',
                'accessories' => $row['accessories'] ?? 'N/A'
            ]
        );
        

        Log::info("Device Assigned: Employee {$employee->employee_number} to Device {$device->computer_name}");
    }
}
