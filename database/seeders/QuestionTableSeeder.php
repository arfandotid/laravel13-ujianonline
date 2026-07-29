<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Database\Seeder;

class QuestionTableSeeder extends Seeder
{
    public function run(): void
    {
        $matematika = Subject::where('slug', 'matematika')->first();
        $bIndonesia = Subject::where('slug', 'bahasa-indonesia')->first();
        $bInggris = Subject::where('slug', 'bahasa-inggris')->first();

        // 1. Soal Matematika (10 Soal)
        if ($matematika) {
            $this->seedMatematikaQuestions($matematika->id);
        }

        // 2. Soal Bahasa Indonesia (10 Soal)
        if ($bIndonesia) {
            $this->seedBahasaIndonesiaQuestions($bIndonesia->id);
        }

        // 3. Soal Bahasa Inggris (10 Soal)
        if ($bInggris) {
            $this->seedBahasaInggrisQuestions($bInggris->id);
        }
    }

    private function seedMatematikaQuestions(int $subjectId): void
    {
        $questions = [
            [
                'text' => 'Berapakah hasil dari 15 x 12?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '170', 'is_correct' => false],
                    ['text' => '180', 'is_correct' => true],
                    ['text' => '190', 'is_correct' => false],
                    ['text' => '200', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Jika f(x) = 2x + 5, berapakah nilai dari f(3)?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '11', 'is_correct' => true],
                    ['text' => '10', 'is_correct' => false],
                    ['text' => '9', 'is_correct' => false],
                    ['text' => '8', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Akar kuadrat dari 144 adalah...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '10', 'is_correct' => false],
                    ['text' => '11', 'is_correct' => false],
                    ['text' => '12', 'is_correct' => true],
                    ['text' => '14', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Berapakah keliling persegi jika panjang sisinya 8 cm?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '24 cm', 'is_correct' => false],
                    ['text' => '32 cm', 'is_correct' => true],
                    ['text' => '64 cm', 'is_correct' => false],
                    ['text' => '16 cm', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Nilai dari 2^5 (2 pangkat 5) adalah...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '16', 'is_correct' => false],
                    ['text' => '25', 'is_correct' => false],
                    ['text' => '32', 'is_correct' => true],
                    ['text' => '64', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Sebuah segitiga memiliki alas 10 cm dan tinggi 6 cm. Berapakah luasnya?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '30 cm²', 'is_correct' => true],
                    ['text' => '60 cm²', 'is_correct' => false],
                    ['text' => '15 cm²', 'is_correct' => false],
                    ['text' => '50 cm²', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Berapakah turunan pertama dari fungsi f(x) = 3x^2 + 4x?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '6x + 4', 'is_correct' => true],
                    ['text' => '3x + 4', 'is_correct' => false],
                    ['text' => '6x^2 + 4', 'is_correct' => false],
                    ['text' => '6x', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Berapakah hasil dari sin 30°?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => '0', 'is_correct' => false],
                    ['text' => '1/2', 'is_correct' => true],
                    ['text' => '1/√2', 'is_correct' => false],
                    ['text' => '1', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Jelaskan pengertian dari matriks singular dan berikan contohnya!',
                'type' => 'essay',
            ],
            [
                'text' => 'Sebutkan dan jelaskan langkah-langkah dalam menyelesaikan persamaan kuadrat dengan metode melengkapkan kuadrat sempurna!',
                'type' => 'essay',
            ],
        ];

        $this->createQuestionsBatch($subjectId, $questions);
    }

    private function seedBahasaIndonesiaQuestions(int $subjectId): void
    {
        $questions = [
            [
                'text' => 'Ide pokok dalam sebuah paragraf biasanya terdapat pada...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Kalimat utama', 'is_correct' => true],
                    ['text' => 'Kalimat penjelas', 'is_correct' => false],
                    ['text' => 'Kalimat penutup', 'is_correct' => false],
                    ['text' => 'Judul paragraf', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Sinonim dari kata "efisien" adalah...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Tepat guna', 'is_correct' => true],
                    ['text' => 'Boros', 'is_correct' => false],
                    ['text' => 'Lambat', 'is_correct' => false],
                    ['text' => 'Rumi', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Manakah di bawah ini yang merupakan teks prosedur?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Cara Membuat Nasi Goreng Spesial', 'is_correct' => true],
                    ['text' => 'Kisah Perjuangan Pangeran Diponegoro', 'is_correct' => false],
                    ['text' => 'Keindahan Pantai Parangtritis', 'is_correct' => false],
                    ['text' => 'Opini tentang Pendidikan di Indonesia', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Antonim dari kata "abstrak" adalah...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Konkrit / Nyata', 'is_correct' => true],
                    ['text' => 'Samar', 'is_correct' => false],
                    ['text' => 'Maya', 'is_correct' => false],
                    ['text' => 'Khayal', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Gaya bahasa yang membandingkan dua hal secara tidak langsung dinamakan...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Majas Metafora', 'is_correct' => true],
                    ['text' => 'Majas Personifikasi', 'is_correct' => false],
                    ['text' => 'Majas Hiperbola', 'is_correct' => false],
                    ['text' => 'Majas Litotes', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Penulisan kata baku yang benar adalah...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Apotek', 'is_correct' => true],
                    ['text' => 'Apotik', 'is_correct' => false],
                    ['text' => 'Apotex', 'is_correct' => false],
                    ['text' => 'Apotique', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Unsur intrinsik cerpen yang menggambarkan tempat, waktu, dan suasana disebut...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Latar / Setting', 'is_correct' => true],
                    ['text' => 'Alur', 'is_correct' => false],
                    ['text' => 'Tema', 'is_correct' => false],
                    ['text' => 'Amanat', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Kalimat efektif harus memenuhi syarat berikut, kecuali...',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Menggunakan kata yang bertele-tele', 'is_correct' => true],
                    ['text' => 'Memiliki subjek dan predikat yang jelas', 'is_correct' => false],
                    ['text' => 'Memenuhi kaidah PUEBI / EBI', 'is_correct' => false],
                    ['text' => 'Hemat penggunaan kata', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Tuliskan dan jelaskan struktur dari Teks Eksplanasi!',
                'type' => 'essay',
            ],
            [
                'text' => 'Jelaskan perbedaan antara kalimat deduktif dan kalimat induktif beserta contohnya!',
                'type' => 'essay',
            ],
        ];

        $this->createQuestionsBatch($subjectId, $questions);
    }

    private function seedBahasaInggrisQuestions(int $subjectId): void
    {
        $questions = [
            [
                'text' => 'Choose the correct form: She _____ to school every day.',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'goes', 'is_correct' => true],
                    ['text' => 'go', 'is_correct' => false],
                    ['text' => 'going', 'is_correct' => false],
                    ['text' => 'went', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'What is the synonym of the word "happy"?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Joyful', 'is_correct' => true],
                    ['text' => 'Sad', 'is_correct' => false],
                    ['text' => 'Angry', 'is_correct' => false],
                    ['text' => 'Tired', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Complete the sentence: If I _____ rich, I would buy a sports car.',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'were', 'is_correct' => true],
                    ['text' => 'am', 'is_correct' => false],
                    ['text' => 'will be', 'is_correct' => false],
                    ['text' => 'be', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'What is the past participle (V3) of the verb "write"?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Written', 'is_correct' => true],
                    ['text' => 'Wrote', 'is_correct' => false],
                    ['text' => 'Writing', 'is_correct' => false],
                    ['text' => 'Writes', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Choose the passive voice: "The chef cooked a delicious dinner."',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'A delicious dinner was cooked by the chef.', 'is_correct' => true],
                    ['text' => 'A delicious dinner is cooked by the chef.', 'is_correct' => false],
                    ['text' => 'The chef was cooked a delicious dinner.', 'is_correct' => false],
                    ['text' => 'A delicious dinner has been cooked.', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'What is the opposite of the word "difficult"?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'Easy', 'is_correct' => true],
                    ['text' => 'Hard', 'is_correct' => false],
                    ['text' => 'Complex', 'is_correct' => false],
                    ['text' => 'Challenging', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Identify the preposition: "The book is on the table."',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'on', 'is_correct' => true],
                    ['text' => 'is', 'is_correct' => false],
                    ['text' => 'table', 'is_correct' => false],
                    ['text' => 'book', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Which sentence is in the Present Perfect Tense?',
                'type' => 'multiple_choice',
                'options' => [
                    ['text' => 'I have lived here for five years.', 'is_correct' => true],
                    ['text' => 'I am living here right now.', 'is_correct' => false],
                    ['text' => 'I lived here last year.', 'is_correct' => false],
                    ['text' => 'I will live here next month.', 'is_correct' => false],
                ],
            ],
            [
                'text' => 'Write a short paragraph (3-5 sentences) introducing yourself in English!',
                'type' => 'essay',
            ],
            [
                'text' => 'Explain the generic structure of a Narrative Text and give one example title!',
                'type' => 'essay',
            ],
        ];

        $this->createQuestionsBatch($subjectId, $questions);
    }

    private function createQuestionsBatch(int $subjectId, array $questions): void
    {
        foreach ($questions as $q) {
            $questionModel = Question::create([
                'subject_id'    => $subjectId,
                'type'          => $q['type'],
                'question_text' => $q['text'],
                'is_active'     => true,
            ]);

            if ($q['type'] === 'multiple_choice' && isset($q['options'])) {
                foreach ($q['options'] as $idx => $opt) {
                    QuestionOption::create([
                        'question_id' => $questionModel->id,
                        'option_text' => $opt['text'],
                        'is_correct'  => $opt['is_correct'],
                        'order'       => $idx + 1,
                    ]);
                }
            }
        }
    }
}
