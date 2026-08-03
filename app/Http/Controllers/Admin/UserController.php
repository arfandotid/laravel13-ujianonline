<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Group;
use App\Models\User;
use App\Services\UserImportService;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Spatie\Permission\Models\Role;

class UserController implements HasMiddleware
{
    use FileUploadTrait;

    public function __construct(private readonly UserImportService $userImportService) {}

    public static function middleware()
    {
        return [
            new Middleware(['permission:users.index'], only: ['index']),
            new Middleware(['permission:users.create'], only: ['create', 'store', 'importTemplate', 'importPreview', 'import']),
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
                    $q->where('name', 'like', '%'.request()->q.'%')
                        ->orWhere('email', 'like', '%'.request()->q.'%');
                });
            })
            ->when(request()->group_id, function ($query) {
                $query->where('group_id', request()->group_id);
            })
            ->when(request()->role_id, function ($query) {
                $query->whereHas('roles', fn ($q) => $q->where('id', request()->role_id));
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
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'is_active' => $request->is_active,
            'group_id' => $request->group_id,
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
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'is_active' => $request->is_active,
            'group_id' => $request->group_id,
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
            $path = 'uploads/avatars/'.$user->avatar;
            $this->deleteFile($path);
        }

        $user->update(['avatar' => null]);

        return redirect()->route('admin.users.edit', $id)->with('success', 'Avatar berhasil dihapus.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->avatar) {
            $path = '/uploads/avatars/'.$user->avatar;
            $this->deleteFile($path);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Download template excel untuk import participant.
     */
    public function importTemplate()
    {
        $spreadsheet = $this->userImportService->createTemplateSpreadsheet();
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $temp = tempnam(sys_get_temp_dir(), 'template-participant').'.xlsx';
        $writer->save($temp);

        return response()
            ->download($temp, 'template-participant.xlsx')
            ->deleteFileAfterSend();
    }

    /**
     * Membaca & memvalidasi file excel, mengembalikan preview data untuk ditinjau.
     */
    public function importPreview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'group_id' => ['required', 'integer', 'exists:groups,id'],
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        $token = Str::random(40);
        $path = $request->file('file')->storeAs(
            'imports',
            $token.'.'.$request->file('file')->getClientOriginalExtension(),
            'local'
        );

        $read = $this->userImportService->readRows(storage_path('app/private/'.$path));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($path);

            return response()->json(['message' => $read['error']], 422);
        }

        $preview = $this->userImportService->validateRows($read['rows']);

        session()->put("user_import_{$token}", [
            'path' => $path,
            'group_id' => (int) $validated['group_id'],
        ]);

        return response()->json([
            'token' => $token,
            'group_id' => (int) $validated['group_id'],
            'rows' => $preview['rows'],
            'has_errors' => $preview['has_errors'],
            'total' => count($preview['rows']),
        ]);
    }

    /**
     * Proses import participant dari file excel yang sudah dipreview.
     */
    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'group_id' => ['required', 'integer', 'exists:groups,id'],
        ]);

        $token = $validated['token'];
        $meta = session()->get("user_import_{$token}");

        if (! $meta || $meta['group_id'] !== (int) $validated['group_id']) {
            return redirect()
                ->route('admin.users.index')
                ->with('error', 'Data import tidak ditemukan atau sudah kadaluarsa. Silakan upload ulang file.');
        }

        $read = $this->userImportService->readRows(storage_path('app/private/'.$meta['path']));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($meta['path']);
            session()->forget("user_import_{$token}");

            return redirect()->route('admin.users.index')->with('error', $read['error']);
        }

        $preview = $this->userImportService->validateRows($read['rows']);

        if ($preview['has_errors']) {
            return redirect()
                ->route('admin.users.index')
                ->with('error', 'Terdapat data yang tidak valid pada file excel. Perbaiki terlebih dahulu sebelum import.');
        }

        $count = $this->userImportService->createUsers($preview['rows'], (int) $validated['group_id']);

        Storage::disk('local')->delete($meta['path']);
        session()->forget("user_import_{$token}");

        return redirect()
            ->route('admin.users.index')
            ->with('success', "{$count} participant berhasil diimport.");
    }
}
