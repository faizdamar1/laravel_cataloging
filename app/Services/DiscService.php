<?php

namespace App\Services;

use App\Models\DISC_Pattern;
use App\Models\DISC_Result;

class DiscService
{
    public function getDISCResults(array $rawScores, int $line)
    {
        return [
            'D' => DISC_Result::where('line', $line)
                ->where('value', $rawScores['D'][$line] ?? 0)
                ->value('d') ?? 0,

            'I' => DISC_Result::where('line', $line)
                ->where('value', $rawScores['I'][$line] ?? 0)
                ->value('i') ?? 0,

            'S' => DISC_Result::where('line', $line)
                ->where('value', $rawScores['S'][$line] ?? 0)
                ->value('s') ?? 0,

            'C' => DISC_Result::where('line', $line)
                ->where('value', $rawScores['C'][$line] ?? 0)
                ->value('c') ?? 0,
        ];
    }

    public function buildResultArray(array $scores): array
    {
        return [
            'D' => [1 => $scores['D'] ?? 0],
            'I' => [1 => $scores['I'] ?? 0],
            'S' => [1 => $scores['S'] ?? 0],
            'C' => [1 => $scores['C'] ?? 0],
        ];
    }

    public function getPattern(array $rawScores, int $line)
    {
        $disc = $this->getDISCResults($rawScores, $line);

        $D = $disc['D'];
        $I = $disc['I'];
        $S = $disc['S'];
        $C = $disc['C'];

        $pattern = $this->resolvePattern($D, $I, $S, $C);

        $patternData = DISC_Pattern::find($pattern);

        return [
            'graph' => $disc,
            'pattern' => $patternData,
        ];
    }

    private function resolvePattern($D, $I, $S, $C)
    {
        if ($D <= 0 && $I <= 0 && $S <= 0 && $C > 0) {
            return 1;
        } elseif ($D > 0 && $I <= 0 && $S <= 0 && $C <= 0) {
            return 2;
        } elseif ($D > 0 && $I <= 0 && $S <= 0 && $C > 0 && $C >= $D) {
            return 3;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C <= 0 && $I >= $D) {
            return 4;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $I >= $D && $D >= $C) {
            return 5;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $I >= $D && $D >= $S) {
            return 6;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $I >= $S && $S >= $D) {
            return 7;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $S >= $D && $D >= $C) {
            return 8;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C <= 0 && $D >= $I) {
            return 9;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $D >= $I && $I >= $S) {
            return 10;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C <= 0 && $D >= $S) {
            return 11;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $C >= $I && $I >= $S) {
            return 12;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $C >= $S && $S >= $I) {
            return 13;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $I >= $S && $I >= $C) {
            return 14;
        } elseif ($D <= 0 && $I <= 0 && $S > 0 && $C <= 0) {
            return 15;
        } elseif ($D <= 0 && $I <= 0 && $S > 0 && $C > 0 && $C >= $S) {
            return 16;
        } elseif ($D <= 0 && $I <= 0 && $S > 0 && $C > 0 && $S >= $C) {
            return 17;
        } elseif ($D > 0 && $I <= 0 && $S <= 0 && $C > 0 && $D >= $C) {
            return 18;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $D >= $I && $I >= $C) {
            return 19;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $D >= $S && $S >= $I) {
            return 20;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $D >= $S && $S >= $C) {
            return 21;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $D >= $C && $C >= $I) {
            return 22;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $D >= $C && $C >= $S) {
            return 23;
        } elseif ($D <= 0 && $I > 0 && $S <= 0 && $C <= 0) {
            return 24;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C <= 0 && $I >= $S) {
            return 25;
        } elseif ($D <= 0 && $I > 0 && $S <= 0 && $C > 0 && $I >= $C) {
            return 26;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $I >= $C && $C >= $D) {
            return 27;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $I >= $C && $C >= $S) {
            return 28;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C <= 0 && $S >= $D) {
            return 29;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C <= 0 && $S >= $I) {
            return 30;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $S >= $D && $D >= $I) {
            return 31;
        } elseif ($D > 0 && $I > 0 && $S > 0 && $C <= 0 && $S >= $I && $I >= $D) {
            return 32;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $S >= $I && $I >= $C) {
            return 33;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $S >= $C && $C >= $D) {
            return 34;
        } elseif ($D <= 0 && $I > 0 && $S > 0 && $C > 0 && $S >= $C && $C >= $I) {
            return 35;
        } elseif ($D <= 0 && $I > 0 && $S <= 0 && $C > 0 && $C >= $I) {
            return 36;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $C >= $D && $D >= $I) {
            return 37;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $C >= $D && $D >= $S) {
            return 38;
        } elseif ($D > 0 && $I > 0 && $S <= 0 && $C > 0 && $C >= $I && $I >= $D) {
            return 39;
        } elseif ($D > 0 && $I <= 0 && $S > 0 && $C > 0 && $C >= $S && $S >= $D) {
            return 40;
        }

        return 0;
    }
}
