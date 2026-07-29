<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class AssignQuestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'questions'              => ['present', 'array'],
            'questions.*.question_id' => ['required', 'exists:questions,id'],
            'questions.*.points'      => ['required', 'integer', 'min:0'],
            'questions.*.order'       => ['required', 'integer', 'min:0'],
        ];
    }
}
