<?php

namespace App\Http\Controllers\Participant;

use App\Models\ExamSchedule;
use App\Models\ExamSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function index(): Response
    {
        $user = Auth::user();

        // Get all group IDs for this participant
        $groupIds = $user->groups()->pluck('groups.id');

        // All schedules accessible by this user's groups
        $schedules = ExamSchedule::with(['exam.subject'])
            ->whereIn('group_id', $groupIds)
            ->where('is_active', true)
            ->get();

        $now = now();

        // Session status for this user
        $sessionMap = ExamSession::where('user_id', $user->id)
            ->pluck('status', 'exam_id');

        $upcoming  = 0;
        $available = 0;
        $completed = 0;

        $upcomingExams = [];

        foreach ($schedules as $schedule) {
            $hasSession = isset($sessionMap[$schedule->exam_id]);
            $sessionStatus = $sessionMap[$schedule->exam_id] ?? null;

            if ($hasSession && in_array($sessionStatus, ['submitted', 'timed_out'])) {
                $completed++;
            } elseif ($now->between($schedule->start_time, $schedule->end_time)) {
                $available++;
                $upcomingExams[] = [
                    'schedule_id'      => $schedule->id,
                    'exam_id'          => $schedule->exam_id,
                    'title'            => $schedule->exam->title,
                    'subject'          => $schedule->exam->subject->name ?? '-',
                    'duration_minutes' => $schedule->exam->duration_minutes,
                    'start_time'       => $schedule->start_time,
                    'end_time'         => $schedule->end_time,
                    'status'           => 'available',
                    'session_status'   => $sessionStatus,
                ];
            } elseif ($schedule->start_time->gt($now)) {
                $upcoming++;
                $upcomingExams[] = [
                    'schedule_id'      => $schedule->id,
                    'exam_id'          => $schedule->exam_id,
                    'title'            => $schedule->exam->title,
                    'subject'          => $schedule->exam->subject->name ?? '-',
                    'duration_minutes' => $schedule->exam->duration_minutes,
                    'start_time'       => $schedule->start_time,
                    'end_time'         => $schedule->end_time,
                    'status'           => 'upcoming',
                    'session_status'   => null,
                ];
            }
        }

        // Sort by start_time
        usort($upcomingExams, fn($a, $b) => $a['start_time'] <=> $b['start_time']);

        $stats = [
            'upcoming'  => $upcoming,
            'available' => $available,
            'completed' => $completed,
        ];

        return Inertia::render('Participant/Dashboard/Index', [
            'stats'        => $stats,
            'upcomingExams' => array_slice($upcomingExams, 0, 5),
        ]);
    }
}
