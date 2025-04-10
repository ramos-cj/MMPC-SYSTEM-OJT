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
        'employee_name',
        'classification',
        'brand_model',
        'serial_number',
        'computer_name',
        'accessories',
        'remarks',
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
