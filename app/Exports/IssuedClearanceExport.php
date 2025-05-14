<?php

namespace App\Exports;

use App\Models\IssuedEClearance;
use Maatwebsite\Excel\Concerns\FromCollection;

class IssuedClearanceExport implements FromCollection
{
    public function collection()
    {
        return IssuedEClearance::all(); // Export all issued clearances
    }

    public function headings(): array
    {
        return ['Employee ID', 'Employee Number', 'Employee Name', 'Division', 'Remarks', 'Date Issued'];
    }
}
