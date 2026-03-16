<?php

use App\Http\Controllers\authController;
use App\Http\Controllers\deckController;
use App\Http\Controllers\inventoryController;
use App\Http\Controllers\packController;
use App\Http\Controllers\pokemonCardController;
use App\Http\Controllers\registroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas para autenticación: registro y manejo completo de recursos authapi
Route::resource('authapi', authController::class);
Route::post('authapi/login', [authController::class, 'login']); // Ruta para iniciar sesión

// Ruta para registro de usuarios
Route::post('registroapi', [registroController::class, 'store']); // Registrar nuevo usuario

// Rutas para cartas Pokémon
Route::resource('cartasapi', pokemonCardController::class);
Route::get('cartasapi', [pokemonCardController::class, 'index']); // Obtener todas las cartas
Route::get('tiposapi', [pokemonCardController::class, 'listarTipos']); // Listar tipos únicos de cartas
Route::get('tiposRareza', [pokemonCardController::class, 'listarRareza']); // Listar rarezas únicas
Route::get('expansionesNombre', [pokemonCardController::class, 'listarExpansiones']); // Listar expansiones

// Rutas protegidas con autenticación JWT (middleware auth:api)
Route::middleware('auth:api')->group(function () {
    
    // Listar todos los packs disponibles
    Route::get('packsapi', [PackController::class, 'listarPacks']);

    // Abrir un pack específico
    Route::get('abrirPack/{packName}', [PackController::class, 'abrirPack']);

    // Obtener cartas de un pack con precios
    Route::get('cartasPackConPrecio/{packName}', [PackController::class, 'cartasPorPackConPrecio']);

    // Comprar carta (en un pack)
    Route::post('comprarCarta', [PackController::class, 'comprarCarta']);

    // Obtener cartas del inventario de un usuario
    Route::get('cartasInventario/{userId}', [inventoryController::class, 'obtenerCartasUsuarios']);

    // Crear una nueva baraja para el usuario autenticado
    Route::post('crearBarajas', [deckController::class, 'crearBaraja']);

    // Obtener todas las barajas de un usuario
    Route::get('obtenerBarajas/{userId}', [deckController::class, 'obtenerBarajas']);

    // Agregar carta a una baraja existente
    Route::post('agregarCartaABaraja', [deckController::class, 'agregarCartaABaraja']);

    // Eliminar carta de una baraja
    Route::post('eliminarCarta', [deckController::class, 'eliminarCarta']);

    // Listar todas las cartas de una baraja específica
    Route::get('listarCartasBaraja/{deck_name}', [deckController::class, 'listarCartasBaraja']);

    // Eliminar una baraja completa
    Route::post('eliminarBaraja', [deckController::class, 'eliminarBaraja']);

    // Obtener puntos de un pack para un usuario
    Route::get('obtenerPuntosPack/{packName}/{user_id}', [packController::class, 'obtenerPuntosPack']);

    // Obtener información del usuario autenticado
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });
});

