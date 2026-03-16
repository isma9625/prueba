<?php

namespace App\Http\Controllers;

use App\Models\inventory;
use Illuminate\Http\Request;

class inventoryController extends Controller {
    // --------------------------------------------------------------------------------------
    // OBTENER CARTAS DEL USUARIO
    // --------------------------------------------------------------------------------------

    /**
     *  Obtiene todas las cartas asociadas a un usuario desde su inventario.
     *
     *  Carga las cartas del inventario del usuario 
     *  y devuelve una colección de cartas, incluyendo la URL completa de la imagen.
     *
     *  @param int $userId El ID del usuario del que se quiere obtener las cartas.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con las cartas del usuario.
    */
    public function obtenerCartasUsuarios($userId) {
        $inventario = inventory::with('pokemonCard')->where('user_id', $userId)->get();

        $cartas = $inventario->map(function ($item) {
            $carta = $item->pokemonCard;
            if ($carta) {
                $carta->imgCard = url($carta->imgCard);
                return $carta;
            }
        });

        return response()->json($cartas->values());
    }
}
