<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDisposedDevicesTable extends Migration
{
    public function up()
    {
        Schema::create('disposed_devices', function (Blueprint $table) {
            $table->id();
            $table->string('tag_no');
            $table->string('activation_updates');
            $table->string('brand_model');
            $table->string('accessories')->nullable();
            $table->string('classification');
            $table->string('estimated_acquisition_year');
            $table->string('location');
            $table->string('serial_number')->unique();
            $table->string('qr_code');
            $table->string('with_warranty');
            $table->string('computer_name')->nullable();
            $table->string('remarks')->nullable();
            $table->string('assigned_to')->nullable();
            $table->string('condition');
            $table->string('image_file')->nullable();
            $table->string('need_to_be_repair')->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('warranty_years')->nullable();
            $table->date('last_inventory_count')->nullable();
            $table->string('it_in_charge')->nullable();
            $table->string('ticket_number')->nullable();
            $table->text('reason_for_disposal')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('disposed_devices');
    }
}
