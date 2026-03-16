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
        Schema::create('packs', function (Blueprint $table) {
            
            $table->string('packName')->primary();
            $table->string('description');
            $table->string('expansion_name');
            $table->string('imgPack');

            $table->foreign('expansion_name')->references('expansion_name')->on('pokemon_expansions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs');
    }
};
