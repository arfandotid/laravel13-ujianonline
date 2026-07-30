<?php

namespace App\Http\Controllers\Admin;

use App\Models\Group;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Group\StoreGroupRequest;
use App\Http\Requests\Group\UpdateGroupRequest;

class GroupController implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['permission:groups.index'], only: ['index']),
            new Middleware(['permission:groups.create'], only: ['create', 'store']),
            new Middleware(['permission:groups.edit'], only: ['edit', 'update']),
            new Middleware(['permission:groups.delete'], only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        $groups = Group::query()
            ->when(request()->q, function ($query) {
                $query->where('name', 'like', '%' . request()->q . '%')
                      ->orWhere('description', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Admin/Groups/Index', compact('groups'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Groups/Create');
    }

    public function store(StoreGroupRequest $request): RedirectResponse
    {
        Group::create([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->is_active,
        ]);

        return redirect()->route('admin.groups.index')->with('success', 'Group created successfully.');
    }

    public function edit(int|string $id): Response
    {
        $group = Group::findOrFail($id);

        return Inertia::render('Admin/Groups/Edit', compact('group'));
    }

    public function update(UpdateGroupRequest $request, int|string $id): RedirectResponse
    {
        $group = Group::findOrFail($id);

        $group->update([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->is_active,
        ]);

        return redirect()->route('admin.groups.index')->with('success', 'Group updated successfully.');
    }

    public function destroy(int|string $id): RedirectResponse
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return redirect()->route('admin.groups.index')->with('success', 'Group deleted successfully.');
    }

}
