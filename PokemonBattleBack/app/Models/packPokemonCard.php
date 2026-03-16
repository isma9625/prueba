<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *  Modelo packPokemonCard que representa la tabla pivot entre packs y cartas Pokémon.
 *  Sin timestamps.
*/

class packPokemonCard extends Model {
    public $timestamps = false;
}
