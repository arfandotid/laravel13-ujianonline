<?php

namespace App\Http\Controllers\Admin;

use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function index(): Response
    {
        $totalUsers    = User::count();
        $totalExams    = Exam::count();
        $totalSessions = ExamSession::count();
        $avgScore      = ExamSession::where('status', 'submitted')->avg('score');

        $statusDistribution = ExamSession::selectRaw("status, COUNT(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status');

        $scoreBySubject = ExamSession::where('exam_sessions.status', 'submitted')
            ->join('exams', 'exam_sessions.exam_id', '=', 'exams.id')
            ->join('subjects', 'exams.subject_id', '=', 'subjects.id')
            ->selectRaw("subjects.name, ROUND(AVG(exam_sessions.score), 2) as avg_score")
            ->groupBy('subjects.name')
            ->orderByDesc('avg_score')
            ->get();

        $dailySessions = ExamSession::selectRaw("DATE(created_at) as date, COUNT(*) as count")
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $scoreByGroup = ExamSession::where('exam_sessions.status', 'submitted')
            ->join('exam_schedules', 'exam_sessions.exam_schedule_id', '=', 'exam_schedules.id')
            ->join('groups', 'exam_schedules.group_id', '=', 'groups.id')
            ->selectRaw("groups.name, ROUND(AVG(exam_sessions.score), 2) as avg_score")
            ->groupBy('groups.name')
            ->orderByDesc('avg_score')
            ->get();

        $latestSessions = ExamSession::with(['user:id,name', 'exam:id,title'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard/Index', compact(
            'totalUsers',
            'totalExams',
            'totalSessions',
            'avgScore',
            'statusDistribution',
            'scoreBySubject',
            'dailySessions',
            'scoreByGroup',
            'latestSessions',
        ));
    }
}
