<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    public function index()
    {
        $applications = JobApplication::with('job')->orderBy('created_at', 'desc')->get();
        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'message' => 'required|string',
            'cv' => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('cv')) {
            $path = $request->file('cv')->store('cvs');
            $validated['cv_path'] = $path;
        }

        $application = JobApplication::create($validated);
        return response()->json($application, 201);
    }

    public function update(Request $request, JobApplication $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,accepted,rejected',
        ]);

        $application->update($validated);
        return response()->json($application);
    }

    public function destroy(JobApplication $application)
    {
        if ($application->cv_path) {
            Storage::delete($application->cv_path);
        }
        $application->delete();
        return response()->json(null, 204);
    }

    public function downloadCV(JobApplication $application)
    {
        if (!$application->cv_path) {
            return response()->json(['message' => 'CV not found'], 404);
        }

        return Storage::download($application->cv_path);
    }
} 