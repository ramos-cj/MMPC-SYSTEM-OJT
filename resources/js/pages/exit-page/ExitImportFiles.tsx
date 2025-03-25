import { Head } from '@inertiajs/react';
import Sidebar from '@/components/header'; // Ensure you have a Sidebar component
import '@/styles/inventoryDashboard.css';
import SidebarExitClearance from '@/components/sidebar-exitclearance';

export default function ExitClearanceDashboard() {
    return (
        <>
            <Head title="Inventory Dashboard" />
            <div className="dashboard-wrapper">
                <SidebarExitClearance />
                <Sidebar /> {/* Sidebar for navigati on */}
                <div className="dashboard-content">
                    <h1>Exit Clearance Dashboard</h1>
                    <p>Welcome to the Exit Clearance Management System.</p>
                </div>
            </div>
        </>
    );
}
