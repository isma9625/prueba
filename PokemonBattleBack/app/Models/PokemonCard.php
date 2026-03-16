<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 *  Modelo PokemonCard que representa una carta Pokémon.
 * 
 *  Usa 'card_id' como clave primaria string, sin timestamps ni auto-incremento.
 *  Casts para 'skill' y 'attacks' como arrays.
 *  
 *  Define relaciones con expansión, packs, inventario y barajas.
*/

class PokemonCard extends Model {
    use HasFactory;

    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'card_id';

    protected $fillable = [
        'card_id',
        'name',
        'type',
        'expansion_name',
        'rarity',
        'weakness',
        'skill',
        'attacks',
        'ps',
        'imgCard',
    ];

    protected $casts = [
        'skill' => 'array',
        'attacks' => 'array',
    ];

    
    // una carta pertenece a una expansión (uno a muchos)
    public function expansion(): BelongsTo {
        return $this->belongsTo(pokemonExpansion::class, 'expansion_name');
    }

    // Carta puede estar en muchos packs (relación muchos a muchos)
    public function packs() {
        return $this->BelongsToMany(pack::class, 'pack_pokemon_cards', 'card_id', 'packName');
    }

    // La carta puede estar en muchos inventarios
    public function inventory() {
        return $this->hasMany(inventory::class, 'card_id', 'card_id');
    }

    //  carta puede estar en varios decks
    public function decks() {
        return $this->belongsToMany(deck::class, 'deck_cards', 'card_id', 'deck_name', 'card_id', 'name')->withPivot('quantity');
    }
}
