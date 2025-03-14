<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('device_assignments', function (Blueprint $table) {
        $table->string('previous_assignee')->nullable();
        $table->date('transferred_date')->nullable();
    });
}

public function down()
{
    Schema::table('device_assignments', function (Blueprint $table) {
        $table->dropColumn(['previous_assignee', 'transferred_date']);
    });
}

};
