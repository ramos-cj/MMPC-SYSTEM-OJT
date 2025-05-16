<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag_no',
        'activation_updates',
        'classification',
        'estimated_acquisition_year',
        'brand_model',
        'location',
        'serial_number',
        'qr_code',
        'with_warranty',
        'computer_name',
        'remarks',
        'condition',
        'image_file',
        'supplier_name',          // New field
        'invoice_number',         // New field
        'warranty_years',         // New field
        'last_inventory_count',   // New field
        'it_in_charge',           // New field
        'ticket_number',          // New field
        'reason_for_disposal',    // New field
    ];
    

    public function employeeAssignments()
{
    return $this->hasMany(DeviceAssignment::class);
}

}

