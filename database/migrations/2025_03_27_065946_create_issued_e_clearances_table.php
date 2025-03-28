<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('issued_eclearance', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('employee_number');
            $table->string('first_name');
            $table->string('middle_initial')->nullable();
            $table->string('last_name');
            $table->string('position');
            $table->string('division_department');
            $table->string('division_code');
            $table->string('department_code');
            $table->string('section_code');
            $table->string('employee_type');
            $table->date('effectivity_date')->nullable();
            $table->string('advise_of_hr')->nullable();
            $table->string('wisedit_deactivation')->nullable();
            $table->string('wiseda_exit_clearance')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('employee_id')->on('employees')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('issued_eclearance');
    }
};
