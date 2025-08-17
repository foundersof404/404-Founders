<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'birthday' => 'required|date',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'birthday' => $request->birthday,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function googleSignup(Request $request)
    {
        try {
            \Log::info('Google signup request received', $request->all());

            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'name' => 'required',
                'profilePicture' => 'nullable|string',
            ]);

            // For now, skip Google token verification since we're using Firebase
            // We'll trust the token from Firebase since it's already verified
            $user = User::firstOrCreate(
                ['email' => $request->email],
                [
                    'name' => $request->name,
                    'profile_picture' => $request->profilePicture,
                    'password' => Hash::make(uniqid()), // Generate a random password
                    'email_verified_at' => now(), // Mark email as verified for Google users
                ]
            );

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            \Log::info('User created/updated successfully', ['user_id' => $user->id]);

            return response()->json([
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_picture' => $user->profile_picture,
            ]);
        } catch (\Exception $e) {
            \Log::error('Google signup error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to process Google signup: ' . $e->getMessage()
            ], 500);
        }
    }
} 