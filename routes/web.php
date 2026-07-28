<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

// route login
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])
    ->name('login')
    ->middleware('guest');

// route login store
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store'])
    ->name('login.store')
    ->middleware('guest');

// route logout
Route::post('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout'])
    ->name('logout');

// Forgot Password
Route::get('/forgot-password', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'create'])
    ->middleware('guest')
    ->name('password.request');

Route::post('/forgot-password', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

// Reset Password
Route::get('/reset-password/{token}', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'create'])
    ->middleware('guest')
    ->name('password.reset');

Route::post('/reset-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.update');

Route::group(['middleware' => ['auth']], function () {
    // route profile
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    // route change password
    Route::get('/profile/password', [App\Http\Controllers\ProfileController::class, 'changePassword'])->name('profile.password.index');
    Route::put('/profile/password', [App\Http\Controllers\ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

Route::group(['middleware' => ['auth', 'role:admin'], 'prefix' => 'admin'], function () {
    // route dashboard
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

    // route settings
    Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])
        ->name('admin.settings.index');

    // route settings update
    Route::put('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])
        ->name('admin.settings.update');

    // route settings delete logo
    Route::delete('/settings/delete-logo', [App\Http\Controllers\Admin\SettingController::class, 'deleteLogo'])
        ->name('admin.settings.delete-logo');

    // route resource untuk permission
    Route::resource('/permissions', App\Http\Controllers\Admin\PermissionController::class)->names('admin.permissions');

    // route resource untuk role
    Route::resource('/roles', App\Http\Controllers\Admin\RoleController::class)->names('admin.roles');

    // route resource untuk user
    Route::resource('/users', App\Http\Controllers\Admin\UserController::class)->names('admin.users');

    // route delete avatar user
    Route::delete('/users/{user}/delete-avatar', [App\Http\Controllers\Admin\UserController::class, 'deleteAvatar'])
        ->name('admin.users.delete-avatar');
});
