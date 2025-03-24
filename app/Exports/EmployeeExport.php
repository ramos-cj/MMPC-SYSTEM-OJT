<?php

namespace App\Exports;

use App\Models\Employee;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EmployeeExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Employee::select(
            'employee_number', 'first_name', 'middle_initial', 'last_name',
            'division_department', 'position', 'section_code', 'division_code', 'department_code'
        )->get();
    }

    public function headings(): array
    {
        return [
            ['Employees Data'],  // Title of the sheet
            [
                'Employee Number', 'First Name', 'Middle Initial', 'Last Name', 
                'Division / Department', 'Position', 'Section Code', 'Division Code', 'Department Code'
            ]
        ];
    }
}
