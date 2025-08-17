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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('phone')->nullable();
            $table->date('birthday')->nullable();
            $table->string('location')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('firebase_uid')->nullable()->unique();
            $table->boolean('email_verified')->default(false);
            $table->string('email_verify_token')->nullable();
            $table->string('reset_password_token')->nullable();
            $table->dateTime('reset_password_expires')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->timestamps();
            
            $table->index('email');
            $table->index('firebase_uid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}; 