<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingColumnsToDeviceAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            $table->string('qr_code')->nullable();
            $table->string('with_warranty')->nullable();
            $table->string('remarks')->nullable();
            $table->string('assigned_to')->nullable();
            $table->string('condition')->nullable();
            $table->string('image_file')->nullable();
            $table->string('need_to_be_repair')->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('warranty_years')->nullable();
            $table->date('last_inventory_count')->nullable();
            $table->string('it_in_charge')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('device_assignments', function (Blueprint $table) {
            // Drop the added columns if the migration is rolled back
            $table->dropColumn([
                'qr_code',
                'with_warranty',
                'remarks',
                'assigned_to',
                'condition',
                'image_file',
                'need_to_be_repair',
                'supplier_name',
                'invoice_number',
                'warranty_years',
                'last_inventory_count',
                'it_in_charge',
            ]);
        });
    }
}
