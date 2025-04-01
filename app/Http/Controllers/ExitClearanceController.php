<?php

namespace App\Http\Controllers;

use App\Models\IssuedEClearance;
use App\Models\Employee; // Import your Employee model if needed
use Illuminate\Http\Request;

class ExitClearanceController extends Controller
{
    public function issueExitClearance(Request $request, $id)
{
    $employee = Employee::where('id', $id)->first();

    if (!$employee) {
        return response()->json(['message' => 'Employee not found.'], 404);
    }

    // Validate incoming request
    $validatedData = $request->validate([
        'effectivity_date' => 'nullable|date',
        'advise_of_hr' => 'nullable|date',
        'wisedit_deactivation' => 'nullable|string',
        'remarks' => 'nullable|string'
    ]);

    try {
        // Save the exit clearance to the database
        $exitClearance = IssuedEClearance::create([
            'employee_id' => $employee->id,
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
            'effectivity_date' => $validatedData['effectivity_date'] ?? null,
            'advise_of_hr' => $validatedData['advise_of_hr'] ?? null,
            'wisedit_deactivation' => $validatedData['wisedit_deactivation'] ?? null,
            'remarks' => $validatedData['remarks'] ?? null,
        ]);        
        
        return response()->json(['message' => 'Exit clearance issued successfully!', 'data' => $exitClearance], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'An error occurred while saving exit clearance.', 'error' => $e->getMessage()], 500);
    }
}

public function listIssuedClearances()
{
    try {
        $issuedClearances = \App\Models\IssuedEClearance::all();

        return response()->json($issuedClearances, 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error fetching issued clearances.', 'error' => $e->getMessage()], 500);
    }
}
public function updateWisedaLink(Request $request, $id)
{
    $validated = $request->validate([
        'wiseda_exit_clearance' => 'nullable|string'
    ]);

    try {
        $clearance = IssuedEClearance::findOrFail($id);
        $clearance->wiseda_exit_clearance = $validated['wiseda_exit_clearance'];
        $clearance->save();

        return response()->json($clearance);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update'], 500);
    }
}

public function deleteIssuedClearance($id)
{
    try {
        $clearance = IssuedEClearance::findOrFail($id);
        $clearance->delete();

        return response()->json(['message' => 'Exit clearance deleted successfully.']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to delete exit clearance.', 'error' => $e->getMessage()], 500);
    }
}

public function listClearanceStatus(Request $request)
{
    $status = $request->query('status');

    if ($status === 'pending') {
        $employees = IssuedEClearance::whereNotNull('wiseda_exit_clearance')
            ->get()
            ->map(function ($emp) {
                return [
                    'user_id' => $emp->id,
                    'employee_number' => $emp->employee_number,
                    'employee_name' => "{$emp->first_name} {$emp->middle_initial} {$emp->last_name}",
                    'division_department' => $emp->division_department,
                    'position' => $emp->position,
                    'effectivity_date' => $emp->effectivity_date,
                    'advise_of_hr' => $emp->advise_of_hr,
                    'wisedit_deactivation' => $emp->wisedit_deactivation,
                    'wiseda_exit_clearance' => $emp->wiseda_exit_clearance
                ];
            });

        return response()->json($employees);
    }

    // Add logic for 'completed' if needed
}

public function markAsApproved($id)
{
    try {
        $clearance = IssuedEClearance::findOrFail($id);
        $clearance->remarks = 'Approved';
        $clearance->save();

        return response()->json(['message' => 'Marked as approved successfully.']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to mark as approved.', 'error' => $e->getMessage()], 500);
    }
}


public function getDivisions()
{
    $divisions = Employee::distinct()->pluck('division_department');
    return response()->json($divisions);
}
}    