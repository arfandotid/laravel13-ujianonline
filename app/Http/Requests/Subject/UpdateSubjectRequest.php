<?php

namespace App\Http\Requests\Subject;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('subject');

        return [
            'name'        => ['required', 'string', 'max:255', Rule::unique('subjects', 'name')->ignore($id)],
            'description' => ['nullable', 'string'],
            'is_active'   => ['required', 'boolean'],
        ];
    }
}
