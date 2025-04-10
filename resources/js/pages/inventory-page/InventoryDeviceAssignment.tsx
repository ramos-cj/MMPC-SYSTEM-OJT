import React, { useState, useEffect} from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/DeviceAssignment.css";
import mmpcLogo from '@/assets/mmpc-logo1.png';
import { FaTrash, FaExchangeAlt, FaTimes, FaSearch, } from "react-icons/fa";


interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    employee_number: string;
}

interface Device {
    id: number;
    classification: string;
    brand_model: string;
    serial_number: string;
    condition: string;
    remarks?: string;
    accessories?: string; 
    employee_id?: number | null;
    employee_name?: string;
    employee_number?: string;
    previous_assignee?: string;
    computer_name?: string;
}



const InventoryDeviceAssignment: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [assignedDevices, setAssignedDevices] = useState<Device[]>([]);
    const [classifications, setClassifications] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [computers, setComputers] = useState<Device[]>([]);
    const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [selectedClassification, setSelectedClassification] = useState<string>("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedComputer, setSelectedComputer] = useState<string>("");
    const [selectedAccessories, setSelectedAccessories] = useState<string>("");  // ✅ Add this
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferData, setTransferData] = useState({
    assignment_id: '',
    current_assignee: '',
    current_employee_number: '',
    new_assignee: '',
    transferred_date: '',
    return_date: '',
    classification: '',
    brand_model: '',
    serial_number: '',
    accessories: '',
    computer_name: '',
});

    const handleRemarksChange = (remark: string) => {
        setSelectedRemarks((prev) =>
            prev.includes(remark)
            ? prev.filter((r) => r !== remark)
            : [...prev, remark]
        );
    };

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
                .map((device) => device.brand_model);
            
            const uniqueBrands = [...new Set(availableBrands)];
            console.log("Filtered Brands:", uniqueBrands); // ✅ Debugging
            setBrands(uniqueBrands);
            setSelectedBrand("");  // Reset brand dropdown
        }
    }, [selectedClassification, devices]);    
    

    // Fetch models based on selected brand and classification
    useEffect(() => {
        if (selectedClassification && selectedBrand) {
            const availableComputers = devices
                .filter(device =>
                    device.classification === selectedClassification &&
                    device.brand_model === selectedBrand &&
                    device.remarks === 'Free'
                );
    
            setComputers(availableComputers);
            setSelectedComputer("");
        }
    }, [selectedClassification, selectedBrand, devices]);
    
    
    const filteredDevices = assignedDevices.filter(device => {
        const searchText = searchTerm.toLowerCase();

        return (
            device.employee_name?.toLowerCase().includes(searchText) ||
            device.computer_name?.toLowerCase().includes(searchText) ||
            device.employee_number?.includes(searchTerm)
        );
    });

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredDevices.length / entriesPerPage);

    const handleAssignDevice = async () => {
        if (!selectedEmployee || !selectedClassification || !selectedBrand || !selectedComputer) {
            alert("Please select all fields before assigning a device.");
            return;
        }
    
        const employeeId = employees.find(
            (emp) => `${emp.first_name} ${emp.last_name} (${emp.employee_number})` === selectedEmployee
        )?.id;
    
        if (!employeeId) {
            alert("Selected employee not found. Please try again.");
            return;
        }
    
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    
            const response = await fetch("/assign-device", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    employee_id: employeeId,
                    classification: selectedClassification,
                    brand_model: selectedBrand,
                    accessories: selectedAccessories,
                    computer_name: selectedComputer,
                    remarks: selectedRemarks, 
                  }),
                credentials: "include",
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Response:", errorData);
                throw new Error("Failed to assign device.");
            }
    
            const data = await response.json();
            alert(data.message);
    
            fetch("/assigned-devices")
                .then((res) => res.json())
                .then((updatedData) => setAssignedDevices(updatedData));
    
            setSelectedEmployee("");
            setSelectedClassification("");
            setSelectedBrand("");
            setSelectedComputer("");
            setSelectedAccessories(""); 
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
            brand_model: device.brand_model || "", 
            serial_number: device.serial_number || "", 
            accessories: device.accessories || "", 
            computer_name: device.computer_name || ""
        });
    
        setShowTransferModal(true);
    };
    
    const handleTransferDevice = async () => {
        if (!transferData.new_assignee || !transferData.transferred_date) {
            alert("Please fill in all fields.");
            return;
        }
    
        const employee = employees.find(emp => 
            `${emp.first_name} ${emp.last_name} (${emp.employee_number})` === transferData.new_assignee
        );
    
        if (!employee) {
            alert("New assignee not found. Please select a valid employee.");
            return;
        }
    
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    
            const response = await fetch("/transfer-device", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "", 
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({
                    assignment_id: transferData.assignment_id,
                    new_assignee_id: employee.id, // Send employee_id instead of name
                    transferred_date: transferData.transferred_date,
                    return_date: transferData.return_date,
                    classification: transferData.classification,
                    brand_model: transferData.brand_model,
                    serial_number: transferData.serial_number,
                    accessories: transferData.accessories,
                }),
                credentials: "include",
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
            brand_model: '',
            serial_number: '',
            accessories: '',
            computer_name: '',
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
    {/* Employee Name */}
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
                <option key={emp.id} value={`${emp.first_name} ${emp.last_name} (${emp.employee_number})`} />
            ))}
        </datalist>
    </div>

    {/* Device Classification */}
    <div className="form-group">
        <label>Device Classification</label>
        <select
            className="dropdown"
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value || "")}
        > 
            <option value="">Choose Device Classification</option>  
            {classifications.map((classType) => (
                <option key={classType} value={classType}>{classType}</option>
            ))}
        </select>
    </div>

    {/* Device Brand */}
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
                <option key={brand} value={brand}>{brand}</option>
            ))}
        </select>
    </div>

    <div className="form-group">
                        <label>Host Name</label>
                        <select className="dropdown" value={selectedComputer} onChange={(e) => setSelectedComputer(e.target.value)}>
                            <option value="">Select Host</option>
                            {computers.map((device) => (
                                <option key={device.id} value={device.computer_name}>
                                    {device.computer_name}
                                </option>
                            ))}
                        </select>
                    </div>

    {/* Accessories Input Centered */}
    <div className="form-group">
        <label>Accessories</label>
        <input
            type="text"
            placeholder="Enter Accessories"
            className="accessories-input"
            value={selectedAccessories}
            onChange={(e) => setSelectedAccessories(e.target.value)}
        />
    </div>

    <div className="form-group">
  <label>Remarks</label>
  
  <div className="check-box">
    {["Installed IP-Guard", "Installed Canon Printer", "Installed Trend Micro"].map((option) => (
      <label key={option}>
        <input
          type="checkbox"
          value={option}
          checked={selectedRemarks.includes(option)}
          onChange={() => handleRemarksChange(option)}
        />
        {option}
      </label>
    ))}
  </div>
</div>


    {/* Assign Device Button Below */}
    <button className="assign-button" onClick={handleAssignDevice}>
        Assign Device
    </button>
</div>

<div className="assign-table-container">
                         {/* Search and Entries Filter */}
                <div className="filter-container">
                    <label>
                        Show
                        <select
                            value={entriesPerPage}
                            onChange={(e) => {
                                setEntriesPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {[15, 30, 45, 60, 75, 100].map(number => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                        entries
                    </label>
                    
                    <div className="search-container">
                        <FaSearch className="search-icon"/>
                        <input 
                            type="text" 
                            placeholder="Search by Employee Name, Host Name, or Employee Number..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                    {/* Table */}
                <table>
                    <thead>
                        <tr>
                            <th>Employee No.</th>
                            <th>Assigned Employee</th>
                            <th>Previous Assignee</th>
                            <th>Computer Name</th>
                            <th>Accessories</th>
                            <th>Classification</th>
                            <th>Brand / Model</th>
                            <th>Serial Number</th>
                            <th>Assigned Device Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDevices.map(device => (
                            <tr key={device.id}>
                                <td>{device.employee_number}</td>
                                <td>{device.employee_name}</td>
                                <td>{device.previous_assignee}</td>
                                <td>{device.computer_name || "N/A"}</td>
                                <td>{device.accessories || "N/A"}</td>
                                <td>{device.classification}</td>
                                <td>{device.brand_model}</td>
                                <td>{device.serial_number}</td>
                                <td>
  {device.remarks
    ? device.remarks.split(',').map((r, i) => <div key={i}>{r.trim()}</div>)
    : 'None'}
</td>

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

 {/* Pagination */}
 <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
            </div>
        </div>


                
                {showTransferModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            {/* Header */}
            <div className="modal-header1">
                <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
                <h2>Transfer Device</h2>
                <FaTimes className="close-icon" onClick={closeModal} />
            </div>

            {/* Transfer Form */}
            <div className="modal-form">
                {/* Current Assignee and Date Returned */}
                <div className="assignee-container">
    <div className="assignee-row">
        <div className="assignee-field">
            <label>Current Assignee</label>
            <input type="text" value={transferData.current_assignee} readOnly />
        </div>
        <div className="assignee-field">
            <label>Date Returned</label>
            <input type="date" onChange={(e) => setTransferData({ ...transferData, return_date: e.target.value })} />
        </div>
    </div>
</div>

<div className="transfer-container">
    <span className="transfer-text">transfer to</span>
</div>


{/* New Assignee and Date Transferred */}
<div className="assignee-container">
    <div className="assignee-row">
        <div className="assignee-field">
            <label>New Assignee</label>
            <input 
                type="text" 
                placeholder="Enter Name" 
                value={transferData.new_assignee}
                onChange={(e) => setTransferData({ ...transferData, new_assignee: e.target.value })}
                list="employeeListTransfer"
            />
            <datalist id="employeeListTransfer">
                {employees.map((emp) => (
                    <option key={emp.id} value={`${emp.first_name} ${emp.last_name} (${emp.employee_number})`} />
                ))}
            </datalist>
        </div>
        <div className="assignee-field">
            <label>Date Transferred</label>
            <input 
                type="date" 
                onChange={(e) => setTransferData({ ...transferData, transferred_date: e.target.value })} 
            />
        </div>
    </div>
</div>

                {/* Editable Accessories Field */}

                <label className="full-width">Device Information</label>

                <div className="device-info">
    <div>
        <label>Classification</label>
        <input type="text" value={transferData.classification} readOnly />
    </div>

    <div>
        <label>Brand / Model</label>
        <input type="text" value={transferData.brand_model} readOnly />
    </div>

    <div>
        <label> Computer Name</label>
        <input type="text" value={transferData.computer_name} readOnly/>
    </div>

    <div>
        <label>Serial Number</label>
        <input type="text" value={transferData.serial_number} readOnly />
    </div>
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