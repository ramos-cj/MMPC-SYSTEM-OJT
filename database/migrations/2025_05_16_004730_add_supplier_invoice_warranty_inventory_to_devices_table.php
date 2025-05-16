<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSupplierInvoiceWarrantyInventoryToDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->string('supplier_name')->nullable();  // Supplier's name
            $table->string('invoice_number')->nullable(); // Invoice number
            $table->integer('warranty_years')->nullable(); // Warranty period (years)
            $table->date('last_inventory_count')->nullable(); // Last inventory count (calendar)
            $table->string('it_in_charge')->nullable();  // IT in-charge
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn('supplier_name');
            $table->dropColumn('invoice_number');
            $table->dropColumn('warranty_years');
            $table->dropColumn('last_inventory_count');
            $table->dropColumn('it_in_charge');
        });
    }
}
