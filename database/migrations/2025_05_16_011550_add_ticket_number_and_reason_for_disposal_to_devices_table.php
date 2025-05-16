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
    Schema::table('devices', function (Blueprint $table) {
        $table->string('ticket_number')->nullable();
        $table->text('reason_for_disposal')->nullable();
    });
}

public function down()
{
    Schema::table('devices', function (Blueprint $table) {
        $table->dropColumn('ticket_number');
        $table->dropColumn('reason_for_disposal');
    });
}

};
