import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaUsers, FaClipboardList, FaSignOutAlt, FaTools, FaFileImport } from "react-icons/fa";
import { MdAssignment, MdManageAccounts, MdDevices, MdList } from "react-icons/md";
import "../styles/sidebar.css";
import logo from "../assets/mmpc-logo.png";

const SidebarInventory: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { url } = usePage();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className={`layout-container ${isCollapsed ? "collapsed" : ""}`}>
            {/* Sidebar */}
            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <img src={logo} alt="Mitsubishi Logo" className="sidebar-logo" />
                <ul>
                    <li className={url === "/inventory-dashboard" ? "active" : ""} onClick={() => handleNavigation("/inventory-dashboard")}>
                        <FaClipboardList />
                        <span className={isCollapsed ? "hidden" : ""}>Dashboard</span>
                    </li>
                    <li className={url === "/inventory-userlist" ? "active" : ""} onClick={() => handleNavigation("/inventory-userlist")}>
                        <FaUsers />
                        <span className={isCollapsed ? "hidden" : ""}>User List</span>
                    </li>
                    <li className={url === "/device-list" ? "active" : ""} onClick={() => handleNavigation("/device-list")}>
                        <MdList />
                        <span className={isCollapsed ? "hidden" : ""}>Device List</span>
                    </li>
                    <li className={url === "/user-management" ? "active" : ""} onClick={() => handleNavigation("/user-management")}>
                        <MdManageAccounts />
                        <span className={isCollapsed ? "hidden" : ""}>User Management</span>
                    </li>
                    <li className={url === "/device-management" ? "active" : ""} onClick={() => handleNavigation("/device-management")}>
                        <MdDevices />
                        <span className={isCollapsed ? "hidden" : ""}>Device Management</span>
                    </li>
                    <li className={url === "/device-assignment" ? "active" : ""} onClick={() => handleNavigation("/device-assignment")}>
                        <MdAssignment />
                        <span className={isCollapsed ? "hidden" : ""}>Device Assignment</span>
                    </li>
                    <li className={url === "/repair-management" ? "active" : ""} onClick={() => handleNavigation("/repair-management")}>
                        <FaTools />
                        <span className={isCollapsed ? "hidden" : ""}>Repair Management</span>
                    </li>
                    <li className={url === "/import-files" ? "active" : ""} onClick={() => handleNavigation("/import-files")}>
                        <FaFileImport />
                        <span className={isCollapsed ? "hidden" : ""}>Import Files</span>
                    </li>
                    <li className="logout" onClick={() => handleNavigation("/")}>
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
    );
};

export default SidebarInventory;
