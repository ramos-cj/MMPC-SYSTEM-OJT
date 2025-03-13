import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUsers, FaLaptop, FaTabletAlt, FaPhone, FaCogs, FaFileImport, FaTools, FaArrowRight } from "react-icons/fa";
import "@/styles/inventoryDashboard.css";

const InventoryDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalLaptops: 0,
        totalTablets: 0,
        totalPhones: 0,
        totalAccessories: 0,
        totalGoodCondition: 0,
        totalBadCondition: 0,
        totalImportedFiles: 0,
        latestUpdate: "",
        assetSummary: [] as { classification: string; total: number; warrantyExpired: number }[],
    });

    useEffect(() => {
        fetch("/inventory-dashboard/stats")
            .then((response) => response.json())
            .then((data) => setStats(data))
            .catch((error) => console.error("Error fetching dashboard stats:", error));
    }, []);

    // Format Date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No recent updates";
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <>
            <Head title="Inventory Dashboard" />
            <div className="dashboard-wrapper">
                <SidebarInventory />

                <div className="dashboard-main-content">
                    <h2>Admin Dashboard</h2>
                    <p className="last-update">Last Update (As of {formatDate(stats.latestUpdate)})</p>

                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="icon"><FaUsers /></div>
                            <h3>{stats.totalEmployees}</h3>
                            <p>Total Employees</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><FaLaptop /></div>
                            <h3>{stats.totalLaptops}</h3>
                            <p>Laptops</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"><FaTabletAlt /></div>
                            <h3>{stats.totalTablets}</h3>
                            <p>Tablets</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"> <FaPhone /> </div>
                            <h3>{stats.totalPhones}</h3>
                            <p>Phones</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"> <FaCogs /> </div>
                            <h3>{stats.totalAccessories}</h3>
                            <p>Accessories</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"> <FaCogs /> </div>
                            <h3>{stats.totalGoodCondition}</h3>
                            <p>Good Condition</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"> <FaTools /> </div>
                            <h3>{stats.totalBadCondition}</h3>
                            <p>Needs Repair</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon"> <FaFileImport /> </div>
                            <h3>{stats.totalImportedFiles}</h3>
                            <p>Imported Files</p>
                            <div className="more-info">More Info <FaArrowRight /></div>
                        </div>
                    </div>

                    {/* Warranty and Inventory Summary Table */}
                    <div className="inventory-table">
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
                                {stats.assetSummary.map((asset, index) => (
                                    <tr key={index}>
                                        <td>{asset.classification}</td>
                                        <td>{asset.total}</td>
                                        <td>{asset.warrantyExpired}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryDashboard;
