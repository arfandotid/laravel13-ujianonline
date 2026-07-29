<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubjectTableSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            [
                'name'        => 'Matematika',
                'slug'        => Str::slug('Matematika'),
                'description' => 'Mata pelajaran Matematika Umum dan Peminatan',
                'is_active'   => true,
            ],
            [
                'name'        => 'Bahasa Indonesia',
                'slug'        => Str::slug('Bahasa Indonesia'),
                'description' => 'Mata pelajaran Bahasa dan Sastra Indonesia',
                'is_active'   => true,
            ],
            [
                'name'        => 'Bahasa Inggris',
                'slug'        => Str::slug('Bahasa Inggris'),
                'description' => 'Mata pelajaran Bahasa Inggris Umum',
                'is_active'   => true,
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
