<?php

namespace App\Http\Controllers\Admin;

use App\Models\Exam;
use App\Models\Subject;
use App\Models\Question;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Exam\StoreExamRequest;
use App\Http\Requests\Exam\UpdateExamRequest;
use App\Http\Requests\Exam\AssignQuestionsRequest;

class ExamController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:exams.index'], only: ['index', 'questions']),
            new Middleware(['permission:exams.create'], only: ['create', 'store']),
            new Middleware(['permission:exams.edit'], only: ['edit', 'update', 'syncQuestions']),
            new Middleware(['permission:exams.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $exams = Exam::query()
            ->with(['subject'])
            ->withCount('questions')
            ->when(request()->q, function ($query) {
                $query->where('title', 'like', '%' . request()->q . '%')
                      ->orWhereHas('subject', function ($q) {
                          $q->where('name', 'like', '%' . request()->q . '%');
                      });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Exams/Index', compact('exams'));
    }

    public function create(): Response
    {
        $subjects = Subject::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/Exams/Create', compact('subjects'));
    }

    public function store(StoreExamRequest $request): RedirectResponse
    {
        Exam::create([
            'subject_id'        => $request->subject_id,
            'title'             => $request->title,
            'description'       => $request->description,
            'duration_minutes'  => $request->duration_minutes,
            'pass_threshold'    => $request->pass_threshold,
            'shuffle_questions' => $request->shuffle_questions ?? false,
            'shuffle_answers'   => $request->shuffle_answers ?? false,
            'is_active'         => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.exams.index')->with('success', 'Ujian berhasil dibuat.');
    }

    public function edit(int|string $id): Response
    {
        $exam = Exam::findOrFail($id);
        $subjects = Subject::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/Exams/Edit', compact('exam', 'subjects'));
    }

    public function update(UpdateExamRequest $request, int|string $id): RedirectResponse
    {
        $exam = Exam::findOrFail($id);

        $exam->update([
            'subject_id'        => $request->subject_id,
            'title'             => $request->title,
            'description'       => $request->description,
            'duration_minutes'  => $request->duration_minutes,
            'pass_threshold'    => $request->pass_threshold,
            'shuffle_questions' => $request->shuffle_questions ?? false,
            'shuffle_answers'   => $request->shuffle_answers ?? false,
            'is_active'         => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.exams.index')->with('success', 'Ujian berhasil diperbarui.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return redirect()->route('admin.exams.index')->with('success', 'Ujian berhasil dihapus.');
    }

    public function questions(int|string $id): Response
    {
        $exam = Exam::with(['subject', 'questions' => function ($q) {
            $q->with('options');
        }])->findOrFail($id);

        // Available active questions from the same subject
        $availableQuestions = Question::with('options')
            ->where('subject_id', $exam->subject_id)
            ->where('is_active', true)
            ->get();

        return Inertia::render('Admin/Exams/Questions', compact('exam', 'availableQuestions'));
    }

    public function syncQuestions(AssignQuestionsRequest $request, int|string $id): RedirectResponse
    {
        $exam = Exam::findOrFail($id);

        $syncData = [];
        foreach ($request->questions as $item) {
            $syncData[$item['question_id']] = [
                'points' => $item['points'],
                'order'  => $item['order'],
            ];
        }

        $exam->questions()->sync($syncData);

        return redirect()->route('admin.exams.index')->with('success', 'Soal ujian berhasil disimpan.');
    }
}
