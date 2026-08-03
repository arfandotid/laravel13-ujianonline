<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Facades\DB;

class QuestionImportService extends ExcelImportService
{
    /**
     * @var list<string>
     */
    private const LETTERS = ['A', 'B', 'C', 'D', 'E'];

    public function columnMap(): array
    {
        return [
            'Tipe' => 'type',
            'Soal' => 'question_text',
            'Opsi A' => 'option_a',
            'Opsi B' => 'option_b',
            'Opsi C' => 'option_c',
            'Opsi D' => 'option_d',
            'Opsi E' => 'option_e',
            'Jawaban Benar' => 'answer',
            'Status' => 'status',
        ];
    }

    public function optionalColumns(): array
    {
        return [
            'option_a' => 'Opsi A',
            'option_b' => 'Opsi B',
            'option_c' => 'Opsi C',
            'option_d' => 'Opsi D',
            'option_e' => 'Opsi E',
            'answer' => 'Jawaban Benar',
            'status' => 'Status',
        ];
    }

    public function sampleRow(): array
    {
        return [
            'type' => 'Pilihan Ganda',
            'question_text' => 'Berapakah hasil dari 2 + 2?',
            'option_a' => '3',
            'option_b' => '4',
            'option_c' => '5',
            'option_d' => '6',
            'option_e' => '',
            'answer' => 'B',
            'status' => 'Aktif',
        ];
    }

    public function validateRows(array $rows, ?int $subjectId = null): array
    {
        $result = [];
        $hasErrors = false;

        foreach ($rows as $row) {
            $errors = [];

            $questionText = $row['question_text'] ?? '';
            $type = $this->parseType($row['type'] ?? '');
            $answer = mb_strtoupper(trim($row['answer'] ?? ''));
            $options = $this->collectOptions($row);

            if ($questionText === '') {
                $errors[] = 'Soal wajib diisi.';
            }

            if ($type === null) {
                $errors[] = 'Tipe tidak valid. Gunakan: Pilihan Ganda / Essay.';
            }

            if ($type === 'multiple_choice') {
                $errors = array_merge($errors, $this->validateMultipleChoice($options, $answer));
            } elseif ($type === 'essay') {
                if ($options !== [] || $answer !== '') {
                    $errors[] = 'Soal essay tidak boleh mengisi kolom opsi/jawaban.';
                }
            }

            $parsedStatus = $this->parseStatus($row['status'] ?? '');
            $isActive = true;
            $statusLabel = 'Aktif';

            if ($parsedStatus === null) {
                $errors[] = 'Status tidak valid. Gunakan: Aktif / Non-Aktif.';
            } else {
                $isActive = $parsedStatus;
                $statusLabel = $isActive ? 'Aktif' : 'Non-Aktif';
            }

            if (! empty($errors)) {
                $hasErrors = true;
            }

            $result[] = [
                'row' => $row['row'],
                'subject_id' => $subjectId,
                'question_type' => $type,
                'type' => $type === 'multiple_choice' ? 'Pilihan Ganda' : 'Essay',
                'question_text' => $questionText,
                'options' => $options,
                'options_summary' => $options === [] ? '-' : implode(', ', array_keys($options)),
                'answer' => $answer === '' ? '-' : $answer,
                'is_active' => $isActive,
                'status' => $statusLabel,
                'errors' => $errors,
            ];
        }

        return ['rows' => $result, 'has_errors' => $hasErrors];
    }

    public function createRecords(array $validRows, ?int $subjectId = null): int
    {
        return DB::transaction(function () use ($validRows, $subjectId) {
            $count = 0;

            foreach ($validRows as $row) {
                $question = Question::create([
                    'subject_id' => $row['subject_id'] ?? $subjectId,
                    'type' => $row['question_type'],
                    'question_text' => $row['question_text'],
                    'is_active' => $row['is_active'],
                ]);

                if ($row['question_type'] === 'multiple_choice') {
                    $order = 1;
                    foreach ($row['options'] as $letter => $text) {
                        $question->options()->create([
                            'option_text' => $text,
                            'is_correct' => $letter === $row['answer'],
                            'order' => $order,
                        ]);
                        $order++;
                    }
                }

                $count++;
            }

            return $count;
        });
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, string> huruf => teks opsi yang terisi
     */
    private function collectOptions(array $row): array
    {
        $options = [];

        foreach (self::LETTERS as $letter) {
            $key = 'option_'.mb_strtolower($letter);
            $value = trim((string) ($row[$key] ?? ''));

            if ($value !== '') {
                $options[$letter] = $value;
            }
        }

        return $options;
    }

    /**
     * @param  array<string, string>  $options
     * @return list<string>
     */
    private function validateMultipleChoice(array $options, string $answer): array
    {
        $errors = [];

        $seenEmpty = false;
        foreach (self::LETTERS as $letter) {
            if (isset($options[$letter])) {
                if ($seenEmpty) {
                    $errors[] = 'Opsi harus diisi berurutan dari A.';
                    break;
                }
            } else {
                $seenEmpty = true;
            }
        }

        if (count($options) < 2) {
            $errors[] = 'Soal pilihan ganda minimal 2 opsi.';
        }

        if ($answer === '') {
            $errors[] = 'Jawaban benar wajib diisi untuk soal pilihan ganda.';
        } elseif (! isset($options[$answer])) {
            $errors[] = 'Jawaban benar harus berupa huruf opsi yang terisi (A–E).';
        }

        return $errors;
    }

    private function parseType(string $value): ?string
    {
        return match (mb_strtolower(trim($value))) {
            'pilihan ganda', 'pg', 'multiple choice', 'multiple_choice', 'mc', 'objektif', 'objetif' => 'multiple_choice',
            'essay', 'esai', 'uraian', 'isian' => 'essay',
            default => null,
        };
    }
}
