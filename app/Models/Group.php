<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Group has many members (Users) via pivot.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_user')
                    ->withTimestamps();
    }

    /**
     * Group has many exam schedules.
     */
    public function examSchedules(): HasMany
    {
        return $this->hasMany(ExamSchedule::class);
    }
}
