<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *  Modelo Pack que representa un paquete de cartas Pokémon.
 *  Usa 'packName' como clave primaria string, sin timestamps ni auto-incremento.
 *  
 *  Relación muchos a muchos con cartas Pokémon.
*/

class pack extends Model {
    public $timestamps = false;
    protected $primaryKey = 'packName';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'packName',
        'description',
        'expansion_name',
        'imgPack'

    ];

    public function cards() {
        return $this->belongsToMany(PokemonCard::class, 'pack_pokemon_cards', 'packName', 'card_id', 'packName', 'card_id');

    }
}
