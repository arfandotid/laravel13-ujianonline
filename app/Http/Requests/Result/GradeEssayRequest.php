<?php

namespace App\Http\Requests\Result;

use Illuminate\Foundation\Http\FormRequest;

class GradeEssayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'participant_answer_id' => ['required', 'exists:participant_answers,id'],
            'points_earned'         => ['required', 'numeric', 'min:0'],
        ];
    }
}
