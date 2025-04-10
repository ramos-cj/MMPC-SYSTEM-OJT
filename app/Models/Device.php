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
        'accessories',
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
    ];
}
