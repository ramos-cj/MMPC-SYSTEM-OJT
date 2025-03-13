<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_number', // Add employee number
        'first_name',
        'middle_initial',
        'last_name',
        'division_department',
        'position',
        'section_code',
        'division_code',
        'department_code',
    ];
}
