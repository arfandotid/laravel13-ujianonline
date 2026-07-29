<?php

namespace App\Http\Requests\Question;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'subject_id'    => ['required', 'exists:subjects,id'],
            'type'          => ['required', 'in:multiple_choice,essay'],
            'question_text' => ['required', 'string'],
            'is_active'     => ['required', 'boolean'],
        ];

        if ($this->input('type') === 'multiple_choice') {
            $rules['options']                = ['required', 'array', 'min:2'];
            $rules['options.*.option_text']  = ['required', 'string'];
            $rules['options.*.is_correct']   = ['required', 'boolean'];
            $rules['options.*.order']        = ['nullable', 'integer'];
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('type') === 'multiple_choice') {
                $options = $this->input('options', []);
                $hasCorrect = collect($options)->contains(function ($option) {
                    return isset($option['is_correct']) && filter_var($option['is_correct'], FILTER_VALIDATE_BOOLEAN);
                });

                if (!$hasCorrect) {
                    $validator->errors()->add('options', 'Pilihan ganda harus memiliki setidaknya 1 jawaban yang benar.');
                }
            }
        });
    }
}
