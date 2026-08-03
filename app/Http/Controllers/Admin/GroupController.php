<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Group\StoreGroupRequest;
use App\Http\Requests\Group\UpdateGroupRequest;
use App\Models\Group;
use App\Services\GroupImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\IOFactory;

class GroupController implements HasMiddleware
{
    public function __construct(private readonly GroupImportService $groupImportService) {}

    public static function middleware(): array
    {
        return [
            new Middleware(['permission:groups.index'], only: ['index']),
            new Middleware(['permission:groups.create'], only: ['create', 'store', 'importTemplate', 'importPreview', 'import']),
            new Middleware(['permission:groups.edit'], only: ['edit', 'update']),
            new Middleware(['permission:groups.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $groups = Group::query()
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%'.request()->q.'%')
                    ->orWhere('description', 'like', '%'.request()->q.'%');
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Groups/Index', compact('groups'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Groups/Create');
    }

    public function store(StoreGroupRequest $request): RedirectResponse
    {
        Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.groups.index')->with('success', 'Group created successfully.');
    }

    public function edit(int|string $id): Response
    {
        $group = Group::findOrFail($id);

        return Inertia::render('Admin/Groups/Edit', compact('group'));
    }

    public function update(UpdateGroupRequest $request, int|string $id): RedirectResponse
    {
        $group = Group::findOrFail($id);

        $group->update([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.groups.index')->with('success', 'Group updated successfully.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return redirect()->route('admin.groups.index')->with('success', 'Group deleted successfully.');
    }

    /**
     * Download template excel untuk import group.
     */
    public function importTemplate()
    {
        $spreadsheet = $this->groupImportService->createTemplateSpreadsheet();
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $temp = tempnam(sys_get_temp_dir(), 'template-group').'.xlsx';
        $writer->save($temp);

        return response()
            ->download($temp, 'template-group.xlsx')
            ->deleteFileAfterSend();
    }

    /**
     * Membaca & memvalidasi file excel, mengembalikan preview data untuk ditinjau.
     */
    public function importPreview(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        $token = Str::random(40);
        $path = $request->file('file')->storeAs(
            'imports',
            $token.'.'.$request->file('file')->getClientOriginalExtension(),
            'local'
        );

        $read = $this->groupImportService->readRows(storage_path('app/private/'.$path));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($path);

            return response()->json(['message' => $read['error']], 422);
        }

        $preview = $this->groupImportService->validateRows($read['rows']);

        session()->put("group_import_{$token}", ['path' => $path]);

        return response()->json([
            'token' => $token,
            'rows' => $preview['rows'],
            'has_errors' => $preview['has_errors'],
            'total' => count($preview['rows']),
        ]);
    }

    /**
     * Proses import group dari file excel yang sudah dipreview.
     */
    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
        ]);

        $token = $validated['token'];
        $meta = session()->get("group_import_{$token}");

        if (! $meta) {
            return redirect()
                ->route('admin.groups.index')
                ->with('error', 'Data import tidak ditemukan atau sudah kadaluarsa. Silakan upload ulang file.');
        }

        $read = $this->groupImportService->readRows(storage_path('app/private/'.$meta['path']));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($meta['path']);
            session()->forget("group_import_{$token}");

            return redirect()->route('admin.groups.index')->with('error', $read['error']);
        }

        $preview = $this->groupImportService->validateRows($read['rows']);

        if ($preview['has_errors']) {
            return redirect()
                ->route('admin.groups.index')
                ->with('error', 'Terdapat data yang tidak valid pada file excel. Perbaiki terlebih dahulu sebelum import.');
        }

        $count = $this->groupImportService->createRecords($preview['rows']);

        Storage::disk('local')->delete($meta['path']);
        session()->forget("group_import_{$token}");

        return redirect()
            ->route('admin.groups.index')
            ->with('success', "{$count} group berhasil diimport.");
    }
}
