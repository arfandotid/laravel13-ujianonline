<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $userId,
            'username'  => 'required|string|max:50|unique:users,username,' . $userId,
            'password'  => 'nullable|min:8',
            'roles'     => 'required|array',
            'roles.*'   => 'exists:roles,id',
            'is_active' => 'required',
            'avatar'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
