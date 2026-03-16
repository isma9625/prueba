<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 *  Modelo Inventory que representa el inventario de cartas de un usuario.
 *  Sin timestamps y clave primaria no auto-incrementable.
 *  
 *  Relación con usuario y carta Pokémon y sirve como tabla pivote.
*/

class inventory extends Model {
    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'card_id',
        'quantity',
    ];

    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    //Un inventario puede tener muchas cartas
    public function pokemonCard(): BelongsTo {
        return $this->belongsTo(PokemonCard::class, 'card_id', 'card_id');
    }
}
