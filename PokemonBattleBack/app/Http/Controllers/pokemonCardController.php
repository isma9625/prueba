<?php

namespace App\Http\Controllers;

use App\Models\PokemonCard;
use App\Models\pokemonExpansion;
use Illuminate\Http\Request;

class pokemonCardController extends Controller {
    // --------------------------------------------------------------------------------------
    // LISTAR (INDEX)
    // --------------------------------------------------------------------------------------

    /**
     *  Obtiene todas las cartas Pokémon disponibles en la base de datos,
     *  y convierte la ruta relativa de la imagen en una URL completa accesible desde el navegador.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con la lista de cartas Pokémon,
     *         cada una con la URL completa de su imagen.
    */
    public function index() {
        $cards = PokemonCard::all()->map(function($card) {
            $card->imgCard = url($card->imgCard); 
            return $card;
        });

        return response()->json($cards);
    }


    // --------------------------------------------------------------------------------------
    // LISTAR CARTAS POR TIPOS
    // --------------------------------------------------------------------------------------


    /**
     *  Obtiene la lista de tipos  de cartas Pokémon disponibles en la base de datos.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con un arreglo de tipos únicos.
    */
    public function listarTipos() {

        // Obtener todos los tipos distintos de cartas
        $types = PokemonCard::select('type')->distinct()->pluck('type'); 
        return response()->json($types);
    }


    // --------------------------------------------------------------------------------------
    // LISTAR CARTAS POR RAREZA
    // --------------------------------------------------------------------------------------

    /**
     *  Obtiene la lista de rarezas  de cartas Pokémon disponibles en la base de datos.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con un arreglo de rarezas.
    */
    public function listarRareza() {
        $rarity = PokemonCard::select('rarity')->distinct()->pluck('rarity');
        return response()->json($rarity);
    }


    // --------------------------------------------------------------------------------------
    // LISTAR CARTAS POR EXPANSIÓN A LA QUE PERTENECEN
    // --------------------------------------------------------------------------------------

    /**
     *  Obtiene la lista de nombres de expansiones de cartas Pokémon disponibles.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con un arreglo de nombres de expansiones .
    */
    public function listarExpansiones() {
        $expansiones = pokemonExpansion::select('expansion_name')->distinct()->pluck('expansion_name');
        return response()->json($expansiones);
    }
}
