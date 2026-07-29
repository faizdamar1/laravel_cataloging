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
        Schema::create('master_area_names', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_area_id')
                ->constrained('master_areas')
                ->cascadeOnDelete();

            $table->foreignId('master_name_id')
                ->constrained('master_names')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'master_area_id',
                'master_name_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_area_names');
    }
};
