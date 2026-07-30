<?php

namespace App\Http\Controllers\Admin;

use App\Models\ExamSchedule;
use App\Models\Exam;
use App\Models\Group;
use App\Models\Subject;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\ExamSchedule\StoreExamScheduleRequest;
use App\Http\Requests\ExamSchedule\UpdateExamScheduleRequest;

class ExamScheduleController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:exams.index'], only: ['index']),
            new Middleware(['permission:exams.create'], only: ['create', 'store']),
            new Middleware(['permission:exams.edit'], only: ['edit', 'update']),
            new Middleware(['permission:exams.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $schedules = ExamSchedule::query()
            ->with(['exam.subject', 'group'])
            ->when(request()->q, function ($query) {
                $query->whereHas('exam', function ($q) {
                    $q->where('title', 'like', '%' . request()->q . '%');
                })->orWhereHas('group', function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%');
                });
            })
            ->when(request()->subject_id, function ($query) {
                $query->whereHas('exam', fn($q) => $q->where('subject_id', request()->subject_id));
            })
            ->when(request()->group_id, function ($query) {
                $query->where('group_id', request()->group_id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $subjects = Subject::select('id', 'name')->orderBy('name')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/ExamSchedules/Index', compact('schedules', 'subjects', 'groups'));
    }

    public function create(): Response
    {
        $exams = Exam::where('is_active', true)->select('id', 'title')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/ExamSchedules/Create', compact('exams', 'groups'));
    }

    public function store(StoreExamScheduleRequest $request): RedirectResponse
    {
        ExamSchedule::create([
            'exam_id'    => $request->exam_id,
            'group_id'   => $request->group_id,
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
            'is_active'  => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.schedules.index')->with('success', 'Jadwal ujian berhasil ditambahkan.');
    }

    public function edit(int|string $id): Response
    {
        $schedule = ExamSchedule::findOrFail($id);
        $exams = Exam::where('is_active', true)->select('id', 'title')->get();
        $groups = Group::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Admin/ExamSchedules/Edit', compact('schedule', 'exams', 'groups'));
    }

    public function update(UpdateExamScheduleRequest $request, int|string $id): RedirectResponse
    {
        $schedule = ExamSchedule::findOrFail($id);

        $schedule->update([
            'exam_id'    => $request->exam_id,
            'group_id'   => $request->group_id,
            'start_time' => $request->start_time,
            'end_time'   => $request->end_time,
            'is_active'  => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.schedules.index')->with('success', 'Jadwal ujian berhasil diperbarui.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $schedule = ExamSchedule::findOrFail($id);
        $schedule->delete();

        return redirect()->route('admin.schedules.index')->with('success', 'Jadwal ujian berhasil dihapus.');
    }
}
