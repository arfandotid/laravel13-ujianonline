<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamSession extends Model
{
    protected $fillable = [
        'exam_id',
        'user_id',
        'exam_schedule_id',
        'started_at',
        'submitted_at',
        'status',
        'score',
        'question_order',
        'option_orders',
    ];

    protected function casts(): array
    {
        return [
            'started_at'     => 'datetime',
            'submitted_at'   => 'datetime',
            'score'          => 'decimal:2',
            'question_order' => 'array',
            'option_orders'  => 'array',
        ];
    }

    /**
     * Session belongs to an Exam.
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Session belongs to a User (participant).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Session belongs to an ExamSchedule.
     */
    public function examSchedule(): BelongsTo
    {
        return $this->belongsTo(ExamSchedule::class);
    }

    /**
     * Session has many participant answers.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(ParticipantAnswer::class);
    }
}
