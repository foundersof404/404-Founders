<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'birthday',
        'location',
        'profile_picture',
        'firebase_uid',
        'email_verified',
        'email_verify_token',
        'reset_password_token',
        'reset_password_expires',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verify_token',
        'reset_password_token',
        'reset_password_expires',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified' => 'boolean',
        'is_admin' => 'boolean',
        'password' => 'hashed',
        'birthday' => 'date',
        'reset_password_expires' => 'datetime',
    ];

    /**
     * Get the gallery items for the user.
     */
    public function galleryItems(): HasMany
    {
        return $this->hasMany(GalleryItem::class);
    }
} 