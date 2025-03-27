<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IssuedEClearance extends Model
{
    use HasFactory;

    protected $table = 'issued_eclearance';  // Your table name

    protected $fillable = [
        'employee_id',
        'employee_number',
        'first_name',
        'middle_initial',
        'last_name',
        'position',
        'division_department',
        'division_code',
        'department_code',
        'section_code',
        'employee_type',
        'effectivity_date',
        'advise_of_hr',
        'wisedit_deactivation',
        'wiseda_exit_clearance',
        'remarks'
    ];
}
