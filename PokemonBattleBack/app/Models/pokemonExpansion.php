<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 *  Modelo pokemonExpansion que representa una expansión de cartas Pokémon.
 * 
 *  Usa 'expansion_name' como clave primaria string, sin timestamps.
 *  Tiene una relación uno a muchos con las cartas Pokémon.
*/

class pokemonExpansion extends Model {
    protected $primaryKey = 'expansion_name';
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'expansion_name',
        'description',
    ];

    /**
     *  Relación uno a muchos con `pokemonCards`.
     *  Una expansion puede tener muchas cartas.
    */
    public function cards(): HasMany {
        return $this->hasMany(PokemonCard::class, 'expansion_name');
    }
}
