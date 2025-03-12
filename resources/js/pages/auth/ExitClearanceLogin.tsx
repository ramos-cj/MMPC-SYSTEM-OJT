import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, User, X } from 'lucide-react';
import mmpcLogo from '../../assets/mmpc-logo.png';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/header'; // Import Header component
import '@/styles/Login.css';

export default function ExitClearanceLogin() {
    const [isLogin, setIsLogin] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        system_type: 'exitclearance', // Save system type for exit clearance
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isLogin ? 'exitclearance-login' : 'exitclearance-register';
    
        post(route(routeName), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };
    

    const handleClose = () => {
        router.visit('/');
    };

    return (
        <>
            <Head title={isLogin ? 'Login - Exit Clearance System' : 'Sign Up - Exit Clearance System'} />

            <div className="auth-container">
            <Header />
                <div className="auth-box">
                    <X className="close-icon" onClick={handleClose} />
                    <User className="auth-icon" />
                    <h2 className="auth-title">{isLogin ? 'Exit Clearance System Login' : 'Exit Clearance System Sign Up'}</h2>

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
                                <InputError message={errors.password_confirmation} />
                            </div>
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
