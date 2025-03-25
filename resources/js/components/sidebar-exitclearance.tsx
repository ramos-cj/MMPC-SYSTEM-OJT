import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { FaBars, FaUsers, FaClipboardList, FaSignOutAlt, FaTools, FaFileImport, FaPowerOff, FaTimes, FaIcons, FaListAlt, FaResolving} from "react-icons/fa";
import { MdAssignment, MdManageAccounts, MdDevices, MdList } from "react-icons/md";
import "../styles/sidebar.css";
import logo from "../assets/mmpc-logo.png";

const SidebarInventory: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        return localStorage.getItem("sidebarCollapsed") === "true"; // Retrieve sidebar state
    });
    
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", String(isCollapsed)); // Save sidebar state
    }, [isCollapsed]);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    const handleNavigation = (path: string) => {
        router.visit(path);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
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
                        <li className={url === "/exit-dashboard" ? "active" : ""} onClick={() => handleNavigation("/exit-dashboard")}>
                            <FaClipboardList />
                            <span className={isCollapsed ? "hidden" : ""}>Dashboard</span>
                        </li>
                        <li className={url === "/exit-userlist" ? "active" : ""} onClick={() => handleNavigation("/exit-userlist")}>
                            <FaUsers />
                            <span className={isCollapsed ? "hidden" : ""}>User List</span>
                        </li>
                        <li className={url === "/exit-exitclearance" ? "active" : ""} onClick={() => handleNavigation("/exit-exitclearance")}>
                            <FaResolving />
                            <span className={isCollapsed ? "hidden" : ""}>Exit Clearance</span>
                        </li>
                        <li className={url === "/exit-clearancestatus" ? "active" : ""} onClick={() => handleNavigation("/exit-clearancestatus")}>
                            <MdList />
                            <span className={isCollapsed ? "hidden" : ""}>Clearance Status</span>
                        </li>
                        <li className={url === "/exit-usermanagement" ? "active" : ""} onClick={() => handleNavigation("/exit-usermanagement")}>
                            <MdManageAccounts />
                            <span className={isCollapsed ? "hidden" : ""}>User Management</span>
                        </li>
                        <li className={url === "/exit-importfiles" ? "active" : ""} onClick={() => handleNavigation("/exit-importfiles")}>
                            <FaFileImport />
                            <span className={isCollapsed ? "hidden" : ""}>File Management</span>
                        </li>
                        <li className="logout" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span className={isCollapsed ? "hidden" : ""}>Logout</span>
                        </li>
                    </ul>
                </div>

                {/* Header */}
                <div className="header1">
                    <button className="menu-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <span className="header1-title">Mitsubishi Motors Philippines Corporation</span>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <div className="logout-header">
                            <img src={logo} alt="Mitsubishi Logo" className="modal-logo" />
                            <label>Logout</label>
                            <FaTimes className="close-icon" onClick={cancelLogout}/>
                        </div>
                        <p className="logout-message">Are you sure you want to logout?</p>
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