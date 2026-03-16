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
        Schema::create('pokemon_cards', function (Blueprint $table) {
            $table->string('card_id')->unique()->primary();
            $table->string('name');
            $table->string('type');
            $table->string('expansion_name');
            $table->integer('rarity');
            $table->string('weakness')->nullable();
            $table->json('skill')->nullable();
            $table->json('attacks');
            $table->integer('ps');
            $table->string('imgCard');


            $table->foreign('expansion_name')->references('expansion_name')->on('pokemon_expansions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pokemon_cards');
    }
};
