<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Traits\FileUploadTrait;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\UpdatePasswordRequest;

class ProfileController
{
    use FileUploadTrait;

    public function index(): Response
    {
        $user = Auth::user();
        return Inertia::render('Profile/Index', compact('user'));
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $userId = Auth::id();
        $user = User::findOrFail($userId);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->username = $request->username;

        if ($request->hasFile('avatar')) {
            $user->avatar = $this->updateFile($request, 'avatar', 'uploads/avatars', $user->avatar);
        }

        try {
            $user->save();
        } catch (\Exception $e) {
            return redirect()->route('profile.index')->with('error', 'Failed to update profile: ' . $e->getMessage());
        }

        return redirect()->route('profile.index')->with('success', 'Profile updated successfully.');
    }

    public function changePassword(): Response
    {
        return Inertia::render('Profile/ChangePassword');
    }

    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $userId = Auth::id();
        $user = User::findOrFail($userId);

        if (!Hash::check($request->current_password, $user->password)) {
            return redirect()->route('profile.password.index')
                ->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        if (Hash::check($request->password, $user->password)) {
            return redirect()->route('profile.password.index')
                ->withErrors(['password' => 'New password must be different from current password.']);
        }

        $user->password = Hash::make($request->password);

        try {
            $user->save();
        } catch (\Exception $e) {
            return redirect()->route('profile.password.index')->with('error', 'Failed to update password: ' . $e->getMessage());
        }

        return redirect()->route('profile.password.index')->with('success', 'Password updated successfully.');
    }
}
