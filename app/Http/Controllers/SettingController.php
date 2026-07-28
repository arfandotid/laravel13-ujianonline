<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use App\Traits\FileUploadTrait;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Requests\Setting\UpdateSettingRequest;

class SettingController implements HasMiddleware
{
    use FileUploadTrait;

    public static function middleware()
    {
        return [
            new Middleware(['permission:settings.index'], only: ['index']),
            new Middleware(['permission:settings.update'], only: ['update', 'deleteLogo']),
        ];
    }

    public function index(): Response
    {
        $setting = Setting::first();

        return Inertia::render('Settings/Index', compact('setting'));
    }

    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        $setting = Setting::firstOrFail();

        $data = $request->only([
            'app_name',
            'app_logo',
        ]);

        if ($request->hasFile('app_logo')) {
            if ($setting->app_logo) {
                $this->deleteFile($setting->app_logo);
            }

            $data['app_logo'] = $this->uploadFile($request, 'app_logo', 'uploads/settings/logo');
        } else {
            $data['app_logo'] = $setting->app_logo;
        }

        $setting->update($data);

        return redirect()->route('settings.index')->with('success', 'Setting updated successfully.');
    }

    public function deleteLogo(): RedirectResponse
    {
        $setting = Setting::firstOrFail();

        if ($setting->app_logo) {
            $path = 'uploads/settings/logo/';
            $this->deleteFile($path . $setting->app_logo);
        }

        $setting->update([
            'app_logo' => null,
        ]);

        return redirect()->route('settings.index')->with('success', 'Logo aplikasi berhasil dihapus.');
    }
}
