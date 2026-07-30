<?php

namespace App\Http\Controllers\Participant;

use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\ExamSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ExamController
{
    public function index(): Response
    {
        $user = Auth::user();
        $groupIds = $user->group_id ? [$user->group_id] : [];
        $now = now();

        $schedules = ExamSchedule::with(['exam.subject'])
            ->whereIn('group_id', $groupIds)
            ->where('is_active', true)
            ->get();

        // User's session map: exam_id => session
        $sessions = ExamSession::where('user_id', $user->id)
            ->get()
            ->keyBy('exam_id');

        $exams = $schedules->map(function ($schedule) use ($now, $sessions) {
            $session = $sessions->get($schedule->exam_id);

            if ($session && in_array($session->status, ['submitted', 'timed_out'])) {
                $status = 'completed';
            } elseif ($session && $session->status === 'in_progress') {
                $status = 'in_progress';
            } elseif ($now->between($schedule->start_time, $schedule->end_time)) {
                $status = 'available';
            } elseif ($schedule->start_time->gt($now)) {
                $status = 'upcoming';
            } else {
                $status = 'expired';
            }

            return [
                'schedule_id'      => $schedule->id,
                'exam_id'          => $schedule->exam_id,
                'title'            => $schedule->exam->title,
                'subject'          => $schedule->exam->subject->name ?? '-',
                'duration_minutes' => $schedule->exam->duration_minutes,
                'pass_threshold'   => $schedule->exam->pass_threshold,
                'start_time'       => $schedule->start_time,
                'end_time'         => $schedule->end_time,
                'status'           => $status,
                'session_id'       => $session?->id,
                'session_status'   => $session?->status,
                'score'            => $session?->score,
            ];
        })->sortBy('start_time')->values();

        return Inertia::render('Participant/Exams/Index', [
            'exams' => $exams,
        ]);
    }

    public function show(int|string $id): Response
    {
        $user = Auth::user();
        $groupIds = $user->group_id ? [$user->group_id] : [];
        $now = now();

        // Find schedule for this exam that belongs to user's group
        $schedule = ExamSchedule::with(['exam.subject', 'exam' => function ($q) {
            $q->withCount('questions');
        }])
            ->where('exam_id', $id)
            ->whereIn('group_id', $groupIds)
            ->where('is_active', true)
            ->firstOrFail();

        $session = ExamSession::where('exam_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($session && $session->status === 'in_progress') {
            $status = 'in_progress';
        } elseif ($session && in_array($session->status, ['submitted', 'timed_out'])) {
            $status = 'completed';
        } elseif ($now->between($schedule->start_time, $schedule->end_time)) {
            $status = 'available';
        } elseif ($schedule->start_time->gt($now)) {
            $status = 'upcoming';
        } else {
            $status = 'expired';
        }

        return Inertia::render('Participant/Exams/Show', [
            'schedule'   => $schedule,
            'exam'       => $schedule->exam,
            'status'     => $status,
            'session_id' => $session?->id,
        ]);
    }
}
