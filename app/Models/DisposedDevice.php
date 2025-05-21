<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisposedDevice extends Model
{
    use HasFactory;

    protected $table = 'disposed_devices';

    protected $fillable = [
        'tag_no',
        'activation_updates',
        'brand_model',
        'accessories',
        'classification',
        'estimated_acquisition_year',
        'location',
        'serial_number',
        'qr_code',
        'with_warranty',
        'computer_name',
        'remarks',
        'assigned_to',
        'condition',
        'image_file',
        'need_to_be_repair',
        'supplier_name',
        'invoice_number',
        'warranty_years',
        'last_inventory_count',
        'it_in_charge',
        'ticket_number',
        'reason_for_disposal',
    ];
}
