<?php

namespace App\Http\Controllers;

use App\Models\IssuedEClearance;
use App\Models\Employee; // Import your Employee model if needed
use Illuminate\Http\Request;

class ExitClearanceController extends Controller
{
    public function issueExitClearance(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        // Save the exit clearance to the database
        $exitClearance = IssuedEClearance::create([
            'employee_id' => $employee->employee_id,
            'employee_number' => $employee->employee_number,
            'first_name' => $employee->first_name,
            'middle_initial' => $employee->middle_initial,
            'last_name' => $employee->last_name,
            'position' => $employee->position,
            'division_department' => $employee->division_department,
            'division_code' => $employee->division_code,
            'department_code' => $employee->department_code,
            'section_code' => $employee->section_code,
            'employee_type' => $employee->employee_type,
            'effectivity_date' => $request->input('effectivity_date'),
            'advise_of_hr' => $request->input('advise_of_hr'),
            'wisedit_deactivation' => $request->input('wisedit_deactivation'),
            'wiseda_exit_clearance' => $request->input('wiseda_exit_clearance'),
            'remarks' => $request->input('remarks'),
        ]);

        return response()->json(['message' => 'Exit clearance issued successfully!', 'data' => $exitClearance], 200);
    }
}
