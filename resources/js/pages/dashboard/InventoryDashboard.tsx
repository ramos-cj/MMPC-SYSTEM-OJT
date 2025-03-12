import { useState } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUsers, FaLaptop, FaTabletAlt, FaPhone, FaCogs, FaFileImport, FaTools } from "react-icons/fa";
import "@/styles/inventoryDashboard.css";

export default function InventoryDashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <Head title="Inventory Dashboard" />
            <div className="dashboard-wrapper">
            <SidebarInventory /> 
                
                <div className={`dashboard-main-content ${isCollapsed ? "expanded" : ""}`}>
                    <h2>Admin Dashboard</h2>
                    <p className="last-update">Last Update (As of March 5, 2025)</p>
                    
                    <div className={`stats-container ${isCollapsed ? "expanded" : ""}`}>
                        <div className="stat-card"><FaUsers /><h3>235</h3><p>Total Employees</p></div>
                        <div className="stat-card"><FaLaptop /><h3>216</h3><p>Laptop</p></div>
                        <div className="stat-card"><FaTabletAlt /><h3>12</h3><p>Tablet</p></div>
                        <div className="stat-card"><FaPhone /><h3>5</h3><p>Phone</p></div>
                        <div className="stat-card"><FaCogs /><h3>208</h3><p>Accessories</p></div>
                        <div className="stat-card"><FaCogs /><h3>208</h3><p>Good Condition</p></div>
                        <div className="stat-card"><FaTools /><h3>8</h3><p>Repair</p></div>
                        <div className="stat-card"><FaFileImport /><h3>8</h3><p>Imported Files</p></div>
                    </div>

                    <div className={`inventory-table ${isCollapsed ? "expanded" : ""}`}>
                        <h3>Warranty and Inventory Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset Name</th>
                                    <th>Total Asset</th>
                                    <th>Warranty Expired</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Laptop</td>
                                    <td>8</td>
                                    <td>3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
