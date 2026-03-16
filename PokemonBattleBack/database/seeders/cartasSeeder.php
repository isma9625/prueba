<?php

namespace Database\Seeders;

use App\Models\pack;
use App\Models\PokemonCard;
use Illuminate\Database\Seeder;

class cartasSeeder extends Seeder {
    /**
     * Función para obtener la ruta base según la expansión.
     */
    private function getImageBasePath(string $packName, string $expansionName): string {
        $folder = strtolower($packName);

        // Decidir la ruta base según la expansión
        if ($expansionName === 'La Isla Singular') {
            return "/img/mythicalIsland/{$folder}/"; // Ruta para Mythical Island
        }

        // Por defecto usamos genesFormidables
        return "/img/genesFormidables/{$folder}/"; // Ruta por defecto
    }

    /**
     * Run the database seeds.
     */
    public function run(): void {
        $jsonPath = database_path('data/cartasPokemon.json');

        if (!file_exists($jsonPath)) {
            $this->command->error("Archivo JSON no encontrado: $jsonPath");
            return;
        }

        $cards = json_decode(file_get_contents($jsonPath), true);

        foreach ($cards as $card) {
            // Asegurar que 'packName' sea un array
            $packNames = is_array($card['packName']) ? $card['packName'] : [$card['packName']];

            // Asegurar que 'skill' sea un array
            if (!isset($card['skill'])) {
                $card['skill'] = [];
            }

            // Usar la función para obtener la ruta base según el primer pack y expansión
            $firstPackName = $packNames[0];
            $basePath = $this->getImageBasePath($firstPackName, $card['expansion_name']);

            // Hacemos una copia de la carta para no alterar el original
            $cardCopy = $card;
            $cardCopy['imgCard'] = $basePath . $card['imgFile'];
            unset($cardCopy['imgFile'], $cardCopy['packName']);

            // Insertar la carta
            $pokemonCard = PokemonCard::firstOrCreate(
                ['card_id' => $cardCopy['card_id']],
                $cardCopy
            );

            // Asociar packs con la carta
            foreach ($packNames as $packName) {
                $pack = pack::firstOrCreate([
                    'packName' => $packName,
                    'expansion_name' => $card['expansion_name'],
                ], [
                    'description' => $packName // o alguna descripción por defecto
                ]);

                // Asociamos sin duplicar
                $pokemonCard->packs()->syncWithoutDetaching([$pack->packName]);
            }
        }
    }
}
