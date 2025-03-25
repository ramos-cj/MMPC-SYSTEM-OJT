<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            $table->string('computer_name')->nullable()->after('serial_number');
        });
    }

    public function down()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            $table->dropColumn('computer_name');
        });
    }
};
