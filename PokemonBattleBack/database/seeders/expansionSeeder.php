<?php

namespace Database\Seeders;
use App\Models\pokemonExpansion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class expansionSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // Datos de las expansiones
        $expansiones = [
            [
                'expansion_name' => 'Genes Formidables',
                'description' => 'Primera expansión con cartas poderosas.'
            ],
            [
                'expansion_name' => 'La Isla Singular',
                'description' => 'Segunda expansión con cartas míticas.'
            ]
            
        ];

        // Insertar las expansiones
        foreach ($expansiones as $expansionData) {
            PokemonExpansion::create($expansionData);
        }
    }
}

