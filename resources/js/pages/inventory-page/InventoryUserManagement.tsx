import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import axios from "axios";
import "@/styles/UserManagement.css";
import "@/styles/UserList.css"

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
        employee_type: "",
    });

    const [divisions, setDivisions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isAddingNewDivision, setIsAddingNewDivision] = useState(false);
    const [newDivision, setNewDivision] = useState<string>("");

    useEffect(() => {
        fetchDivisions();
    }, []);

    const fetchDivisions = async () => {
        try {
            const response = await axios.get('/inventory-user-management/divisions');
            setDivisions(response.data);
        } catch (error) {
            console.error("Error fetching divisions:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "division_department" && value === "new-division") {
            setIsAddingNewDivision(true);
            setFormData((prev) => ({
                ...prev,
                division_department: "",
            }));
        } else {
            setIsAddingNewDivision(false);
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleNewDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewDivision(value);
        setFormData((prev) => ({
            ...prev,
            division_department: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        router.post("/inventory-user-management/save", formData, {
            onSuccess: () => {
                alert("User saved successfully!");
                fetchDivisions(); // Refresh divisions list
                setNewDivision("");
            },
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
                                    <label>Department:</label>
                                    <input type="text" name="position" placeholder="Enter Employee's Department" value={formData.position} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input type="text" name="first_name" placeholder="Enter Employee's First Name" value={formData.first_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Middle Initial:</label>
                                    <input type="text" name="middle_initial" placeholder="Enter Employee's Middle Initial" value={formData.middle_initial} onChange={handleChange} maxLength={1} />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input type="text" name="last_name" placeholder="Enter Employee's Last Name" value={formData.last_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Division Code:</label>
                                    <input type="text" name="division_code" placeholder="Enter Employee's Division Code"value={formData.division_code} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Department Code:</label>
                                    <input type="text" name="department_code" placeholder="Enter Employee's Department Code"value={formData.department_code} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Section Code:</label>
                                    <input type="text" name="section_code" placeholder="Enter Employee's Section Code" value={formData.section_code} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                            <div className="form-group">
                                    <label>Employee Type:</label> 
                                    <select name="employee_type" value={formData.employee_type} onChange={handleChange} required>
                                        <option value="">Select Employee Type</option>
                                        <option value="Regular Employee">Regular Employee</option>
                                        <option value="Third-Party">Third-Party</option>
                                        <option value="Hourly Personnel">Hourly Personnel</option>
                                        <option value="Japanese Executives">Japanese Executives</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Choose Division:</label>
                                    <select name="division_department" value={formData.division_department} onChange={handleChange} required>
                                        <option value="">Select Division</option>
                                        {divisions.map((division) => (
                                            <option key={division} value={division}>{division}</option>
                                        ))}
                                        <option value="new-division">* Add New Division *</option>
                                    </select>

                                    {isAddingNewDivision && (
                                        <div>
                                            <label>New Division:</label>
                                            <input 
                                                type="text" 
                                                value={newDivision}
                                                onChange={handleNewDivisionChange}
                                                placeholder="Enter New Division"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="save-btn">Save Device</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
