<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Spatie\Permission\Models\Role;

class UserImportService
{
    public const TEMPLATE_HEADINGS = ['Nama', 'Email', 'Username'];

    public const DEFAULT_PASSWORD = 'password';

    /**
     * Membuat spreadsheet template yang siap didownload.
     */
    public function createTemplateSpreadsheet(): Spreadsheet
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template');

        $sheet->fromArray(self::TEMPLATE_HEADINGS, null, 'A1');
        $sheet->fromArray(['Nama Peserta Contoh', 'peserta.contoh@gmail.com', 'peserta001'], null, 'A2');

        foreach (range('A', 'C') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        $sheet->getStyle('A1:C1')->getFont()->setBold(true);

        return $spreadsheet;
    }

    /**
     * Membaca baris dari file excel menjadi array row (name, email, username).
     *
     * @return array{rows: array<int, array{row: int, name: string, email: string, username: string}>, error: ?string}
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
        $columns = [
            'name' => array_search('nama', $headings, true),
            'email' => array_search('email', $headings, true),
            'username' => array_search('username', $headings, true),
        ];

        if (in_array(false, $columns, true)) {
            return [
                'rows' => [],
                'error' => 'Kolom pada file tidak sesuai. Wajib memiliki kolom: '.implode(', ', self::TEMPLATE_HEADINGS).'.',
            ];
        }

        $rows = [];
        foreach ($data as $index => $line) {
            if ($index === 0) {
                continue;
            }

            $name = trim((string) ($line[$columns['name']] ?? ''));
            $email = trim((string) ($line[$columns['email']] ?? ''));
            $username = trim((string) ($line[$columns['username']] ?? ''));

            if ($name === '' && $email === '' && $username === '') {
                continue;
            }

            $rows[] = [
                'row' => $index + 1,
                'name' => $name,
                'email' => $email,
                'username' => $username,
            ];
        }

        if (empty($rows)) {
            return ['rows' => [], 'error' => 'File tidak memiliki data baris. Silakan isi data pada file excel.'];
        }

        return ['rows' => $rows, 'error' => null];
    }

    /**
     * Validasi baris terhadap aturan dan duplikasi di database / dalam file.
     *
     * @return array{rows: array<int, array{row: int, name: string, email: string, username: string, errors: list<string>}>, has_errors: bool}
     */
    public function validateRows(array $rows, int $groupId): array
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
