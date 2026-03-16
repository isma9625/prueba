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
        Schema::create('deck_cards', function (Blueprint $table) {
            $table->string('deck_name');
            $table->string('card_id');
            $table->integer('quantity')->default(1);

            $table->foreign('deck_name')->references('name')->on('decks')->onDelete('cascade');
            $table->foreign('card_id')->references('card_id')->on('pokemon_cards')->onDelete('cascade');

            $table->primary(['deck_name', 'card_id']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deck_cards');
    }
};
