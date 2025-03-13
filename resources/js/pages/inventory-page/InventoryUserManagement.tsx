import { useState } from "react";
import { router } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/UserManagement.css";

export default function InventoryUserManagement() {
    const [formData, setFormData] = useState({
        employee_number: "",
        first_name: "",
        middle_initial: "",
        last_name: "",
        division_department: "",
        position: "",
        section_code: "",
        division_code: "",
        department_code: "",
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error modal state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        router.post("/inventory-user-management/save", formData, {
            onSuccess: () => alert("User saved successfully!"),
            onError: (errors) => {
                const errorMsg = Object.values(errors).join("\n");
                setErrorMessage(errorMsg);
            },
        });
    };

    return (
        <>
            <div className="dashboard-wrapper">
                <SidebarInventory />
                <div className="content-container">
                    <div className="user-management-container">
                        <h2 className="page-title">User Management</h2>
                        <form className="user-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Employee Number:</label>
                                    <input type="text" name="employee_number" placeholder="Enter Employee Number" value={formData.employee_number} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Position:</label>
                                    <input type="text" name="position" placeholder="Enter Employee's Position" value={formData.position} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input type="text" name="first_name" placeholder="Enter First Name" value={formData.first_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Middle Initial:</label>
                                    <input type="text" name="middle_initial" placeholder="Enter Middle Initial" value={formData.middle_initial} onChange={handleChange} maxLength={1} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input type="text" name="last_name" placeholder="Enter Last Name" value={formData.last_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                            <div className="form-group">
                                    <label>Department Code:</label>
                                    <input type="text" name="department_code" placeholder="Enter Department Code" value={formData.department_code} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Section Code:</label>
                                    <input type="text" name="section_code" placeholder="Enter Section Code" value={formData.section_code} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Division Code:</label>
                                    <input type="text" name="division_code" placeholder="Enter Division Code" value={formData.division_code} onChange={handleChange} required />
                                    
                                </div>
                                <div className="form-group">
                                    <label>Division / Department:</label>
                                    <select name="division_department" value={formData.division_department} onChange={handleChange} required>
                                        <option value="">Choose Division / Department</option>
                                        <option value="HR">HR</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-submit">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {errorMessage && (
                <div className="error-modal-overlay">
                    <div className="error-modal">
                        <h3>Error</h3>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}
