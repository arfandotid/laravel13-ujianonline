<?php

namespace App\Http\Controllers\Admin;

use App\Models\ExamSession;
use App\Models\ParticipantAnswer;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Result\GradeEssayRequest;
use Illuminate\Support\Facades\DB;

class ResultController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:results.index'], only: ['index']),
            new Middleware(['permission:results.show'], only: ['show', 'gradeEssay']),
        ];
    }

    public function index(): Response
    {
        $results = ExamSession::query()
            ->with(['user', 'exam', 'examSchedule.group'])
            ->when(request()->q, function ($query) {
                $query->whereHas('user', function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%')
                      ->orWhere('username', 'like', '%' . request()->q . '%');
                })->orWhereHas('exam', function ($q) {
                    $q->where('title', 'like', '%' . request()->q . '%');
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Results/Index', compact('results'));
    }

    public function show(int|string $id): Response
    {
        $session = ExamSession::with([
            'user',
            'exam.subject',
            'examSchedule.group',
            'answers.question.options',
        ])->findOrFail($id);

        // Fetch exam_question points map for score calculation
        $examQuestionPoints = DB::table('exam_question')
            ->where('exam_id', $session->exam_id)
            ->pluck('points', 'question_id');

        return Inertia::render('Admin/Results/Show', compact('session', 'examQuestionPoints'));
    }

    public function gradeEssay(GradeEssayRequest $request, int|string $id): RedirectResponse
    {
        $session = ExamSession::findOrFail($id);
        $answer = ParticipantAnswer::where('exam_session_id', $session->id)
            ->findOrFail($request->participant_answer_id);

        $answer->update([
            'points_earned' => $request->points_earned,
            'is_correct'    => $request->points_earned > 0,
        ]);

        // Recalculate total score
        $totalMaxPoints = DB::table('exam_question')
            ->where('exam_id', $session->exam_id)
            ->sum('points');

        $totalEarnedPoints = ParticipantAnswer::where('exam_session_id', $session->id)
            ->sum('points_earned');

        $score = $totalMaxPoints > 0 ? round(($totalEarnedPoints / $totalMaxPoints) * 100, 2) : 0;

        $session->update([
            'score' => $score,
        ]);

        return redirect()->route('admin.results.show', $session->id)->with('success', 'Nilai essay berhasil diperbarui.');
    }
}
