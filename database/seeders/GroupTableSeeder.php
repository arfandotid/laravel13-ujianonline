<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupTableSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'name'        => 'Kelas X IPA 1',
                'description' => 'Rombongan belajar kelas X IPA 1 tahun ajaran 2026/2027',
                'is_active'   => true,
            ],
            [
                'name'        => 'Kelas X IPA 2',
                'description' => 'Rombongan belajar kelas X IPA 2 tahun ajaran 2026/2027',
                'is_active'   => true,
            ],
            [
                'name'        => 'Kelas XI IPS 1',
                'description' => 'Rombongan belajar kelas XI IPS 1 tahun ajaran 2026/2027',
                'is_active'   => true,
            ],
            [
                'name'        => 'Kelas XI IPS 2',
                'description' => 'Rombongan belajar kelas XI IPS 2 tahun ajaran 2026/2027',
                'is_active'   => true,
            ],
            [
                'name'        => 'Kelas XII MIPA 1',
                'description' => 'Rombongan belajar kelas XII MIPA 1 tahun ajaran 2026/2027',
                'is_active'   => true,
            ],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
