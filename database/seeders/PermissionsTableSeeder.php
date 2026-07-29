<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //permission users
        Permission::create(['name' => 'users.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);

        //permission roles
        Permission::create(['name' => 'roles.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.delete', 'guard_name' => 'web']);

        //permission permissions
        Permission::create(['name' => 'permissions.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'permissions.delete', 'guard_name' => 'web']);

        //permission settings
        Permission::create(['name' => 'settings.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'settings.update', 'guard_name' => 'web']);

        //permission groups
        Permission::create(['name' => 'groups.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'groups.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'groups.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'groups.delete', 'guard_name' => 'web']);

        //permission questions
        Permission::create(['name' => 'questions.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'questions.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'questions.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'questions.delete', 'guard_name' => 'web']);

        //permission subjects
        Permission::create(['name' => 'subjects.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'subjects.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'subjects.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'subjects.delete', 'guard_name' => 'web']);
    }
}
