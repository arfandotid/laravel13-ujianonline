<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserImportService extends ExcelImportService
{
    public const DEFAULT_PASSWORD = 'password';

    public function columnMap(): array
    {
        return [
            'Nama' => 'name',
            'Email' => 'email',
            'Username' => 'username',
        ];
    }

    public function sampleRow(): array
    {
        return [
            'name' => 'Nama Peserta Contoh',
            'email' => 'peserta.contoh@gmail.com',
            'username' => 'peserta001',
        ];
    }

    /**
     * Validasi baris terhadap aturan dan duplikasi di database / dalam file.
     *
     * @return array{rows: array<int, array{row: int, name: string, email: string, username: string, errors: list<string>}>, has_errors: bool}
     */
    public function validateRows(array $rows): array
    {
        $emailsInFile = [];
        $usernamesInFile = [];
        $result = [];
        $hasErrors = false;

        $existingEmails = $this->existingEmails($rows);
        $existingUsernames = $this->existingUsernames($rows);

        foreach ($rows as $row) {
            $errors = [];

            $name = $row['name'];
            $email = strtolower($row['email']);
            $username = $row['username'];

            if ($name === '') {
                $errors[] = 'Nama wajib diisi.';
            } elseif (mb_strlen($name) > 255) {
                $errors[] = 'Nama maksimal 255 karakter.';
            }

            if ($email === '') {
                $errors[] = 'Email wajib diisi.';
            } elseif (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = 'Format email tidak valid.';
            } elseif (isset($emailsInFile[$email])) {
                $errors[] = 'Email duplikat dalam file (baris '.$emailsInFile[$email].').';
            } elseif (in_array($email, $existingEmails, true)) {
                $errors[] = 'Email sudah terdaftar.';
            }

            if ($username === '') {
                $errors[] = 'Username wajib diisi.';
            } elseif (mb_strlen($username) > 50) {
                $errors[] = 'Username maksimal 50 karakter.';
            } elseif (isset($usernamesInFile[$username])) {
                $errors[] = 'Username duplikat dalam file (baris '.$usernamesInFile[$username].').';
            } elseif (in_array($username, $existingUsernames, true)) {
                $errors[] = 'Username sudah terdaftar.';
            }

            if ($email !== '' && ! isset($emailsInFile[$email])) {
                $emailsInFile[$email] = $row['row'];
            }
            if ($username !== '' && ! isset($usernamesInFile[$username])) {
                $usernamesInFile[$username] = $row['row'];
            }

            if (! empty($errors)) {
                $hasErrors = true;
            }

            $result[] = [
                'row' => $row['row'],
                'name' => $name,
                'email' => $email,
                'username' => $username,
                'errors' => $errors,
            ];
        }

        return ['rows' => $result, 'has_errors' => $hasErrors];
    }

    /**
     * Menyimpan user dari baris valid ke database dengan role participant.
     */
    public function createUsers(array $validRows, int $groupId): int
    {
        $role = Role::firstOrCreate(['name' => 'participant']);

        return DB::transaction(function () use ($validRows, $groupId, $role) {
            $count = 0;

            foreach ($validRows as $row) {
                $user = User::create([
                    'name' => $row['name'],
                    'email' => strtolower($row['email']),
                    'username' => $row['username'],
                    'password' => Hash::make(self::DEFAULT_PASSWORD),
                    'is_active' => true,
                    'group_id' => $groupId,
                ]);

                $user->assignRole($role);
                $count++;
            }

            return $count;
        });
    }

    /**
     * @return list<string> email existing (lowercase)
     */
    private function existingEmails(array $rows): array
    {
        $emails = array_values(array_unique(array_filter(
            array_map(fn ($r) => strtolower($r['email']), $rows),
        )));

        if (empty($emails)) {
            return [];
        }

        return User::query()
            ->whereIn(DB::raw('LOWER(email)'), $emails)
            ->pluck('email')
            ->map(fn ($email) => strtolower($email))
            ->all();
    }

    /**
     * @return list<string> username existing
     */
    private function existingUsernames(array $rows): array
    {
        $usernames = array_values(array_unique(array_filter(
            array_map(fn ($r) => $r['username'], $rows),
        )));

        if (empty($usernames)) {
            return [];
        }

        return User::query()
            ->whereIn('username', $usernames)
            ->pluck('username')
            ->all();
    }
}
