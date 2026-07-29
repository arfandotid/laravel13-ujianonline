<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'subject_id',
        'title',
        'description',
        'duration_minutes',
        'pass_threshold',
        'shuffle_questions',
        'shuffle_answers',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'shuffle_questions' => 'boolean',
            'shuffle_answers'   => 'boolean',
            'is_active'         => 'boolean',
        ];
    }

    /**
     * Exam belongs to a Subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Exam has many questions via pivot (reusable question bank).
     */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'exam_question')
                    ->withPivot('points', 'order')
                    ->withTimestamps();
    }

    /**
     * Exam has many schedules (per group).
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(ExamSchedule::class);
    }

    /**
     * Exam has many sessions (attempts).
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(ExamSession::class);
    }
}
