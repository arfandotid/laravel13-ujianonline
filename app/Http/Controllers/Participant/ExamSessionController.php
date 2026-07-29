<?php

namespace App\Http\Controllers\Participant;

use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\ExamSession;
use App\Models\ParticipantAnswer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExamSessionController
{
    /**
     * Start a new exam session.
     */
    public function start(int|string $id): RedirectResponse
    {
        $user = Auth::user();
        $groupIds = $user->groups()->pluck('groups.id');
        $now = now();

        // Find the schedule for this exam belonging to user's group
        $schedule = ExamSchedule::where('exam_id', $id)
            ->whereIn('group_id', $groupIds)
            ->where('is_active', true)
            ->firstOrFail();

        // Validate time window
        if (!$now->between($schedule->start_time, $schedule->end_time)) {
            return redirect()->route('participant.exams.show', $id)
                ->with('error', 'Ujian tidak dalam jadwal yang aktif.');
        }

        // Check existing session (one attempt only)
        $existingSession = ExamSession::where('exam_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingSession) {
            if ($existingSession->status === 'in_progress') {
                return redirect()->route('participant.sessions.show', $existingSession->id);
            }
            return redirect()->route('participant.exams.show', $id)
                ->with('error', 'Anda sudah mengerjakan ujian ini.');
        }

        $exam = Exam::with(['questions.options'])->findOrFail($id);

        // Build question order
        $questions = $exam->questions->sortBy('pivot.order');
        $questionIds = $questions->pluck('id')->toArray();
        if ($exam->shuffle_questions) {
            shuffle($questionIds);
        }

        // Build option orders (shuffle per question if needed)
        $optionOrders = [];
        foreach ($questions as $question) {
            $optionIds = $question->options->sortBy('order')->pluck('id')->toArray();
            if ($exam->shuffle_answers) {
                shuffle($optionIds);
            }
            $optionOrders[$question->id] = $optionIds;
        }

        // Create session
        $session = ExamSession::create([
            'exam_id'          => $id,
            'user_id'          => $user->id,
            'exam_schedule_id' => $schedule->id,
            'started_at'       => $now,
            'status'           => 'in_progress',
            'question_order'   => $questionIds,
            'option_orders'    => $optionOrders,
        ]);

        return redirect()->route('participant.sessions.show', $session->id);
    }

    /**
     * Show the exam session (exam-taking interface).
     */
    public function show(int|string $sessionId): Response|RedirectResponse
    {
        $user = Auth::user();

        $session = ExamSession::with([
            'exam.subject',
            'exam.questions.options',
            'answers',
        ])->where('user_id', $user->id)->findOrFail($sessionId);

        // If session already done, redirect to result
        if (in_array($session->status, ['submitted', 'timed_out'])) {
            return redirect()->route('participant.sessions.result', $sessionId);
        }

        // Calculate time remaining
        $exam = $session->exam;
        $endTime = $session->started_at->copy()->addMinutes($exam->duration_minutes);

        // Also consider schedule end_time as hard limit
        $schedule = $session->examSchedule;
        if ($schedule && $schedule->end_time->lt($endTime)) {
            $endTime = $schedule->end_time;
        }

        $secondsRemaining = max(0, $endTime->diffInSeconds(now(), false) * -1);

        // If time has expired, auto-submit
        if ($secondsRemaining <= 0) {
            $this->processSubmit($session, 'timed_out');
            return redirect()->route('participant.sessions.result', $sessionId);
        }

        // Build ordered questions with shuffled options
        $questionOrder = $session->question_order ?? [];
        $optionOrders  = $session->option_orders ?? [];

        $questionsById = $exam->questions->keyBy('id');
        $orderedQuestions = collect($questionOrder)->map(function ($qId) use ($questionsById, $optionOrders) {
            $question = $questionsById->get($qId);
            if (!$question) return null;

            $options = $question->options->keyBy('id');
            $orderedOptionIds = $optionOrders[$qId] ?? $options->keys()->toArray();

            return [
                'id'           => $question->id,
                'type'         => $question->type,
                'question_text' => $question->question_text,
                'points'       => $question->pivot->points,
                'options'      => collect($orderedOptionIds)->map(fn($oid) => $options->get($oid))
                    ->filter()
                    ->map(fn($o) => ['id' => $o->id, 'option_text' => $o->option_text])
                    ->values(),
            ];
        })->filter()->values();

        // Build answers map: question_id => answer_text
        $answersMap = $session->answers->pluck('answer_text', 'question_id');

        return Inertia::render('Participant/Sessions/Show', [
            'session'          => [
                'id'         => $session->id,
                'started_at' => $session->started_at,
                'status'     => $session->status,
            ],
            'exam'             => [
                'id'               => $exam->id,
                'title'            => $exam->title,
                'description'      => $exam->description,
                'duration_minutes' => $exam->duration_minutes,
                'subject'          => $exam->subject->name ?? '-',
            ],
            'questions'        => $orderedQuestions,
            'answers'          => $answersMap,
            'seconds_remaining' => $secondsRemaining,
            'end_time'         => $endTime->toIso8601String(),
        ]);
    }

    /**
     * Save a single answer (auto-save).
     */
    public function saveAnswer(Request $request, int|string $sessionId): \Illuminate\Http\JsonResponse
    {
        $user = Auth::user();

        $session = ExamSession::where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->findOrFail($sessionId);

        $request->validate([
            'question_id' => 'required|integer',
            'answer_text' => 'nullable|string',
        ]);

        ParticipantAnswer::updateOrCreate(
            [
                'exam_session_id' => $session->id,
                'question_id'     => $request->question_id,
            ],
            [
                'answer_text' => $request->answer_text,
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Submit the exam manually.
     */
    public function submit(int|string $sessionId): RedirectResponse
    {
        $user = Auth::user();

        $session = ExamSession::where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->findOrFail($sessionId);

        $this->processSubmit($session, 'submitted');

        return redirect()->route('participant.sessions.result', $sessionId)
            ->with('success', 'Ujian berhasil dikumpulkan!');
    }

    /**
     * Show the result page after submission.
     */
    public function result(int|string $sessionId): Response
    {
        $user = Auth::user();

        $session = ExamSession::with([
            'exam.subject',
            'exam.questions.options',
            'answers',
        ])->where('user_id', $user->id)->findOrFail($sessionId);

        $exam = $session->exam;

        // Build question order for display
        $questionOrder = $session->question_order ?? $exam->questions->pluck('id')->toArray();
        $questionsById = $exam->questions->keyBy('id');
        $answersMap = $session->answers->keyBy('question_id');

        $results = collect($questionOrder)->map(function ($qId) use ($questionsById, $answersMap) {
            $question = $questionsById->get($qId);
            if (!$question) return null;

            $answer = $answersMap->get($qId);
            $correctOption = $question->options->firstWhere('is_correct', true);

            return [
                'id'             => $question->id,
                'type'           => $question->type,
                'question_text'  => $question->question_text,
                'points'         => $question->pivot->points,
                'options'        => $question->options->map(fn($o) => [
                    'id'          => $o->id,
                    'option_text' => $o->option_text,
                    'is_correct'  => $o->is_correct,
                ])->values(),
                'answer_text'    => $answer?->answer_text,
                'is_correct'     => $answer?->is_correct,
                'points_earned'  => $answer?->points_earned,
                'correct_option_id' => $correctOption?->id,
            ];
        })->filter()->values();

        return Inertia::render('Participant/Sessions/Result', [
            'session' => [
                'id'           => $session->id,
                'started_at'   => $session->started_at,
                'submitted_at' => $session->submitted_at,
                'status'       => $session->status,
                'score'        => $session->score,
            ],
            'exam' => [
                'id'             => $exam->id,
                'title'          => $exam->title,
                'subject'        => $exam->subject->name ?? '-',
                'pass_threshold' => $exam->pass_threshold,
            ],
            'results' => $results,
        ]);
    }

    /**
     * Process exam submission: auto-grade MCQ, calculate score, update session.
     */
    private function processSubmit(ExamSession $session, string $status): void
    {
        $exam = Exam::with(['questions' => function ($q) {
            $q->with('options')->withPivot('points');
        }])->findOrFail($session->exam_id);

        $answers = ParticipantAnswer::where('exam_session_id', $session->id)->get()->keyBy('question_id');

        $totalPoints    = 0;
        $earnedPoints   = 0;

        DB::transaction(function () use ($exam, $answers, $session, $status, &$totalPoints, &$earnedPoints) {
            foreach ($exam->questions as $question) {
                $points = $question->pivot->points ?? 0;
                $totalPoints += $points;

                $answer = $answers->get($question->id);

                if (!$answer) continue;

                if ($question->type === 'multiple_choice') {
                    $correctOption = $question->options->firstWhere('is_correct', true);
                    $isCorrect = $correctOption && (string) $answer->answer_text === (string) $correctOption->id;
                    $pointsEarned = $isCorrect ? $points : 0;

                    $answer->update([
                        'is_correct'    => $isCorrect,
                        'points_earned' => $pointsEarned,
                    ]);

                    $earnedPoints += $pointsEarned;
                } else {
                    // Essay: no auto-grade, points_earned remains null
                    $earnedPoints += 0;
                }
            }

            $score = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;

            $session->update([
                'submitted_at' => now(),
                'status'       => $status,
                'score'        => $score,
            ]);
        });
    }
}
