<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

abstract class ExcelImportService
{
    /**
     * Pemetaan label kolom template => key baris hasil pembacaan.
     *
     * @return array<string, string>
     */
    abstract public function columnMap(): array;

    /**
     * Kolom opsional (boleh tidak ada di file excel), key => label.
     *
     * @return array<string, string>
     */
    public function optionalColumns(): array
    {
        return [];
    }

    /**
     * Contoh nilai per key untuk baris kedua template.
     *
     * @return array<string, mixed>
     */
    abstract public function sampleRow(): array;

    /**
     * Validasi baris hasil pembacaan.
     *
     * @return array{rows: list<array<string, mixed>>, has_errors: bool}
     */
    abstract public function validateRows(array $rows): array;

    /**
     * Membuat spreadsheet template yang siap didownload.
     */
    public function createTemplateSpreadsheet(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template');

        $headings = array_keys($this->columnMap());

        $sample = [];
        foreach ($this->columnMap() as $key) {
            $sample[] = $this->sampleRow()[$key] ?? '';
        }

        $sheet->fromArray($headings, null, 'A1');
        $sheet->fromArray($sample, null, 'A2');

        $lastColumn = Coordinate::stringFromColumnIndex(count($headings));
        foreach (range('A', $lastColumn) as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getStyle('A1:'.$lastColumn.'1')->getFont()->setBold(true);

        return $spreadsheet;
    }

    /**
     * Membaca baris dari file excel menjadi array row.
     *
     * @return array{rows: list<array<string, mixed>>, error: ?string}
     */
    public function readRows(string $path): array
    {
        try {
            $spreadsheet = IOFactory::load($path);
        } catch (\Throwable $e) {
            return ['rows' => [], 'error' => 'File tidak dapat dibaca. Pastikan file berformat .xlsx atau .xls dan tidak rusak.'];
        }

        $data = $spreadsheet->getActiveSheet()->toArray(null, true, false);

        if (empty($data) || count($data) < 2) {
            return ['rows' => [], 'error' => 'File tidak memiliki data baris. Silakan gunakan template yang disediakan.'];
        }

        $headings = array_map(fn ($col) => mb_strtolower(trim((string) $col)), $data[0]);

        $optionalKeys = array_keys($this->optionalColumns());
        $missing = [];
        $columns = [];

        foreach ($this->columnMap() as $label => $key) {
            $index = array_search(mb_strtolower($label), $headings, true);
            if ($index === false && ! in_array($key, $optionalKeys, true)) {
                $missing[] = $label;
            }
            $columns[$key] = $index;
        }

        if (! empty($missing)) {
            return [
                'rows' => [],
                'error' => 'Kolom pada file tidak sesuai. Wajib memiliki kolom: '.implode(', ', $missing).'.',
            ];
        }

        $rows = [];
        foreach ($data as $index => $line) {
            if ($index === 0) {
                continue;
            }

            $row = ['row' => $index + 1];
            $allEmpty = true;

            foreach ($columns as $key => $colIndex) {
                $value = trim((string) ($colIndex !== false && isset($line[$colIndex]) ? $line[$colIndex] : ''));
                $row[$key] = $value;
                if ($value !== '') {
                    $allEmpty = false;
                }
            }

            if ($allEmpty) {
                continue;
            }

            $rows[] = $row;
        }

        if (empty($rows)) {
            return ['rows' => [], 'error' => 'File tidak memiliki data baris. Silakan isi data pada file excel.'];
        }

        return ['rows' => $rows, 'error' => null];
    }

    /**
     * @return ?bool null jika nilai tidak dikenali
     */
    protected function parseStatus(string $value): ?bool
    {
        return match (mb_strtolower(trim($value))) {
            '', '1', 'aktif', 'active', 'ya', 'y', 'true', 'yes' => true,
            '0', 'non-aktif', 'non aktif', 'nonaktif', 'inactive', 'tidak', 't', 'false', 'no' => false,
            default => null,
        };
    }
}
