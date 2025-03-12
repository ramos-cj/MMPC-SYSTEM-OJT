<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExitClearanceAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (Auth::attempt(array_merge($credentials, ['system_type' => 'exitclearance']))) {
            $request->session()->regenerate();
            return redirect()->route('exitclearance-dashboard');
        }

        return back()->withErrors([
            'email' => 'Invalid login credentials or system type.',
        ]);
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
