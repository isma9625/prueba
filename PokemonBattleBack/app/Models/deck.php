<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *  Modelo Deck que representa una baraja.
 *
 *  Usa 'name' como clave primaria string, sin auto-incremento ni timestamps.
 *  
 *  Relación muchos a muchos con cartas (PokemonCard) y pertenece a un usuario.
*/

class deck extends Model {
    protected $primaryKey = 'name';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['name', 'user_id', 'card_limit'];


    
    public function cards() {
        return $this->belongsToMany(PokemonCard::class,'deck_cards', 'deck_name', 'card_id', 'name', 'card_id' )->withPivot('quantity');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
