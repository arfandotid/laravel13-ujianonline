<?php

namespace App\Services;

use App\Models\Group;
use Illuminate\Support\Facades\DB;

class GroupImportService extends ExcelImportService
{
    public function columnMap(): array
    {
        return [
            'Nama' => 'name',
            'Deskripsi' => 'description',
            'Status' => 'status',
        ];
    }

    public function optionalColumns(): array
    {
        return ['status' => 'Status'];
    }

    public function sampleRow(): array
    {
        return [
            'name' => 'Kelas X IPA 1',
            'description' => 'Rombongan contoh',
            'status' => 'Aktif',
        ];
    }

    public function validateRows(array $rows): array
    {
        $existingNames = $this->existingNames($rows);
        $namesInFile = [];
        $result = [];
        $hasErrors = false;

        foreach ($rows as $row) {
            $errors = [];
            $name = $row['name'];
            $description = $row['description'] === '' ? null : $row['description'];
            $statusLabel = 'Aktif';
            $isActive = true;

            if ($name === '') {
                $errors[] = 'Nama wajib diisi.';
            } elseif (mb_strlen($name) > 255) {
                $errors[] = 'Nama maksimal 255 karakter.';
            }

            $nameKey = mb_strtolower($name);
            if ($name !== '') {
                if (isset($namesInFile[$nameKey])) {
                    $errors[] = 'Nama duplikat dalam file (baris '.$namesInFile[$nameKey].').';
                } elseif (in_array($nameKey, $existingNames, true)) {
                    $errors[] = 'Nama group sudah terdaftar.';
                }
            }

            $parsedStatus = $this->parseStatus($row['status']);
            if ($parsedStatus === null) {
                $errors[] = 'Status tidak valid. Gunakan: Aktif / Non-Aktif.';
            } else {
                $isActive = $parsedStatus;
                $statusLabel = $isActive ? 'Aktif' : 'Non-Aktif';
            }

            if ($name !== '' && ! isset($namesInFile[$nameKey])) {
                $namesInFile[$nameKey] = $row['row'];
            }

            if (! empty($errors)) {
                $hasErrors = true;
            }

            $result[] = [
                'row' => $row['row'],
                'name' => $name,
                'description' => $description,
                'status' => $statusLabel,
                'is_active' => $isActive,
                'errors' => $errors,
            ];
        }

        return ['rows' => $result, 'has_errors' => $hasErrors];
    }

    public function createRecords(array $validRows): int
    {
        return DB::transaction(function () use ($validRows) {
            $count = 0;

            foreach ($validRows as $row) {
                Group::create([
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'is_active' => $row['is_active'],
                ]);
                $count++;
            }

            return $count;
        });
    }

    /**
     * @return list<string> nama group existing (lowercase)
     */
    private function existingNames(array $rows): array
    {
        $names = array_values(array_unique(array_filter(array_map(
            fn ($r) => mb_strtolower($r['name']),
            $rows,
        ))));

        if (empty($names)) {
            return [];
        }

        return Group::query()
            ->whereIn(DB::raw('LOWER(name)'), $names)
            ->pluck('name')
            ->map(fn ($name) => mb_strtolower($name))
            ->all();
    }
}
