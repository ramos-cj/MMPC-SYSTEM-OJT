import { useState } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/UserManagement.css";

export default function InventoryUserManagement() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    return (
        <>
            <Head title="Inventory User Management" />
            <div className="dashboard-wrapper">
                <SidebarInventory />
                <div className="content-container">
                    <div className="user-management-container">
                        <h2 className="page-title">User Management</h2>
                        <form className="user-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name:</label>
                                    <input type="text" id="first_name" name="first_name" placeholder="Enter First Name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="division_department">Division / Department:</label>
                                    <select id="division_department" name="division_department" required>
                                        <option value="">Choose Division / Department</option>
                                        <option value="hr">HR</option>
                                        <option value="it">IT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="middle_initial">Middle Initial:</label>
                                    <input type="text" id="middle_initial" name="middle_initial" placeholder="Enter Middle Initial" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="position">Position:</label>
                                    <input type="text" id="position" name="position" placeholder="Enter Position" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name:</label>
                                    <input type="text" id="last_name" name="last_name" placeholder="Enter Last Name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="section_code">Section Code:</label>
                                    <input type="text" id="section_code" name="section_code" placeholder="Enter Section Code" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="division_code">Division Code:</label>
                                    <input type="text" id="division_code" name="division_code" placeholder="Enter Division Code" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department_code">Department Code:</label>
                                    <input type="text" id="department_code" name="department_code" placeholder="Enter Department Code" required />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}