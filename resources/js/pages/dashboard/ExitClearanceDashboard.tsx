import { Head } from '@inertiajs/react';
import Sidebar from '@/components/header'; // Ensure you have a Sidebar component
import '@/styles/Dashboard.css';

export default function ExitClearanceDashboard() {
    return (
        <>
            <Head title="Exit Clearance Dashboard" />
            <div className="dashboard-container">
                <Sidebar /> {/* Sidebar for navigation */}
                <div className="dashboard-content">
                    <h1>Exit Clearance Dashboard</h1>
                    <p>Welcome to the Exit Clearance Management System.</p>
                </div>
            </div>
        </>
    );
}
