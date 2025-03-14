<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'device_id',
        'classification',
        'brand_name',
        'model',
        'serial_number',
        'previous_assignee',
        'transferred_date'
    ];
    
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
