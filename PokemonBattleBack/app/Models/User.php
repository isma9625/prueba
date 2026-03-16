<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 *  Modelo User para usuarios autenticables con JWT.
 *  Oculta password y remember_token.
 *  Castea packPoints como array y password como hashed.
 *  
 *  Relación uno a uno con inventario.
*/

class User extends Authenticatable implements JWTSubject {
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'packPoints' => 'array',
    ];

    // Devuelve el identificador único para el token JWT
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //un usuario puede tener un inventario
    public function inventory() {
        return $this->hasMany(inventory::class);
    }
}


