<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'username'  => 'required|string|max:50|unique:users,username',
            'password'  => 'required|min:8',
            'roles'     => 'required|array',
            'roles.*'   => 'exists:roles,id',
            'is_active' => 'required',
            'group_id'  => ['nullable', 'integer', 'exists:groups,id'],
            'avatar'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
