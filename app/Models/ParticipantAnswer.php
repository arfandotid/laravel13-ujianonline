<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantAnswer extends Model
{
    protected $fillable = [
        'exam_session_id',
        'question_id',
        'answer_text',
        'is_correct',
        'points_earned',
    ];

    protected function casts(): array
    {
        return [
            'is_correct'    => 'boolean',
            'points_earned' => 'decimal:2',
        ];
    }

    /**
     * Answer belongs to an ExamSession.
     */
    public function examSession(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class);
    }

    /**
     * Answer belongs to a Question.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
