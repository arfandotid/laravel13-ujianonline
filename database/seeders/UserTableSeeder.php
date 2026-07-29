<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminUser = User::create([
            'name'      => 'Administrator',
            'email'     => 'admin@gmail.com',
            'username'  => 'admin',
            'password'  => bcrypt('password'),
        ]);

        // Assign all permissions to admin role
        $permissions = Permission::all();
        $adminRole   = Role::findByName('admin');
        $adminRole->syncPermissions($permissions);

        // Assign admin role to admin user
        $adminUser->assignRole($adminRole);

        // Create participant user
        $participantUser = User::create([
            'name'      => 'Peserta Demo',
            'email'     => 'participant@gmail.com',
            'username'  => 'participant',
            'password'  => bcrypt('password'),
        ]);

        // Assign participant role (no individual permissions — gated by role middleware)
        $participantUser->assignRole(Role::findByName('participant'));
    }
}
