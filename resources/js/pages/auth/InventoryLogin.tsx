import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, User, X } from 'lucide-react';
import mmpcLogo from '../../assets/mmpc-logo.png';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/header'; // Import Header component
import '@/styles/Login.css';

export default function InventoryLogin() {
    const [isLogin, setIsLogin] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        auth_email: '',             // ← new
        auth_password: '',          // ← new
        system_type: 'inventory',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isLogin ? 'inventory-login' : 'inventory-register';
    
        post(route(routeName), {
            preserveScroll: true,
            onSuccess: () => {
                if (!isLogin) {
                    alert('Account registered successfully! Please log in.');
                    router.visit(route('inventory-login-page'));
                }
            },
            onError: (errors) => {
                if (errors.auth) alert(`Authentication Error: ${errors.auth}`);
                if (errors.email) alert(`Email Error: ${errors.email}`);
                if (errors.password) alert(`Password Error: ${errors.password}`);
                if (errors.password_confirmation) alert(`Confirm Password Error: ${errors.password_confirmation}`);
            },
            onFinish: () => {
                reset('password', 'password_confirmation', 'auth_email', 'auth_password');
            },
        });        
    };
    
    const handleClose = () => {
        router.visit('/');
    };
    

    return (
        <>
            <Head title={isLogin ? 'Login - Inventory System' : 'Sign Up - Inventory System'} />

            <div className="auth-container">
            <Header />
                <div className="auth-box">
                    <X className="close-icon" onClick={handleClose} />
                    <User className="auth-icon" />
                    <h2 className="auth-title">{isLogin ? 'Inventory System Login' : 'Inventory System Sign Up'}</h2>

                    <div className="auth-toggle">
                        <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
                        <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Full Name"
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Address"
                            />
                        </div>

                        <div className="input-group">
                            <Input
                                id="password"
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                            />
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm Password"
                                />
                            </div>
                        )}

{!isLogin && (
  <>
    <div className="input-group">
        <Input
            id="auth_email"
            type="email"
            required
            value={data.auth_email}
            onChange={(e) => setData('auth_email', e.target.value)}
            placeholder="Authorized Email"
        />
    </div>
    <div className="input-group">
        <Input
            id="auth_password"
            type="password"
            required
            value={data.auth_password}
            onChange={(e) => setData('auth_password', e.target.value)}
            placeholder="Authorized Password"
        />
    </div>
  </>
)}

                        <Button type="submit" className="auth-submit" disabled={processing}>
                            {processing && <LoaderCircle className="loading-icon" />}
                            {isLogin ? 'Login' : 'Sign Up'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
