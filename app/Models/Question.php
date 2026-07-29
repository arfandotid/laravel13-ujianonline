<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'subject_id',
        'type',
        'question_text',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Question belongs to a Subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Question has many options (MCQ).
     */
    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }

    /**
     * Question belongs to many Exams via pivot.
     */
    public function exams(): BelongsToMany
    {
        return $this->belongsToMany(Exam::class, 'exam_question')
                    ->withPivot('points', 'order')
                    ->withTimestamps();
    }

    /**
     * Question has many participant answers.
     */
    public function participantAnswers(): HasMany
    {
        return $this->hasMany(ParticipantAnswer::class);
    }
}
