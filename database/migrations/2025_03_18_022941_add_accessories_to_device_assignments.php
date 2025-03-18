<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            $table->text('accessories')->nullable()->after('serial_number'); // ✅ Add accessories column
        });
    }

    public function down()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            $table->dropColumn('accessories'); // Rollback column if needed
        });
    }
};
