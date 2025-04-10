import { Head } from '@inertiajs/react';
import Sidebar from '@/components/header'; // Ensure you have a Sidebar component
import SidebarExitClearance from '@/components/sidebar-exitclearance';
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUsers, FaFileImport,FaArrowRight,FaCheckCircle,FaListAlt } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "@/styles/ExitDashboard.css";
import "@/styles/inventoryDashboard.css";

const ExitDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        issuedClearances: 0,
        completedClearances: 0,
        totalImportedFiles: 0,
        latestUpdate: "",
        clearanceData: [] as { month: string; pending: number; completed: number }[],
        departmentData: [] as { department: string; count: number }[],
    });

    useEffect(() => {
        fetch("/exit-dashboard/stats")
            .then((response) => response.json())
            .then((data) => setStats(data))
            .catch((error) => console.error("Error fetching dashboard stats:", error));
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No recent updates";
        return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    return (
        <>
            <Head title="Exit Clearance Dashboard" />
            <div className="dashboard-wrapper">
                <SidebarExitClearance/>
                <div className="dashboard-main-content">
                    <h2>Admin Dashboard</h2>
                    <p className="last-update">Last Update (As of {formatDate(stats.latestUpdate)})</p>
                    
                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="icon"><FaUsers /></div>
                            <h3>{stats.totalEmployees}</h3>
                            <p>Total Employees</p>
                            <div className="more-info" onClick={() => Inertia.visit('/exit-userlist')}>More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><FaListAlt /></div>
                            <h3>{stats.issuedClearances}</h3>
                            <p>Issued Exit Clearances</p>
                            <div className="more-info" onClick={() => Inertia.visit('/exit-exitclearance')}>More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><FaCheckCircle /></div>
                            <h3>{stats.completedClearances}</h3>
                            <p>Completed Clearances</p>
                            <div className="more-info" onClick={() => Inertia.visit('/exit-clearancestatus')}>More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><FaFileImport /></div>
                            <h3>{stats.totalImportedFiles}</h3>
                            <p>Imported Files</p>
                            <div className="more-info" onClick={() => Inertia.visit('/exit-importfiles')}>More Info <FaArrowRight /></div>
                        </div>
                    </div>
                    
                    <div className="charts-container">
                        {/* Monthly Clearance Bar Chart */}
                        <div className="chart-box1">
                            <h3>Monthly Clearance</h3>
                            <Bar
  data={{
    labels: stats.clearanceData?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Pending",
        backgroundColor: "#007bff",
        data: stats.clearanceData?.map((item) => item.pending) || [],
      },
      {
        label: "Completed",
        backgroundColor: "#28a745",
        data: stats.clearanceData?.map((item) => item.completed) || [],
      },
    ],
  }}
  options={{
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }}
/>

                        </div>

                        
                        {/* Departmental Employees Pie Chart */}
                        <div className="chart-box2">
                            <h3>Departmental Employees</h3>
                            <Pie
  data={{
    labels: stats.departmentData?.map((item) => item.department) || [],
    datasets: [
      {
        data: stats.departmentData?.map((item) => item.count) || [],
        backgroundColor: ["#f39c12", "#e74c3c", "#3498db", "#2ecc71"],
      },
    ],
  }}
  options={{
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  }}
/>

                        </div>
                    </div>
                </div>
                </div>
        </>
    );
};

export default ExitDashboard;