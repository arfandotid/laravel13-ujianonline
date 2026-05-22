<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Traits\FileUploadTrait;

class ProfileController extends Controller
{
    use FileUploadTrait;

    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Profile/Index', compact('user'));
    }

    public function update(Request $request)
    {
        $userId = Auth::user()->id;
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
            'username' => 'required|string|max:255|unique:users,username,' . $userId,
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

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
            return redirect()->to('/profile')->with('error', 'Failed to update profile: ' . $e->getMessage());
        }

        return redirect()->to('/profile')->with('success', 'Profile updated successfully.');
    }

    public function changePassword()
    {
        return Inertia::render('Profile/ChangePassword');
    }

    public function updatePassword(Request $request)
    {
        $userId = Auth::user()->id;
        $request->validate([
            'current_password'  => 'required|string',
            'password'          => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($userId);

        if (!Hash::check($request->current_password, $user->password)) {
            return redirect()->to('/profile/password')
                ->withErrors(
                    ['current_password' => 'Current password is incorrect.']
                );
        }

        if (Hash::check($request->password, $user->password)) {
            return redirect()->to('/profile/password')
                ->withErrors(
                    ['password' => 'New password must be different from current password.']
                );
        }

        $user->password = bcrypt($request->password);

        try {
            $user->save();
        } catch (\Exception $e) {
            return redirect()->to('/profile/password')->with('error', 'Failed to update password: ' . $e->getMessage());
        }

        return redirect()->to('/profile/password')->with('success', 'Password updated successfully.');
    }
}
