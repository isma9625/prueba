<?php

namespace Database\Seeders;

use App\Models\pack;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 *  Seeder para insertar datos iniciales de packs (sobres) Pokémon.
 *  Crea varios packs relacionados con sus expansiones y con imagen.
*/

class packsSeeder extends Seeder {
    /**
     * Run the database seeds.
    */
    public function run(): void {
        $packs = [
            [
                'packName' => 'Charizard',
                'description' => 'Primer sobre de la expansion Genes Formidables.',
                'expansion_name' => 'Genes Formidables',
                'imgPack' => '/img/sobres/sobreCharizard.png',

            ],
            [
                'packName' => 'Mewtwo',
                'description' => 'Segundo sobre de la expansion Genes Formidables.',
                'expansion_name' => 'Genes Formidables',
                'imgPack' => '/img/sobres/sobreMewtwo.png',
            ],
            [
                'packName' => 'Pikachu',
                'description' => 'Tercer sobre de la expansion Genes Formidables.',
                'expansion_name' => 'Genes Formidables',
                'imgPack' => '/img/sobres/sobrePikachu.png'
            ],
            [
                'packName' => 'laIslaSingular',
                'description' => 'Sobre de la expansion La Isla Singular.',
                'expansion_name' => 'La Isla Singular',
                'imgPack' => '/img/sobres/sobreLaIslaSingular.png',
            ],
            
        ];

        // Insertar los packs
        foreach ($packs as $pack) {
            Pack::firstOrCreate(
                ['packName' => $pack['packName']],
                $pack
            );
        }
    }
}
