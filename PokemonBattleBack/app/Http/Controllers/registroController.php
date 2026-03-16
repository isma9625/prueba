<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class registroController extends Controller {
    // --------------------------------------------------------------------------------------
    // VALIDAR FORMULARIOS
    // --------------------------------------------------------------------------------------

    /**
     *  Registra un nuevo usuario en la aplicación.
     *
     *  Valida los datos enviados en la solicitud, asegurando que el nombre, email y contraseña
     *  cumplan con los requisitos, incluyendo que el email sea único.
     *
     *  @param \Illuminate\Http\Request $request La solicitud HTTP que contiene:
     *        - name: string requerido, mínimo 3 caracteres.
     *        - email: string requerido, formato válido y único en la tabla users.
     *        - password: string requerido, mínimo 3 caracteres.
     *
     *  @return \Illuminate\Http\JsonResponse Respuesta JSON indicando éxito o errores de validación,
     *         junto con los datos del usuario creado.
    */
    public function store(Request $request) {
        // Validar los datos del formulario
        $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:3',
        ], [
            'name.required' => 'El campo nombre es requerido.',
            'name.string' => 'El nombre debe ser un texto válido.',
            'email.required' => 'El campo email es requerido.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'El email ya está registrado.',
            'password.required' => 'El campo password es requerido.',
            'password.string' => 'La contraseña debe ser un texto válido.',
        ]);

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'pointsUser' => 0, 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente.',
            'user' => $user
        ]);
    }
}
