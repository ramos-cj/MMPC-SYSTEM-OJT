import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FaBars, FaUsers, FaClipboardList, FaSignOutAlt, FaTools, FaFileImport, FaPowerOff } from "react-icons/fa";
import { MdAssignment, MdManageAccounts, MdDevices, MdList } from "react-icons/md";
import "../styles/sidebar.css";
import logo from "../assets/mmpc-logo.png";

const SidebarInventory: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { url } = usePage();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleNavigation = (path: string) => {
        router.visit(path);
    };

    const handleLogout = () => {
        setShowLogoutModal(true); // Show logout modal
    };

    const confirmLogout = () => {
        router.post('/logout', {}, {
            onFinish: () => router.visit('/'),
        });
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };
    return (
        <>
            <div className={`layout-container ${isCollapsed ? "collapsed" : ""} ${showLogoutModal ? "blurred" : ""}`}>
                <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                    <img src={logo} alt="Mitsubishi Logo" className="sidebar-logo" />
                    <ul>
                        <li className={window.location.pathname === "/inventory-dashboard" ? "active" : ""} onClick={() => handleNavigation("/inventory-dashboard")}>
                            <FaClipboardList />
                            <span className={isCollapsed ? "hidden" : ""}>Dashboard</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-userlist" ? "active" : ""} onClick={() => handleNavigation("/inventory-userlist")}>
                            <FaUsers />
                            <span className={isCollapsed ? "hidden" : ""}>User List</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-devicelist" ? "active" : ""} onClick={() => handleNavigation("/inventory-devicelist")}>
                            <MdList />
                            <span className={isCollapsed ? "hidden" : ""}>Device List</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-usermanagement" ? "active" : ""} onClick={() => handleNavigation("/inventory-usermanagement")}>
                            <MdManageAccounts />
                            <span className={isCollapsed ? "hidden" : ""}>User Management</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-devicemanagement" ? "active" : ""} onClick={() => handleNavigation("/inventory-devicemanagement")}>
                            <MdDevices />
                            <span className={isCollapsed ? "hidden" : ""}>Device Management</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-deviceassignment" ? "active" : ""} onClick={() => handleNavigation("/inventory-deviceassignment")}>
                            <MdAssignment />
                            <span className={isCollapsed ? "hidden" : ""}>Device Assignment</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-repairmanagement" ? "active" : ""} onClick={() => handleNavigation("/inventory-repairmanagement")}>
                            <FaTools />
                            <span className={isCollapsed ? "hidden" : ""}>Repair Management</span>
                        </li>
                        <li className={window.location.pathname === "/inventory-importfiles" ? "active" : ""} onClick={() => handleNavigation("/inventory-importfiles")}>
                            <FaFileImport />
                            <span className={isCollapsed ? "hidden" : ""}>Import Files</span>
                        </li>
                        <li className="logout" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span className={isCollapsed ? "hidden" : ""}>Logout</span>
                        </li>
                    </ul>
                </div>

                {/* Header */}
                <div className="header">
                    <button className="menu-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <span className="header-title">Mitsubishi Motors Philippines Corporation</span>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <div className="logout-header">
                            <img src={logo} alt="Mitsubishi Logo" className="modal-logo" />
                            <FaPowerOff className="logout-icon" />
                            <button className="close-btn" onClick={cancelLogout}>✖</button>
                        </div>
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-buttons">
                            <button className="yes-btn" onClick={confirmLogout}>Yes</button>
                            <button className="no-btn" onClick={cancelLogout}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SidebarInventory;