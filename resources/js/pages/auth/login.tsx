import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, User, X } from 'lucide-react';
import mmpcLogo from '../../assets/mmpc-logo.png'; 

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@/styles/Login.css';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [systemType, setSystemType] = useState<'inventory' | 'exitclearance'>('inventory');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isLogin 
            ? systemType === 'inventory' ? 'inventory-login' : 'exitclearance-login'
            : systemType === 'inventory' ? 'inventory-register' : 'exitclearance-register';

        post(route(routeName), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleClose = () => {
        router.visit('/'); // Redirect to Welcome.tsx
    };

    return (
        <>
            <div className="header">
                <img src={mmpcLogo} alt="Mitsubishi Logo" className="logo" />
                <span className="header-title">Mitsubishi Motors Philippines Corporation</span>
            </div>

            <Head title={isLogin ? 'Login' : 'Sign Up'} />

            <div className="auth-container">
                <div className="auth-box">
                    <X className="close-icon" onClick={handleClose} />
                    <User className="auth-icon" />
                    <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    
                    {/* System Selector */}
                    <div className="system-toggle">
                        <button 
                            className={systemType === 'inventory' ? 'active' : ''} 
                            onClick={() => setSystemType('inventory')}
                        >
                            Inventory System
                        </button>
                        <button 
                            className={systemType === 'exitclearance' ? 'active' : ''} 
                            onClick={() => setSystemType('exitclearance')}
                        >
                            Exit Clearance System
                        </button>
                    </div>

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
                                <InputError message={errors.name} />
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
                            <InputError message={errors.email} />
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
                            <InputError message={errors.password} />
                        </div>

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
