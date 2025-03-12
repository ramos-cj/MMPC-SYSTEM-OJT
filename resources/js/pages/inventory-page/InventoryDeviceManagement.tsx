import { useState } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUsers, FaLaptop, FaTabletAlt, FaPhone, FaCogs, FaFileImport, FaTools, FaArrowRight } from "react-icons/fa";
import "@/styles/inventoryDashboard.css";

export default function InventoryDashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <Head title="Inventory Dashboard" />
            <div className="dashboard-wrapper">
                <SidebarInventory />
                
                
            </div>
        </>
    );
}
