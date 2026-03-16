<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class authController extends Controller {
    /**
     *  Esta función maneja el inicio de sesión del usuario.
     *
     *  Valida las credenciales (email y contraseña), 
     *  intenta autenticar al usuario y, si tiene éxito, crea un token JWT.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los datos de inicio de sesión.
     * 
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON con el estado de autenticación:
     *                                      - Éxito: incluye el token y los datos del usuario.
     *                                      - Error: incluye mensaje de error y detalles de validación si corresponde.
    */
    public function login(Request $request) {
        // Validación de los datos
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Obtener solo email y password del request
        $credentials = $request->only('email', 'password');

        // Intentar autenticar al usuario con JWT
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Retornar token y datos del usuario autenticado
        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => JWTAuth::user()
        ]);
    }
}
