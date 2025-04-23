<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('device_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('device_id');
            $table->unsignedBigInteger('employee_id');
            $table->string('employee_name');
            $table->string('classification');
            $table->string('brand_model');
            $table->string('serial_number');
            $table->string('device_remarks');
            $table->timestamps();

            // Foreign key relationships
            $table->foreign('device_id')->references('id')->on('devices')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('device_assignments');
    }
};
