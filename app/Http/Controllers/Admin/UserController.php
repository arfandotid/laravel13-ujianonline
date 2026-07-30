<?php

namespace App\Http\Controllers\Admin;

use App\Models\Group;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Traits\FileUploadTrait;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;

class UserController implements HasMiddleware
{
    use FileUploadTrait;

    public static function middleware()
    {
        return [
            new Middleware(['permission:users.index'], only: ['index']),
            new Middleware(['permission:users.create'], only: ['create', 'store']),
            new Middleware(['permission:users.edit'], only: ['edit', 'update', 'deleteAvatar']),
            new Middleware(['permission:users.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $users = User::query()
            ->with('roles:id,name', 'group:id,name')
            ->when(request()->q, function ($query) {
                $query->where(function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%')
                        ->orWhere('email', 'like', '%' . request()->q . '%');
                });
            })
            ->when(request()->group_id, function ($query) {
                $query->where('group_id', request()->group_id);
            })
            ->when(request()->role_id, function ($query) {
                $query->whereHas('roles', fn($q) => $q->where('id', request()->role_id));
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/Users/Index', compact('users', 'roles', 'groups'));
    }

    public function create(): Response
    {
        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();
        return Inertia::render('Admin/Users/Create', compact('roles', 'groups'));
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = [
            'name'      => $request->name,
            'email'     => $request->email,
            'username'  => $request->username,
            'password'  => Hash::make($request->password),
            'is_active' => $request->is_active,
            'group_id'  => $request->group_id,
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $this->uploadFile($request, 'avatar', 'uploads/avatars');
        }

        $user = User::create($data);

        $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
        $user->syncRoles($roles);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(int|string $id): Response
    {
        $user = User::with('roles', 'group:id,name')->findOrFail($id);
        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();
        $userRoles = $user->roles->pluck('id');

        return Inertia::render('Admin/Users/Edit', compact('user', 'roles', 'groups', 'userRoles'));
    }

    public function update(UpdateUserRequest $request, int|string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $data = [
            'name'      => $request->name,
            'email'     => $request->email,
            'username'  => $request->username,
            'is_active' => $request->is_active,
            'group_id'  => $request->group_id,
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $this->updateFile($request, 'avatar', 'uploads/avatars', $user->avatar);
        }

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
        $user->syncRoles($roles);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function deleteAvatar(int|string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->avatar) {
            $path = 'uploads/avatars/' . $user->avatar;
            $this->deleteFile($path);
        }

        $user->update(['avatar' => null]);

        return redirect()->route('admin.users.edit', $id)->with('success', 'Avatar berhasil dihapus.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->avatar) {
            $path = "/uploads/avatars/" . $user->avatar;
            $this->deleteFile($path);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
