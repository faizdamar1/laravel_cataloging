<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('item_details', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->nullable()->index();
            $table->string('description')->nullable();
            $table->foreignId('item_id')
                ->nullable()
                ->constrained('items')
                ->onDelete('cascade');

            $table->timestamps();
        });

        Schema::create('item_detail_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_detail_id')
                ->nullable()
                ->constrained('item_details')
                ->onDelete('cascade');

            $table->string('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_details');
    }
};
