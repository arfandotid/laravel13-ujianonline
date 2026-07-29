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

    // route resource untuk group
    Route::resource('/groups', App\Http\Controllers\Admin\GroupController::class)->names('admin.groups');

    // route resource untuk subject
    Route::resource('/subjects', App\Http\Controllers\Admin\SubjectController::class)->names('admin.subjects');

    // route resource untuk question
    Route::resource('/questions', App\Http\Controllers\Admin\QuestionController::class)->names('admin.questions');

    // route resource untuk exam
    Route::get('/exams/{exam}/questions', [App\Http\Controllers\Admin\ExamController::class, 'questions'])->name('admin.exams.questions');
    Route::post('/exams/{exam}/questions', [App\Http\Controllers\Admin\ExamController::class, 'syncQuestions'])->name('admin.exams.questions.sync');
    Route::resource('/exams', App\Http\Controllers\Admin\ExamController::class)->names('admin.exams');

    // route resource untuk exam schedule
    Route::resource('/schedules', App\Http\Controllers\Admin\ExamScheduleController::class)->names('admin.schedules');

    // route resource untuk results
    Route::get('/results', [App\Http\Controllers\Admin\ResultController::class, 'index'])->name('admin.results.index');
    Route::get('/results/{result}', [App\Http\Controllers\Admin\ResultController::class, 'show'])->name('admin.results.show');
    Route::post('/results/{result}/grade-essay', [App\Http\Controllers\Admin\ResultController::class, 'gradeEssay'])->name('admin.results.grade-essay');
});

