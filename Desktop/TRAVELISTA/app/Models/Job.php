<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'requirements',
        'location',
        'salary',
        'type',
        'posted_date'
    ];

    protected $casts = [
        'posted_date' => 'datetime'
    ];

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
} 