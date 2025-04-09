<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ExitClearanceAuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:6',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    // Check if user exists
    if (!$user || $user->system_type !== 'inventory') {
        return back()->withErrors([
            'email' => 'User not found or invalid system type.',
        ]);
    }

    // Check password
    if (!Hash::check($credentials['password'], $user->password)) {
        return back()->withErrors([
            'password' => 'Invalid password.',
        ]);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return redirect()->route('inventory-dashboard');
}

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed'],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'system_type' => 'exitclearance',
        ]);

        return redirect()->route('exitclearance-login-page')->with('success', 'Account created successfully. Please log in.');
    }
}
