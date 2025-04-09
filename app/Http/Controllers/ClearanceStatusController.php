<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IssuedEClearance;

class ClearanceStatusController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        if ($status === 'pending') {
            return $this->getPending();
        }

        if ($status === 'completed') {
            return $this->getCompleted();
        }

        return response()->json(['message' => 'Invalid status parameter'], 400);
    }

    public function getPending()
    {
        $employees = IssuedEClearance::whereNotNull('wiseda_exit_clearance')
            ->whereNull('remarks')
            ->get()
            ->map(function ($emp) {
                $middle = ($emp->middle_initial && $emp->middle_initial !== '-') ? $emp->middle_initial . ' ' : '';
                return [
                    'user_id' => $emp->id,
                    'employee_number' => $emp->employee_number,
                    'employee_name' => "{$emp->first_name} {$middle}{$emp->last_name}",
                    'division_department' => $emp->division_department,
                    'position' => $emp->position,
                    'effectivity_date' => $emp->effectivity_date,
                    'advise_of_hr' => $emp->advise_of_hr,
                    'employee_type' => $emp->employee_type,
                    'wisedit_deactivation' => $emp->wisedit_deactivation,
                    'wiseda_exit_clearance' => $emp->wiseda_exit_clearance,
                    'remarks' => $emp->remarks,
                ];
            });

        return response()->json($employees);
    }

    public function getCompleted()
    {
        $employees = IssuedEClearance::where('remarks', 'Approved')
            ->get()
            ->map(function ($emp) {
                $middle = ($emp->middle_initial && $emp->middle_initial !== '-') ? $emp->middle_initial . ' ' : '';
                return [
                    'user_id' => $emp->id,
                    'employee_number' => $emp->employee_number,
                    'employee_name' => "{$emp->first_name} {$middle}{$emp->last_name}",
                    'division_department' => $emp->division_department,
                    'position' => $emp->position,
                    'effectivity_date' => $emp->effectivity_date,
                    'advise_of_hr' => $emp->advise_of_hr,
                    'employee_type' => $emp->employee_type,
                    'wisedit_deactivation' => $emp->wisedit_deactivation,
                    'wiseda_exit_clearance' => $emp->wiseda_exit_clearance,
                    'remarks' => $emp->remarks,
                ];
            });

        return response()->json($employees);
    }

    public function approve($id)
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
}
