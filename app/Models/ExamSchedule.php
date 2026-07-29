<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamSchedule extends Model
{
    protected $fillable = [
        'exam_id',
        'group_id',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time'   => 'datetime',
            'is_active'  => 'boolean',
        ];
    }

    /**
     * Schedule belongs to an Exam.
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Schedule belongs to a Group.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Schedule has many exam sessions (attempts).
     */
    public function examSessions(): HasMany
    {
        return $this->hasMany(ExamSession::class);
    }
}
