import { Head, Link } from '@inertiajs/react';  
import '../styles/Home.css';
import Header from '@/components/header'; // Import Header component

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="home-container">
                <Header /> {/* Use the common header */}
                <div className="content">
                    <h1 className="welcome-text">Hello, User!</h1>
                    <p className="choose-text">Choose your System</p>
                    <div className="button-container">
                        <Link href={route('inventory-login')} className="system-button">
                            Inventory System
                        </Link>
                        <div className="or-container">
                            <span className="or-text">or</span>
                        </div>
                        <Link href={route('exitclearance-login')} className="system-button">
                            Exit Clearance System
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
