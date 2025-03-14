import React, { useState, useEffect} from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/DeviceAssignment.css";
import mmpcLogo from '@/assets/mmpc-logo1.png';
import { FaTrash, FaExchangeAlt, FaTimes, } from "react-icons/fa";
import "@/styles/userlist.css";

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    employee_number: string;
}

interface Device {
    id: number;
    classification: string;
    brand_name: string;
    model: string;
    serial_number: string;
    condition: string;
    remarks: string;
    employee_id?: number | null;
    employee_name?: string;
    employee_number?: string;
    previous_assignee?: string; // ✅ Added this property
}


const InventoryDeviceAssignment: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [assignedDevices, setAssignedDevices] = useState<Device[]>([]);
    const [classifications, setClassifications] = useState<string[]>([]);


    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [selectedClassification, setSelectedClassification] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferData, setTransferData] = useState({
    assignment_id: '',
    current_assignee: '',
    current_employee_number: '',
    new_assignee: '',
    transferred_date: '',
    return_date: '',
    classification: '',
    brand: '',
    model: '',
    serial_number: ''
});


    // Fetch employees, available devices, and assigned devices
    useEffect(() => {
        fetch("/employees")
            .then((res) => res.json())
            .then((data) => setEmployees(data));

        fetch("/assigned-devices")
            .then((res) => res.json())
            .then((data) => setAssignedDevices(data));
    }, []);

    // Fetch brands based on classification

    useEffect(() => {
        fetch("/available-devices")
            .then((res) => res.json())
            .then((data: Device[]) => {  
                console.log("Fetched Available Devices:", data); // ✅ Debug API response
                setDevices(data); 
    
                const extractedClassifications = [...new Set(data.map((device) => device.classification))];
                console.log("Extracted Classifications:", extractedClassifications); // ✅ Debug classifications
                setClassifications(extractedClassifications);
            })
            .catch((err) => console.error("Error fetching classifications:", err));
    }, []);    
    
    useEffect(() => {
        if (selectedClassification && devices.length > 0) {
            console.log("Filtering brands for classification:", selectedClassification);
            const availableBrands = devices
                .filter((device) => device.classification === selectedClassification)
                .map((device) => device.brand_name);
            
            const uniqueBrands = [...new Set(availableBrands)];
            console.log("Filtered Brands:", uniqueBrands); // ✅ Debugging
            setBrands(uniqueBrands);
            setSelectedBrand("");  // Reset brand dropdown
            setSelectedModel("");  // Reset model dropdown
        }
    }, [selectedClassification, devices]);    
    

    // Fetch models based on selected brand and classification
    useEffect(() => {
        if (selectedBrand && devices.length > 0) {
            console.log("Filtering models for brand:", selectedBrand);
            const availableModels = devices
                .filter((device) => 
                    device.classification === selectedClassification && 
                    device.brand_name === selectedBrand
                )
                .map((device) => device.model);
            
            const uniqueModels = [...new Set(availableModels)];
            console.log("Filtered Models:", uniqueModels); // ✅ Debugging
            setModels(uniqueModels);
            setSelectedModel("");  // Reset model dropdown
        }
    }, [selectedBrand, devices]);    

    const handleAssignDevice = async () => {
        if (!selectedEmployee || !selectedClassification || !selectedBrand || !selectedModel) {
            alert("Please select all fields before assigning a device.");
            return;
        }
    
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"); // ✅ Get CSRF token
    
            const response = await fetch("/assign-device", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "", // ✅ Ensure CSRF token is included
                    "X-Requested-With": "XMLHttpRequest", // ✅ Required for Laravel AJAX validation
                },
                body: JSON.stringify({
                    employee: selectedEmployee,
                    classification: selectedClassification,
                    brand: selectedBrand,
                    model: selectedModel,
                }),
                credentials: "include", // ✅ Include cookies for session authentication
            });
    
            if (!response.ok) {
                const errorData = await response.text(); // Get raw response text
                console.error("Server Response:", errorData); // ✅ Log full response
                throw new Error("Failed to assign device.");
            }
    
            const data = await response.json();
            alert(data.message);
    
            // ✅ Reload assigned devices list after successful assignment
            fetch("/assigned-devices")
                .then((res) => res.json())
                .then((updatedData) => setAssignedDevices(updatedData));
    
            // ✅ Reset form inputs
            setSelectedEmployee("");
            setSelectedClassification("");
            setSelectedBrand("");
            setSelectedModel("");
    
        } catch (err) {
            console.error("Error:", err);
            alert("Error assigning device. Please check the console for details.");
        }
    };
    
    
    const openTransferModal = (device: Device) => {
        console.log("Opening transfer modal for:", device); // Debugging log
    
        setTransferData({
            assignment_id: String(device.id), // Convert number to string
            current_assignee: device.employee_name || "", 
            current_employee_number: device.employee_number || "", 
            new_assignee: '',
            transferred_date: '',
            return_date: '',
            classification: device.classification || "", 
            brand: device.brand_name || "", 
            model: device.model || "", 
            serial_number: device.serial_number || "" 
        });
    
        setShowTransferModal(true);
    };
    
    
    
    const handleTransferDevice = async () => {
        if (!transferData.new_assignee || !transferData.transferred_date) {
            alert("Please fill in all fields.");
            return;
        }
    
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    
            const response = await fetch("/transfer-device", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "", // Include CSRF token
                },
                body: JSON.stringify(transferData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to transfer device.");
            }
    
            const data = await response.json();
            alert(data.message);
            setShowTransferModal(false);
            window.location.reload();
        } catch (err) {
            console.error("Error:", err);
            alert("Error transferring device. Please check console for details.");
        }
    };
    
    const deleteAssignment = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    
            const response = await fetch(`/delete-assignment/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "", // Ensure CSRF token is included
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete assignment.");
            }
    
            alert("Assignment deleted successfully!");
            window.location.reload(); // Refresh the page to reflect changes
        } catch (err) {
            console.error("Error:", err);
            alert("Error deleting assignment.");
        }
    };    

    const closeModal = () => {
        setShowTransferModal(false); // Hide the transfer modal
        setTransferData({
            assignment_id: '',
            current_assignee: '',
            current_employee_number: '',
            new_assignee: '',
            transferred_date: '',
            return_date: '',
            classification: '',
            brand: '',
            model: '',
            serial_number: ''
        }); // Reset the form data
    };    

    return (
        <>
            <Head title="Inventory Device Assignment" />
            <div className="dashboard-wrapper">
                <SidebarInventory />
                <div className="assign-content-container">
                    <h2 className="title">DEVICE ASSIGNMENT</h2>
                    <div className="main-container">
                        {/* Device Assignment Form */}
                        <div className="form-container">
                        <div className="form-group">
                        <label>Employee Name</label>
                            <input
                                type="text"
                                placeholder="Enter Employee Name"
                                className="input-field"
                                list="employeeList"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            />
                            <datalist id="employeeList">
                                {employees.map((emp) => (
                                    <option key={emp.id} value={`${emp.first_name} ${emp.last_name}`} />
                                ))}
                            </datalist>
                            </div>

                            <div className="form-group">
                            <label>Device Classification</label>
                            <select
                                className="dropdown"
                                    value={selectedClassification}
                                        onChange={(e) => setSelectedClassification(e.target.value || "")} // Ensuring string type
> 
                                    <option value="">Choose Device Classification</option>  
                                        {classifications.map((classType) => (
                                    <option key={classType} value={classType}>
                                        {classType}
                                    </option>
                                    ))}
                                </select>
                            </div>


                            <div className="form-group">
                            <label>Device Brand</label>
                            <select
                                className="dropdown"
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                disabled={!selectedClassification}
                            >   
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                            </div>

                            <div className="form-group">
                            <label>Device Model</label>
                            <select
                                className="dropdown"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                disabled={!selectedBrand}
                            > 
                                <option value="">Select Model</option>
                                {models.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                            </div> 

                            <button className="assign-button" onClick={handleAssignDevice}>
                                Assign Device
                            </button>
                        </div>

                       <div className="userlist-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Employee No.</th>
                                <th>Current Assigned</th>
                                <th>Previous Assignee</th>
                                <th>Classification</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Serial Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        {assignedDevices.map((device) => (
            <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.employee_number}</td>
                <td>{device.employee_name}</td>
                <td>{device.previous_assignee}</td>
                <td>{device.classification}</td>
                <td>{device.brand_name}</td>
                <td>{device.model}</td>
                <td>{device.serial_number}</td>
                <td>
                    <button className="action-btn transfer-btn" onClick={() => openTransferModal(device)}>
                        <FaExchangeAlt />
                    </button>
                    <button className="action-btn remove-btn" onClick={() => deleteAssignment(device.id)}>
                        <FaTrash />
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
                        </div>
                    </div>
                </div>

                
                {showTransferModal && (
    <div className="modal-overlay">
    <div className="modal-content">
      {/* Header */}
      <div className="modal-header">
        <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
        <h2>Transfer Device</h2>
        <FaTimes className="close-icon" onClick={closeModal} />
      </div>

                 {/* Transfer Form */}
            <div className="modal-form">
                {/* Left Column */}
                <label>Current Assignee</label>
                <label>Date Returned</label>

                <input type="text" value={transferData.current_assignee} readOnly />
                <input type="date" onChange={(e) => setTransferData({...transferData, return_date: e.target.value})} />

                <div className="transfer-wrapper">
                    <span>———</span>
                    <span>Transfer to</span>
                    <span>———</span>
                </div>

                {/* Right Column */}
                <label>New Assignee</label>
                <label>Date Transferred</label>

                <input type="text" placeholder="Enter Name" 
                    onChange={(e) => setTransferData({...transferData, new_assignee: e.target.value})} />
                <input type="date" onChange={(e) => setTransferData({...transferData, transferred_date: e.target.value})} />

                <label className="full-width">Device Information</label>

                <div className="device-info">
                    <input type="text" value={transferData.classification} readOnly />
                    <input type="text" value={transferData.brand} readOnly />
                    <input type="text" value={transferData.model} readOnly />
                    <input type="text" value={transferData.serial_number} readOnly />
                </div>
            </div>

            <button className="transfer-button" onClick={handleTransferDevice}>
                Transfer Device
            </button>
        </div>
    </div>
)}
            </div>
            
        </>
    );
};

export default InventoryDeviceAssignment;
