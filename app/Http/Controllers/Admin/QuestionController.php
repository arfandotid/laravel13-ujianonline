<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;
use App\Models\Question;
use App\Models\Subject;
use App\Services\QuestionImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\IOFactory;

class QuestionController implements HasMiddleware
{
    public function __construct(private readonly QuestionImportService $questionImportService) {}

    public static function middleware(): array
    {
        return [
            new Middleware(['permission:questions.index'], only: ['index']),
            new Middleware(['permission:questions.create'], only: ['create', 'store', 'importTemplate', 'importPreview', 'import']),
            new Middleware(['permission:questions.edit'], only: ['edit', 'update']),
            new Middleware(['permission:questions.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $questions = Question::query()
            ->with(['subject:id,name', 'options'])
            ->when(request()->q, function ($query) {
                $query->where('question_text', 'like', '%'.request()->q.'%');
            })
            ->when(request()->subject_id, function ($query) {
                $query->where('subject_id', request()->subject_id);
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $subjects = Subject::select('id', 'name')->where('is_active', true)->get();

        return Inertia::render('Admin/Questions/Index', compact('questions', 'subjects'));
    }

    public function create(): Response
    {
        $subjects = Subject::select('id', 'name')->where('is_active', true)->get();

        return Inertia::render('Admin/Questions/Create', compact('subjects'));
    }

    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $question = Question::create([
                'subject_id' => $request->subject_id,
                'type' => $request->type,
                'question_text' => $request->question_text,
                'is_active' => $request->is_active,
            ]);

            if ($request->type === 'multiple_choice' && ! empty($request->options)) {
                foreach ($request->options as $index => $option) {
                    $question->options()->create([
                        'option_text' => $option['option_text'],
                        'is_correct' => filter_var($option['is_correct'], FILTER_VALIDATE_BOOLEAN),
                        'order' => $option['order'] ?? ($index + 1),
                    ]);
                }
            }
        });

        return redirect()->route('admin.questions.index')->with('success', 'Question created successfully.');
    }

    public function edit(int|string $id): Response
    {
        $question = Question::with('options')->findOrFail($id);
        $subjects = Subject::select('id', 'name')->where('is_active', true)->get();

        return Inertia::render('Admin/Questions/Edit', compact('question', 'subjects'));
    }

    public function update(UpdateQuestionRequest $request, int|string $id): RedirectResponse
    {
        DB::transaction(function () use ($request, $id) {
            $question = Question::findOrFail($id);

            $question->update([
                'subject_id' => $request->subject_id,
                'type' => $request->type,
                'question_text' => $request->question_text,
                'is_active' => $request->is_active,
            ]);

            // Synchronize options if multiple choice, delete existing options first or recreate
            if ($request->type === 'multiple_choice') {
                $question->options()->delete();
                if (! empty($request->options)) {
                    foreach ($request->options as $index => $option) {
                        $question->options()->create([
                            'option_text' => $option['option_text'],
                            'is_correct' => filter_var($option['is_correct'], FILTER_VALIDATE_BOOLEAN),
                            'order' => $option['order'] ?? ($index + 1),
                        ]);
                    }
                }
            } else {
                $question->options()->delete();
            }
        });

        return redirect()->route('admin.questions.index')->with('success', 'Question updated successfully.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return redirect()->route('admin.questions.index')->with('success', 'Question deleted successfully.');
    }

    /**
     * Download template excel untuk import soal.
     */
    public function importTemplate()
    {
        $spreadsheet = $this->questionImportService->createTemplateSpreadsheet();
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $temp = tempnam(sys_get_temp_dir(), 'template-question').'.xlsx';
        $writer->save($temp);

        return response()
            ->download($temp, 'template-question.xlsx')
            ->deleteFileAfterSend();
    }

    /**
     * Membaca & memvalidasi file excel, mengembalikan preview data untuk ditinjau.
     */
    public function importPreview(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
        ]);

        $token = Str::random(40);
        $path = $request->file('file')->storeAs(
            'imports',
            $token.'.'.$request->file('file')->getClientOriginalExtension(),
            'local'
        );

        $read = $this->questionImportService->readRows(storage_path('app/private/'.$path));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($path);

            return response()->json(['message' => $read['error']], 422);
        }

        $preview = $this->questionImportService->validateRows($read['rows'], (int) $request->subject_id);

        session()->put("question_import_{$token}", [
            'path' => $path,
            'subject_id' => (int) $request->subject_id,
        ]);

        return response()->json([
            'token' => $token,
            'rows' => $preview['rows'],
            'has_errors' => $preview['has_errors'],
            'total' => count($preview['rows']),
        ]);
    }

    /**
     * Proses import soal dari file excel yang sudah dipreview.
     */
    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
        ]);

        $token = $validated['token'];
        $meta = session()->get("question_import_{$token}");

        if (! $meta) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Data import tidak ditemukan atau sudah kadaluarsa. Silakan upload ulang file.');
        }

        $read = $this->questionImportService->readRows(storage_path('app/private/'.$meta['path']));

        if ($read['error'] !== null) {
            Storage::disk('local')->delete($meta['path']);
            session()->forget("question_import_{$token}");

            return redirect()->route('admin.questions.index')->with('error', $read['error']);
        }

        $preview = $this->questionImportService->validateRows($read['rows'], (int) $meta['subject_id']);

        if ($preview['has_errors']) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Terdapat data yang tidak valid pada file excel. Perbaiki terlebih dahulu sebelum import.');
        }

        $count = $this->questionImportService->createRecords($preview['rows'], (int) $meta['subject_id']);

        Storage::disk('local')->delete($meta['path']);
        session()->forget("question_import_{$token}");

        return redirect()
            ->route('admin.questions.index')
            ->with('success', "{$count} soal berhasil diimport.");
    }
}
