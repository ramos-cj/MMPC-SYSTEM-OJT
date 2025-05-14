<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('issued_eclearance', function (Blueprint $table) {
            $table->text('assigned_devices')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('issued_eclearance', function (Blueprint $table) {
            $table->dropColumn('assigned_devices');
        });
    }
};
