<?php

namespace App\Http\Requests\ExamSchedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExamScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('schedule');

        return [
            'exam_id'   => [
                'required',
                'exists:exams,id',
                Rule::unique('exam_schedules')->where(function ($query) {
                    return $query->where('group_id', $this->group_id);
                })->ignore($id),
            ],
            'group_id'   => ['required', 'exists:groups,id'],
            'start_time' => ['required', 'date'],
            'end_time'   => ['required', 'date', 'after:start_time'],
            'is_active'  => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'exam_id.unique' => 'Jadwal untuk ujian dan group ini sudah ada.',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
        ];
    }
}
