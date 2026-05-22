<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Traits\FileUploadTrait;

class UserController extends Controller implements HasMiddleware
{
    use FileUploadTrait;
    public static function middleware()
    {
        return [
            new Middleware(['permission:users.index'], only: ['index']),
            new Middleware(['permission:users.create'], only: ['create', 'store']),
            new Middleware(['permission:users.edit'], only: ['edit', 'update']),
            new Middleware(['permission:users.delete'], only: ['destroy']),
        ];
    }

    public function index()
    {
        $users = User::query()
            ->with('roles:id,name')
            ->when(request()->q, function ($users) {
                $users->where(function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%')
                        ->orWhere('email', 'like', '%' . request()->q . '%');
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $users->appends(['q' => request()->q]);

        return Inertia::render('Users/Index', compact('users'));
    }

    public function create()
    {
        $roles = Role::select('id', 'name')->orderBy('name')->get();
        return Inertia::render('Users/Create', compact('roles'));
    }

     public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'username' => 'required|string|max:50|unique:users,username',
            'password' => 'required|min:8',
            'roles'    => 'required|array',
            'roles.*'  => 'exists:roles,id',
            'is_active' => 'required',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $data = [
            'name'     => $request->name,
            'email'    => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'is_active' => $request->is_active,
        ];

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $this->uploadFile($request, 'avatar', 'uploads/avatars');
        }

        $user = User::create($data);

        // assign role
        $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
        $user->syncRoles($roles);

        return redirect()->to('/users')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $user->load('roles');
        $roles = Role::select('id', 'name')->orderBy('name')->get();
        $userRoles = $user->roles->pluck('id');

        return Inertia::render('Users/Edit', compact('user', 'roles', 'userRoles'));
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'username' => 'required|string|max:50|unique:users,username,' . $user->id,
            'password' => 'nullable|min:8',
            'roles'    => 'required|array',
            'roles.*'  => 'exists:roles,id',
            'is_active' => 'required',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $data = [
            'name'     => $request->name,
            'email'    => $request->email,
            'username' => $request->username,
            'is_active' => $request->is_active,
        ];

        // update avatar jika diisi
        if ($request->hasFile('avatar')) {
            $data['avatar'] = $this->updateFile($request, 'avatar', 'uploads/avatars', $user->avatar);
        }

        // update password jika diisi
        if($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // sync role
        $roles = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
        $user->syncRoles($roles);

        return redirect()->to('/users')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if($user->avatar) {
            $path = "/uploads/avatars/".$user->avatar;
            $this->deleteFile($path);
        }

        $user->delete();

        return redirect()->to('/users')->with('success', 'User deleted successfully.');
    }
}
