<?php

namespace App\Http\Controllers;

use App\Models\inventory;
use App\Models\deck;
use Illuminate\Http\Request;

class deckController extends Controller {
    // --------------------------------------------------------------------------------------
    // CREAR BARAJA
    // --------------------------------------------------------------------------------------

    /**
     *  Crea una nueva baraja para el usuario autenticado.
     *
     *  Valida los datos recibidos, asegurando que se proporcione un nombre válido 
     *  y que el ID del usuario exista. Luego, crea una nueva baraja al usuario autenticado.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP con los datos para crear la baraja.
     *        - name: string requerido, nombre de la baraja.
     *        - user_id: integer requerido, debe existir en la tabla 'users'.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con los datos de la baraja creada.
    */
    public function crearBaraja(Request $request) {
        $request->validate([
            'name' => 'required|string|max:50',
            'user_id' => 'required|integer|exists:users,id'
        ]);

        // Crear la baraja
        $deck = deck::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
        ]);

        return response()->json($deck);
    }


    // --------------------------------------------------------------------------------------
    // OBTENER BARAJAS
    // --------------------------------------------------------------------------------------

    /**
     *  Obtiene todas las barajas de un usuario específico, incluyendo sus cartas,
     *  y agrega una imagen representativa aleatoria de una carta si la baraja no está vacía.
     *
     *  @param int $userId El ID del usuario cuyas barajas se quieren obtener.
     * 
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con la lista de barajas,
     *         cada una incluyendo una imagen aleatoria de una de sus cartas (si tiene).
    */
    public function obtenerBarajas($userId) {
        $barajas = deck::with('cards')->where('user_id', $userId)->get();

        $barajasConImagen = $barajas->map(function ($baraja) {
            $cartas = $baraja->cards;

            if ($cartas->isNotEmpty()) {
                $randomCard = $cartas->random();
                $baraja->img = url($randomCard->imgCard);
            } else {
                $baraja->img = null;
            }

            return $baraja;
        });

        return response()->json($barajasConImagen);
    }


    // --------------------------------------------------------------------------------------
    // AGREGAR CARTAS A BARAJAS
    // --------------------------------------------------------------------------------------

    /**
     *  Agrega una carta a una baraja específica del usuario.
     *
     *  Realiza validaciones para asegurar que:
     *  - El nombre de la baraja y el ID de la carta existan.
     *  - No se exceda el límite de 2 copias por carta en la baraja.
     *  - No se exceda el límite total de 10 cartas por baraja.
     *  - El usuario tenga suficientes copias de la carta en su inventario.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP que contiene:
     *        - deck_name: string requerido, nombre de la baraja.
     *        - card_id: string requerido, identificador único de la carta (debe existir en la base de datos).
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON indicando el resultado del proceso:
     *         - Éxito: mensaje de confirmación.
     *         - Error: mensaje explicando el motivo (límite excedido, sin inventario, etc).
    */
    public function agregarCartaABaraja(Request $request) {
        $request->validate([
            'deck_name' => 'required|exists:decks,name',
            'card_id' => 'required|exists:pokemon_cards,card_id'
        ]);

        // Obtener la baraja
        $deck = deck::where('name', $request->deck_name)->first();

        // Verificar si la carta ya está en la baraja
        $cantidadActual = $deck->cards()->where('deck_cards.card_id', $request->card_id)->sum('quantity');
        if ($cantidadActual >= 2) {
            return response()->json(['error' => 'No se pueden agregar más de dos cartas iguales a la baraja'], 400);
        }

        // Verificar si la baraja ya tiene 10 cartas
        $totalCartas = $deck->cards()->sum('quantity');
        if ($totalCartas >= 10) {
            return response()->json(['error' => 'La baraja ya tiene 10 cartas. No se pueden agregar más.'], 400);
        }

        $userId = $deck->user_id;
        $inventario = inventory::where('user_id', $userId)
            ->where('card_id', $request->card_id)
            ->first();

        if (!$inventario || $inventario->quantity <= $cantidadActual) {
            return response()->json(['error' => 'No tienes suficientes copias de esta carta en el inventario'], 400);
        }

        // Si la carta ya existe, solo aumentamos la cantidad
        $card = $deck->cards()->where('deck_cards.card_id', $request->card_id)->first();

        if ($card) {
            $deck->cards()->updateExistingPivot($request->card_id, [
                'quantity' => $card->pivot->quantity + 1
            ]);
        } else {
            // Si la carta no existe, la agregamos a la baraja
            $deck->cards()->attach($request->card_id, ['quantity' => 1]);
        }

        return response()->json(['message' => 'Carta agregada correctamente']);
    }


    // --------------------------------------------------------------------------------------
    // ELIMINAR CARTA
    // --------------------------------------------------------------------------------------

    /**
     *  Elimina una carta de una baraja. Si hay más de una copia, reduce la cantidad en 1;
     *  si solo hay una, la elimina completamente de la baraja.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP que debe incluir:
     *        - deck_name: string requerido, nombre de la baraja.
     *        - card_id: string requerido, identificador único de la carta.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON indicando el resultado:
     *         - Éxito: mensaje de eliminación.
     *         - Error: si la carta no está en la baraja.
    */
    public function eliminarCarta(Request $request) {
        $request->validate([
            'deck_name' => 'required|exists:decks,name',
            'card_id' => 'required|exists:pokemon_cards,card_id'
        ]);

        $deck = deck::where('name', $request->deck_name)->first();

        $card = $deck->cards()->where('deck_cards.card_id', $request->card_id)->first();

        if (!$card) {
            return response()->json(['error' => 'La carta no está en la baraja'], 404);
        }

        $cantidadActual = $card->pivot->quantity;

        // Se hace para que se elimine la cantidad si eliminas una carta que tiene otra igual en la baraja
        if ($cantidadActual > 1) {
            $deck->cards()->updateExistingPivot($request->card_id, [ // updateExistingPivot modifica una relación existente
                'quantity' => $cantidadActual - 1
            ]);
        } else {
            $deck->cards()->detach($request->card_id);
        }

        return response()->json(['message' => 'Carta eliminada correctamente']);
    }


    // --------------------------------------------------------------------------------------
    // LISTAR LAS CARTAS DE BARAJAS
    // --------------------------------------------------------------------------------------

    /**
     *  Lista todas las cartas de una baraja, repitiendo cada carta tantas veces como cantidad tenga.
     *
     *  Esto es útil si se desea visualizar una "lista completa" con repeticiones reales,
     *  por ejemplo, para mostrar las cartas en una vista como si fueran físicas.
     *
     *  @param string $deckName El nombre de la baraja a consultar.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con todas las cartas (repetidas según cantidad),
     *         o mensaje de error si la baraja no existe.
    */
    public function listarCartasBaraja($deckName) {
        $deck = deck::where('name', $deckName)->first();
        
        if (!$deck) {
            return response()->json(['error' => 'Baraja no encontrada'], 404);
        }

        $cartasConCantidad = [];
        foreach ($deck->cards as $carta) {
            $cantidad = $carta->pivot->quantity;
            for ($i = 0; $i < $cantidad; $i++) {
                $cartaArray = $carta->toArray();
                $cartaArray['imgCard'] = url($carta->imgCard);
                $cartasConCantidad[] = $cartaArray;
            }
        }

        return response()->json($cartasConCantidad);
    }


    // --------------------------------------------------------------------------------------
    // ELIMINAR BARAJA
    // --------------------------------------------------------------------------------------

    /**
     *  Elimina una baraja y sus relaciones con cartas.
     *
     *  Valida que el nombre de la baraja exista, luego elimina las relaciones 
     *  con las cartas asociadas y finalmente elimina la baraja.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP que debe incluir:
     *        - deck_name: string requerido, nombre de la baraja a eliminar.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con mensaje de éxito
     *         o error si la baraja no se encuentra.
    */
    public function eliminarBaraja(Request $request) {
        $request->validate([
            'deck_name' => 'required|exists:decks,name'
        ]);

        $deck = deck::find($request->deck_name);

        if (!$deck) {
            return response()->json(['error' => 'Baraja no encontrada'], 404);
        }

        $deck->cards()->detach(); 
        $deck->delete(); 

        return response()->json(['message' => 'Baraja eliminada correctamente']);
    }
}
