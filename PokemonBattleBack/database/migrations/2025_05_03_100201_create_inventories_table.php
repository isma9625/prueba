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
        Schema::create('inventories', function (Blueprint $table) {
        
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->string('card_id');
            $table->foreign('card_id')->references('card_id')->on('pokemon_cards')->onDelete('cascade');

            $table-> integer('quantity')->default(0);
            
            $table->primary(['user_id', 'card_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
