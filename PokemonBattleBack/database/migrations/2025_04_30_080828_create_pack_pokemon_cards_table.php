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
        Schema::create('pack_pokemon_cards', function (Blueprint $table) {
            $table->string('card_id');
            $table->string('packName'); // nombre debe coincidir con el nombre exacto del campo clave primaria
        
            $table->foreign('card_id')->references('card_id')->on('pokemon_cards')->onDelete('cascade');
        
            $table->foreign('packName')->references('packName')->on('packs')->onDelete('cascade');
        
            $table->primary(['card_id', 'packName']);
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pack_pokemon_cards');
    }
};
