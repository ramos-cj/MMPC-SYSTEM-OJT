<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('tag_no')->unique();
            $table->string('pi_guard');
            $table->string('general_name');
            $table->string('activation_updates');
            $table->string('brand_name');
            $table->string('accessories')->nullable();
            $table->string('classification');
            $table->string('estimated_acquisition_year');
            $table->string('model');
            $table->string('location');
            $table->string('serial_number')->unique();
            $table->string('qr_code');
            $table->string('property_tag')->nullable();
            $table->string('with_warranty');
            $table->string('computer_name')->nullable();
            $table->text('remarks')->nullable();
            $table->string('condition')->default('Good'); // Ensures default value
            $table->string('image_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
