<?php

namespace App\Services;

use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubjectImportService extends ExcelImportService
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
            'name' => 'Matematika',
            'description' => 'Mata pelajaran contoh',
            'status' => 'Aktif',
        ];
    }

    public function validateRows(array $rows): array
    {
        $existingNames = $this->existingNames($rows);
        $existingSlugs = $this->existingSlugs($rows);
        $namesInFile = [];
        $slugsInFile = [];
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

            $slug = $name === '' ? '' : Str::slug($name);
            $nameKey = mb_strtolower($name);

            if ($name !== '') {
                if (isset($namesInFile[$nameKey])) {
                    $errors[] = 'Nama duplikat dalam file (baris '.$namesInFile[$nameKey].').';
                } elseif (in_array($nameKey, $existingNames, true)) {
                    $errors[] = 'Nama mata pelajaran sudah terdaftar.';
                }
            }

            if ($slug !== '') {
                if (isset($slugsInFile[$slug])) {
                    $errors[] = 'Nama menghasilkan slug yang sama dengan baris '.$slugsInFile[$slug].'.';
                } elseif (in_array($slug, $existingSlugs, true)) {
                    $errors[] = 'Slug sudah digunakan oleh mata pelajaran lain.';
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
            if ($slug !== '' && ! isset($slugsInFile[$slug])) {
                $slugsInFile[$slug] = $row['row'];
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
                Subject::create([
                    'name' => $row['name'],
                    'slug' => Str::slug($row['name']),
                    'description' => $row['description'],
                    'is_active' => $row['is_active'],
                ]);
                $count++;
            }

            return $count;
        });
    }

    /**
     * @return list<string> nama mata pelajaran existing (lowercase)
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

        return Subject::query()
            ->whereIn(DB::raw('LOWER(name)'), $names)
            ->pluck('name')
            ->map(fn ($name) => mb_strtolower($name))
            ->all();
    }

    /**
     * @return list<string> slug mata pelajaran existing
     */
    private function existingSlugs(array $rows): array
    {
        $slugs = array_values(array_unique(array_filter(array_map(
            fn ($r) => $r['name'] === '' ? '' : Str::slug($r['name']),
            $rows,
        ))));

        if (empty($slugs)) {
            return [];
        }

        return Subject::query()->whereIn('slug', $slugs)->pluck('slug')->all();
    }
}
