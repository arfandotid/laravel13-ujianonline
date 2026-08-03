<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;
use App\Models\Subject;
use App\Services\SubjectImportService;
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

class SubjectController implements HasMiddleware
{
    public function __construct(private readonly SubjectImportService $subjectImportService) {}

    public static function middleware(): array
    {
        return [
            new Middleware(['permission:subjects.index'], only: ['index']),
            new Middleware(['permission:subjects.create'], only: ['create', 'store', 'importTemplate', 'importPreview', 'import']),
            new Middleware(['permission:subjects.edit'], only: ['edit', 'update']),
            new Middleware(['permission:subjects.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $subjects = Subject::query()
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%'.request()->q.'%')
                    ->orWhere('description', 'like', '%'.request()->q.'%');
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Subjects/Index', compact('subjects'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Subjects/Create');
    }

    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        Subject::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject created successfully.');
    }

    public function edit(int|string $id): Response
    {
        $subject = Subject::findOrFail($id);

        return Inertia::render('Admin/Subjects/Edit', compact('subject'));
    }

    public function update(UpdateSubjectRequest $request, int|string $id): RedirectResponse
    {
        $subject = Subject::findOrFail($id);

        $subject->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->route('admin.subjects.index')->with('success', 'Subject deleted successfully.');
    }

    /**
     * Download template excel untuk import mata pelajaran.
     */
    public function importTemplate()
    {
        $spreadsheet = $this->subjectImportService->createTemplateSpreadsheet();
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $temp = tempnam(sys_get_temp_dir(), 'template-subject').'.xlsx';
        $writer->save($temp);

        return response()
            ->download($temp, 'template-subject.xlsx')
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

        $read = $this->subjectImportService->readRows(storage_path('app/private/'.$path));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($path);

            return response()->json(['message' => $read['error']], 422);
        }

        $preview = $this->subjectImportService->validateRows($read['rows']);

        session()->put("subject_import_{$token}", ['path' => $path]);

        return response()->json([
            'token' => $token,
            'rows' => $preview['rows'],
            'has_errors' => $preview['has_errors'],
            'total' => count($preview['rows']),
        ]);
    }

    /**
     * Proses import mata pelajaran dari file excel yang sudah dipreview.
     */
    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
        ]);

        $token = $validated['token'];
        $meta = session()->get("subject_import_{$token}");

        if (! $meta) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('error', 'Data import tidak ditemukan atau sudah kadaluarsa. Silakan upload ulang file.');
        }

        $read = $this->subjectImportService->readRows(storage_path('app/private/'.$meta['path']));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($meta['path']);
            session()->forget("subject_import_{$token}");

            return redirect()->route('admin.subjects.index')->with('error', $read['error']);
        }

        $preview = $this->subjectImportService->validateRows($read['rows']);

        if ($preview['has_errors']) {
            return redirect()
                ->route('admin.subjects.index')
                ->with('error', 'Terdapat data yang tidak valid pada file excel. Perbaiki terlebih dahulu sebelum import.');
        }

        $count = $this->subjectImportService->createRecords($preview['rows']);

        Storage::disk('local')->delete($meta['path']);
        session()->forget("subject_import_{$token}");

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', "{$count} mata pelajaran berhasil diimport.");
    }
}
