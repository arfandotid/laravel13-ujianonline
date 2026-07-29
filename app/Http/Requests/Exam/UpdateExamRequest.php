<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id'        => ['required', 'exists:subjects,id'],
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['nullable', 'string'],
            'duration_minutes'  => ['required', 'integer', 'min:1'],
            'pass_threshold'    => ['required', 'integer', 'min:0', 'max:100'],
            'shuffle_questions' => ['boolean'],
            'shuffle_answers'   => ['boolean'],
            'is_active'         => ['boolean'],
        ];
    }
}
