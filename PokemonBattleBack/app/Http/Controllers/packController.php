<?php

namespace App\Http\Controllers;

use App\Models\inventory;
use App\Models\pack;
use App\Models\PokemonCard;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class packController extends Controller {
    // --------------------------------------------------------------------------------------
    // LISTAR PACKS
    // --------------------------------------------------------------------------------------

    /**
     *  Lista todos los packs que hay.
     *
     *  Recupera todos los registros de la tabla pack y transforma 
     *  la ruta de imagen de cada pack a una URL apra que se visualice en la vista.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con los packs, 
     *                                        incluyendo la URL completa de la imagen.
    */
    public function listarPacks() {
        $packs = pack::all()->map(function($pack) {
            $pack->imgPack = url($pack->imgPack); 
            return $pack;
        });
        return response()->json($packs);
    }


    // --------------------------------------------------------------------------------------
    // ABRIR PACK
    // --------------------------------------------------------------------------------------

    /**
     *  Abre un pack de cartas para el usuario autenticado.
     *
     *  Verifica si el usuario tiene permitido abrir más sobres diarios (son solo 2 al dia), obtiene el pack solicitado,
     *  determina aleatoriamente las cartas entregadas según la rareza,
     *  actualiza el inventario del usuario, suma puntos del pack, y devuelve las cartas obtenidas.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP, que incluye el token de autenticación del usuario.
     *  @param string $packName El nombre del pack que el usuario quiere abrir.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con:
     *     - isGoldPack : indica si el pack fue especial .
     *     - cartas : las cartas obtenidas, cada una con su imagen en URL completa.
     *     - packPoints : puntos actuales acumulados por el usuario para este pack.
     *     - user : objeto de usuario actualizado con puntos.
    */
    public function abrirPack(Request $request, $packName) {
        $userId = $request->user()->id;

        $user = User::find($userId); 

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 401);
        }

        if (!$this->verificarSobresDiarios($user)) {
            return response()->json(['error' => 'Has alcanzado el límite de sobres diarios'], 403);
        }

        $pack = Pack::where('packName', $packName)->firstOrFail();
        $cartas = $pack->cards;

        $isGoldPack = rand(1, 100) <= 2;


        //Porbabilidades de rarezas segun la posiciónn
        $probPorPosicion = [
            1 => [1 => 85, 2 => 12, 3 => 2, 4 => 0.7, 5 => 0.2, 6 => 0.08, 7 => 0.015, 8 => 0.005],
            2 => [1 => 80, 2 => 15, 3 => 3, 4 => 1, 5 => 0.4, 6 => 0.2, 7 => 0.05, 8 => 0.01],
            3 => [1 => 75, 2 => 17, 3 => 5, 4 => 1.5, 5 => 0.7, 6 => 0.3, 7 => 0.15, 8 => 0.05],
            4 => [1 => 70, 2 => 20, 3 => 6, 4 => 2, 5 => 1, 6 => 0.5, 7 => 0.2, 8 => 0.1],
            5 => [1 => 65, 2 => 20, 3 => 8, 4 => 3, 5 => 2, 6 => 1, 7 => 0.5, 8 => 0.2],
        ];

        $resultado = [];

        for ($i = 1; $i <= 5; $i++) {
            if ($isGoldPack) {
                $carta = $cartas->filter(fn($c) => $c->rarity >= 5)->random();
            } else {
                $raridad = $this->elegirRareza($probPorPosicion[$i]);
                $candidatas = $cartas->where('rarity', $raridad)->values();
                $carta = $candidatas->isNotEmpty() ? $candidatas->random() : $cartas->random();
            }

            $resultado[] = $carta;
        }

        // Actualiza inventario y inserta o incrementa la cantidad de cartas obtenidas
        foreach ($resultado as $carta) {
            DB::table('inventories')->upsert(
                [
                    [
                        'user_id' => $user->id,
                        'card_id' => $carta->card_id,
                        'quantity' => 1,
                    ]
                ],
                ['user_id', 'card_id'],
                ['quantity' => DB::raw('inventories.quantity + 1')] 
            );
        }

        $packPoints = $user->packPoints;

        if (!isset($packPoints[$packName])) {
            $packPoints[$packName] = 0;
        }

        // Sumar 5 puntos sin superar 5000
        $packPoints[$packName] = min($packPoints[$packName] + 5, 5000);

        $user->packPoints = $packPoints;
        $user->save();

        $puntosActuales = $packPoints[$packName];
        $maxPuntos = 5000;

        foreach ($resultado as $carta) {
            $carta->imgCard = url($carta->imgCard);
        }

        return response()->json([
            'isGoldPack' => $isGoldPack,
            'cartas' => $resultado,
            'packPoints' => $puntosActuales,
            'user'=>$user
        ]);
    }


    // --------------------------------------------------------------------------------------
    // VERIFICAR SOBRES DIARIOS
    // --------------------------------------------------------------------------------------

    /**
     *  Verifica si el usuario puede abrir más sobres en el día actual.
     *
     *  - Si el usuario no ha abierto sobres hoy, reinicia el contador diario.
     *  - Permite abrir hasta 2 sobres al día.
     *  - Incrementa el contador de sobres abiertos si aún está dentro del límite.
     *
     *  @param \App\Models\User $user El usuario autenticado al que se le  verifica el límite diario.
     *
     *  @return bool true si el usuario puede abrir un nuevo sobre, false si ya alcanzó el límite diario.
    */
    private function verificarSobresDiarios($user) {
        $hoy = now()->toDateString();

        // Si empieza un nuevo dia, reinicia el contador
        if($user->lastPackOpened != $hoy){
            $user-> lastPackOpened = $hoy;
            $user-> packsOpenedToday = 0;
        }

        // Verifica si alcanzo el límite diario
        if($user->packsOpenedToday>= 2) {
            return false;
        }

        //Incrementa contador
        $user -> packsOpenedToday++;
        $user-> save();

        return true;
    }


    // --------------------------------------------------------------------------------------
    // ELEGIR RAREZA
    // --------------------------------------------------------------------------------------
    

    /**
     * Elige una rareza aleatoria basada en un conjunto de probabilidades acumuladas.
     *
     * Genera un número aleatorio entre 1 y 100 y selecciona la rareza que le toca
     * según el rango en el que cae el número.
     *
     * @param array<int, float> $probabilidades Un array asociativo donde la clave representa el nivel de rareza
     *                                          y el valor es la probabilidad de que esa rareza sea elegida.
     *                                       
     *
     * @return int|null El nivel de rareza seleccionado, o null si ninguna coincide (no debería ocurrir si la suma es 100).
     */
    public function elegirRareza($probabilidades) {
        $rand = mt_rand(1, 100);

        $acumulado= 0;

        foreach ($probabilidades as $rareza => $probabilidad) {
            $acumulado += $probabilidad;

            if ($rand <= $acumulado) {
                return $rareza;
            }
        }
    }


    // --------------------------------------------------------------------------------------
    // CARTAS POR PACK CON PRECIO
    // --------------------------------------------------------------------------------------


    /**
     * Obtiene todas las cartas asociadas a un pack, incluyendo su precio segun la rareza.
     *
     * - Recupera el pack especificado por su nombre.
     * - Asocia a cada carta su URL de imagen, su precio según rareza, y el nombre del pack.
     *
     * @param string $packName Nombre del pack del cual se listaran las cartas.
     *
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con las cartas del pack,
     *                                       cada una con imagen, precio y nombre del pack.
     */
    public function cartasPorPackConPrecio($packName) {
        $pack = Pack::where('packName', $packName)->firstOrFail();
        $cartas = $pack->cards;

        // Precios por rareza
        $precios = [
            1 => 35,
            2 => 70,
            3 => 150,
            4 => 500,
            5 => 400,
            6 => 1250,
            7 => 1500,
            8 => 2500,
        ];


         // Asociar cartas con URL de imagen, precio y nombre del pack
        $cartas = $cartas->map(function ($carta) use ($precios, $packName) {
            $carta->imgCard = url($carta->imgCard);
            $carta->precio = isset($precios[$carta->rarity]) ? $precios[$carta->rarity] : 0;
            $carta->packName = $packName;
            return $carta;
        });

        return response()->json($cartas);
    }


    // --------------------------------------------------------------------------------------
    // COMPRAR CARTA
    // --------------------------------------------------------------------------------------


    /**
     * Permite a un usuario comprar una carta utilizando puntos conseguidos  de un pack abierto por el usuario.
     *
     * - Verifica que la carta y el pack existan.
     * - Calcula el precio basado en la rareza de la carta.
     * - Verifica que el usuario tenga suficientes puntos del pack elegido.
     * - Descuenta los puntos y añade la carta al inventario.
     *
     * @param \Illuminate\Http\Request $request La solicitud que contiene los datos de compra:
     *        - card_id: ID de la carta a comprar.
     *        - packName: Nombre del pack del que se descuentan los puntos.
     *
     * @return \Illuminate\Http\JsonResponse Respuesta JSON indicando éxito o error, y los puntos restantes.
     */
    public function comprarCarta(Request $request) {

        // Valida que la carta y el pack existan
        $request->validate([
            'card_id' => 'required|exists:pokemon_cards,card_id',
            'packName' => 'required|exists:packs,packName'
        ]);

        $userId = $request->user()->id;
        $cardId = $request->input('card_id');
        $packName = $request->input('packName');

        $user = User::findOrFail($userId);
        $carta = PokemonCard::findOrFail($cardId);

        //Precios por rareza
        $precios = [
            1 => 35,
            2 => 70,
            3 => 150,
            4 => 500,
            5 => 400,
            6 => 1250,
            7 => 1500,
            8 => 2500,
        ];

        $precio = isset($precios[$carta->rarity]) ? $precios[$carta->rarity] : 0;

        // Obtener y preparar puntos del pack
        $packPoints = $user->packPoints;
        if (!isset($packPoints) || !is_array($packPoints)) {
            $packPoints = [];
        }

        if (!isset($packPoints[$packName])) {
            $packPoints[$packName] = 0;
        }

        // Verifica si el usuario tiene puntos suficientes
        if ($packPoints[$packName] < $precio) {
            return response()->json(['error' => 'No tienes suficientes puntos'], 403);
        }

        // Resta puntos al hacer una compra
        $packPoints[$packName] -= $precio;
        $user->packPoints = $packPoints;
        $user->save();

        // Añade carta al inventario o aumenta cantidad
        DB::table('inventories')->upsert(
            [
                [
                    'user_id' => $userId,
                    'card_id' => $cardId,
                    'quantity' => 1,
                ]
            ],
            ['user_id', 'card_id'],
            ['quantity' => DB::raw('quantity + 1')]
        );
        
        return response()->json([
            'success' => 'Carta comprada correctamente',
            'newPoints' => $packPoints[$packName]
        ]);
    }


    // --------------------------------------------------------------------------------------
    // OBTENER PUNTOS PACK
    // --------------------------------------------------------------------------------------

    /**
     * Devuelve la cantidad de puntos acumulados por un usuario para un pack específico.
     *
     * - Busca al usuario por ID.
     * - Verifica si el usuario tiene puntos  para el pack indicado.
     * - Si no existen puntos, devuelve 0.
     *
     * @param string $packName Nombre del pack  del cual se quieren consultar los puntos.
     * @param int $userId ID del usuario al que se le van a consultar los puntos.
     *
     * @return \Illuminate\Http\JsonResponse Respuesta JSON con la cantidad de puntos del pack.
     */
    public function obtenerPuntosPack($packName, $userId) {
        $user = User::findOrFail($userId);

        // Obtener los puntos del pack, o 0 si no tiene
        if (isset($user->packPoints[$packName])) {
            $puntos = $user->packPoints[$packName];
        } else {
            $puntos = 0;
        }

        return response()->json(['packPoints' => $puntos]);
    }
}
