<?php

namespace App\Http\Controllers\Admin;

use App\Models\Question;
use App\Models\Subject;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Question\StoreQuestionRequest;
use App\Http\Requests\Question\UpdateQuestionRequest;

class QuestionController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:questions.index'], only: ['index']),
            new Middleware(['permission:questions.create'], only: ['create', 'store']),
            new Middleware(['permission:questions.edit'], only: ['edit', 'update']),
            new Middleware(['permission:questions.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $questions = Question::query()
            ->with(['subject:id,name', 'options'])
            ->when(request()->q, function ($query) {
                $query->where('question_text', 'like', '%' . request()->q . '%');
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
                'subject_id'    => $request->subject_id,
                'type'          => $request->type,
                'question_text' => $request->question_text,
                'is_active'     => $request->is_active,
            ]);

            if ($request->type === 'multiple_choice' && !empty($request->options)) {
                foreach ($request->options as $index => $option) {
                    $question->options()->create([
                        'option_text' => $option['option_text'],
                        'is_correct'  => filter_var($option['is_correct'], FILTER_VALIDATE_BOOLEAN),
                        'order'       => $option['order'] ?? ($index + 1),
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
                'subject_id'    => $request->subject_id,
                'type'          => $request->type,
                'question_text' => $request->question_text,
                'is_active'     => $request->is_active,
            ]);

            // Synchronize options if multiple choice, delete existing options first or recreate
            if ($request->type === 'multiple_choice') {
                $question->options()->delete();
                if (!empty($request->options)) {
                    foreach ($request->options as $index => $option) {
                        $question->options()->create([
                            'option_text' => $option['option_text'],
                            'is_correct'  => filter_var($option['is_correct'], FILTER_VALIDATE_BOOLEAN),
                            'order'       => $option['order'] ?? ($index + 1),
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
}
