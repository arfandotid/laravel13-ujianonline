<?php

namespace App\Http\Controllers\Admin;

use App\Models\Subject;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Subject\StoreSubjectRequest;
use App\Http\Requests\Subject\UpdateSubjectRequest;

class SubjectController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:subjects.index'], only: ['index']),
            new Middleware(['permission:subjects.create'], only: ['create', 'store']),
            new Middleware(['permission:subjects.edit'], only: ['edit', 'update']),
            new Middleware(['permission:subjects.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $subjects = Subject::query()
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%' . request()->q . '%')
                      ->orWhere('description', 'like', '%' . request()->q . '%');
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
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'is_active'   => $request->is_active,
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
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'is_active'   => $request->is_active,
        ]);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->route('admin.subjects.index')->with('success', 'Subject deleted successfully.');
    }
}
