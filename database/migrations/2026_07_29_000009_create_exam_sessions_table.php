<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('exam_schedule_id')->constrained('exam_schedules');
            $table->dateTime('started_at');
            $table->dateTime('submitted_at')->nullable();
            $table->enum('status', ['in_progress', 'submitted', 'timed_out']);
            $table->decimal('score', 5, 2)->nullable();
            $table->json('question_order')->nullable();
            $table->json('option_orders')->nullable();
            $table->timestamps();

            // Satu peserta hanya boleh satu kali attempt per ujian
            $table->unique(['exam_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_sessions');
    }
};
