<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'tag_no',
        'pi_guard',
        'general_name',
        'activation_updates',
        'brand_name',
        'accessories',
        'classification',
        'estimated_acquisition_year',
        'model',
        'location',
        'serial_number',
        'qr_code',
        'property_tag',
        'with_warranty',
        'computer_name',
        'remarks',
        'condition', // New condition field
        'image_file',
    ];
}
