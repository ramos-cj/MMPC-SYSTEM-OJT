import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import mmpcLogo from '@/assets/mmpc-logo1.png'; // Ensure the path is correct
import SidebarInventory from "@/components/sidebar-inventory";
import { FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "@/styles/DeviceList.css";
import "@/styles/userlist.css";

// Define the Device structure
interface Device {
    id: number;
    tag_no: string;
    classification: string;
    brand_model: string;
    condition: string;
    remarks: string;
    location: string;
    serial_number: string;
    estimated_acquisition_year: string;
    with_warranty: string;
    computer_name?: string;
    qr_code: string;
    need_to_be_repair: string;
    activation_updates: string;
    image_file?: string;
    employee_name?: string;
}

export default function InventoryDeviceList() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [editDevice, setEditDevice] = useState<Device | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Dynamic Filter Options
    const [classifications, setClassifications] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    

    // Fetch devices from API
    useEffect(() => {
        fetch("/devices")
            .then((res) => res.json())
            .then((data: Device[]) => {
                setDevices(data);

                // Extract unique classifications and brands for filters
                const uniqueClassifications = [...new Set(data.map(device => device.classification))];
                const uniqueBrands = [...new Set(data.map(device => device.brand_model))];

                setClassifications(uniqueClassifications);
                setBrands(uniqueBrands);
            })
            .catch(err => console.error("Error fetching devices:", err));
    }, []);

    // Filtering logic
    const filteredDevices = devices.filter(device =>
        (device.brand_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.computer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.tag_no.includes(searchTerm)) &&
        (selectedClassification === "" || device.classification === selectedClassification) &&
        (selectedBrand === "" || device.brand_model === selectedBrand)
    );

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredDevices.length / entriesPerPage);

    // Open modal with selected device details
    const handleDeviceClick = (device: Device) => {
        setSelectedDevice(device);
    };

    // Close modal
    const closeModal = () => {
        setSelectedDevice(null);
    };

    // Open edit modal
    const handleEditClick = async (device: Device) => {
        setEditDevice(device);
        setImagePreview(device.image_file ? `/device-image/${device.image_file}` : null);
        setSelectedFile(null);
    };

     // Close edit modal
     const closeEditModal = () => {
        setEditDevice(null);
        setImagePreview(null);
        setSelectedFile(null);
    };

    // Handle form change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editDevice) return;
        const { name, value } = e.target;
        setEditDevice(prev => prev ? { ...prev, [name]: value } : null);
    };

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editDevice || !e.target.files) return;
        const file = e.target.files[0];
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Submit updated device
    const handleSaveChanges = async () => {
        if (!editDevice) return;
    
        const formData = new FormData();
        Object.entries(editDevice).forEach(([key, value]) => {
            if (value !== null && key !== "image_file") { // ✅ Exclude image file unless changed
                formData.append(key, value.toString());
            }
        });
    
        if (selectedFile) {
            formData.append("image_file", selectedFile); // ✅ Send new image only if selected
        }
    
        formData.append("_method", "PUT"); // ✅ Laravel expects PUT request, but FormData requires POST
    
        try {
            const response = await fetch(`/inventory-devicemanagement/update/${editDevice.id}`, {
                method: "POST", // ✅ Must be POST due to FormData
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest", // ✅ Laravel expects AJAX
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // ✅ Capture error details
                throw new Error(errorText);
            }
    
            const updatedDevice = await response.json();
            alert("Device details updated successfully!");
    
            // ✅ Update the state with the new device details
            setDevices((prevDevices) =>
                prevDevices.map((device) =>
                  device.id === updatedDevice.device.id
                    ? { ...device, ...updatedDevice.device } // this keeps employee_name
                    : device
                )
              );              
    
            closeEditModal(); // ✅ Close modal after saving
        } catch (error) {
            console.error("Error updating device:", error);
            alert("Error updating device. Check console for details.");
        }
    };
       

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this device?")) return;
      
        try {
            const response = await fetch(`/inventory-devicemanagement/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
      
            if (!response.ok) throw new Error("Failed to delete device.");
      
            alert("Device deleted successfully!"); // ✅ Simple alert for success
      
            window.location.reload(); // ✅ Refresh the user list
        } catch (error) {
            console.error("Error deleting device:", error);
            alert("Error deleting device."); // ✅ Alert for errors
        }
      };
    return (
        <>
            <Head title="Inventory Device List" />
            <div className="dashboard-wrapper">
                <SidebarInventory />
                <div className="device-list-container">
                    <h2>Device List ({devices.length} devices)</h2>

                    {/* Filters */}
                    <div className="filter-container">
                        <label className="entries-label">
                            Show 
                            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="entries-select">
                                {[15, 30, 45, 60, 75, 100].map(num => (
                                    <option key={num} value={num}>{num} </option>
                                ))}
                            </select>
                            entries
                        </label>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        {/* Classification Dropdown */}
                        <select value={selectedClassification} onChange={(e) => setSelectedClassification(e.target.value)}>
                            <option value="">Select Classification</option>
                            {classifications.map(classification => (
                                <option key={classification} value={classification}>
                                    {classification}
                                </option>
                            ))}
                        </select>

                        {/* Brand Dropdown */}
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Select Brand</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="device-table-container">
                    <table>
    <thead>
        <tr>
            <th>Device ID</th>
            <th>Host Name</th>
            <th>Tag No.</th>
            <th>Serial Number</th>
            <th>Brand / Model</th>
            <th>Classification</th>
            <th>Condition</th>
            <th>Remarks</th>
            <th>Assigned To</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {currentDevices.map((device) => (
            <tr key={device.id}>
                <td>{device.id}</td>
                <td className="clickable" onClick={() => handleDeviceClick(device)}>{device.computer_name || "N/A"}</td>
                <td className="clickable" onClick={() => handleDeviceClick(device)}>{device.tag_no}</td>
                <td>{device.serial_number}</td>
                <td>{device.brand_model}</td>
                <td>{device.classification}</td>
                <td>{device.condition}</td>
                <td>{device.remarks}</td>
                <td>{device.employee_name || "Unassigned"}</td> {/* Display Employee Name */}
                <td>
                    <FaEdit className="edit-icon" onClick={() => handleEditClick(device)} />
                    <FaTrash className="delete-icon" onClick={() => handleDelete(device.id)} />
                </td>
            </tr>
        ))}
    </tbody>
</table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>
                </div>
            </div>

            {/* Device Info Modal */}
            {selectedDevice && (
                <div className="modal-overlay">
                    <div className="details-modal-content">
                        {/* Header */}
            <div className="details-modal-header">
              <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
              <h2>Device's Information</h2>
              <FaTimes className="close-icon1" onClick={closeModal} />
            </div>

                        {/* Image Display */}
                        <div className="image-device-details">
                        {selectedDevice.image_file ? (<img src={`/device-image/${selectedDevice.image_file}`} 
                        alt="Device Image"className="device-image"
                        onError={(e) => e.currentTarget.style.display='none'} // Hide if not found
                        />
                    ) : (
                    <p>No Image Available</p>

                    )}
                    </div>

{/* Device Details */}
<div className="device-details">
    <div className="input-group">
        <label>Tag No:</label>
        <input type="text" value={selectedDevice.tag_no || ''} readOnly />
    </div>

    <div className="input-group">
        <label>With Activation Updates:</label>
        <input type="text" value={selectedDevice.activation_updates || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Classification:</label>
        <input type="text" value={selectedDevice.classification || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Brand / Model:</label>
        <input type="text" value={selectedDevice.brand_model || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Location:</label>
        <input type="text" value={selectedDevice.location || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Have QR Code:</label>
        <input type="text" value={selectedDevice.qr_code || ''} readOnly />
    </div>

    <div className="input-group">
        <label>With Activation:</label>
        <input type="text" value={selectedDevice.with_warranty || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Computer Name:</label>
        <input type="text" value={selectedDevice.computer_name || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Serial Number:</label>
        <input type="text" value={selectedDevice.serial_number || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Estimated Acquisition Year:</label>
        <input type="text" value={selectedDevice.estimated_acquisition_year || ''} readOnly />
    </div>

    <div className="input-group">
        <label>Condition:</label>
        <input type="text" value={selectedDevice.condition || ''} readOnly />
    </div>


    <div className="input-group">
        <label>Remarks:</label>
        <input type="text" value={selectedDevice.remarks || ''} readOnly />
    </div>
 </div>

    <div className="input-group">
        <label>Defects/Issues:</label>
        <input type="text" value={selectedDevice.need_to_be_repair || ''} readOnly />
    </div>

                    </div>
                </div>
            )}

              {/* Edit Device Modal */}
             {editDevice && (
    <div className="modal-overlay">
        <div className="edit-modal-content">
            <div className="edit-modal-header2">
                <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
                <h2>EDIT DEVICE</h2>
                <FaTimes className="close-icon2" onClick={closeEditModal} />
            </div>

            <div className="modal-body">
    <form className="edit-device-form">

                     {/* Image Upload */}
                    <div className="edit-image-section">
                    {imagePreview || editDevice?.image_file ? (
                        <img src={`/device-image/${editDevice?.image_file}`} alt="Device Image"/>
                    ) : (
                        
                        <p>No Image Available</p>
                    )}
                    </div>
                    
            <div className="choose-image">
            <input type="file" name="image_file" onChange={handleFileChange}  />
            </div>

            <div className="edit-grid">
            <div className="field">
                <label>Tag No.:</label>
                <input type="text" name="tag_no" value={editDevice.tag_no} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>Classification:</label>
                <select name="classification" value={editDevice.classification} onChange={handleInputChange}>
                    <option value="Laptop">Laptop</option>
                    <option value="Phone">Phone</option>
                    <option value="Tablet">Tablet</option>
                </select>
            </div>

            <div className="field">
                <label>Brand / Model:</label>
                <input type="text" name="brand_model" value={editDevice.brand_model} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>Serial Number:</label>
                <input type="text" name="serial_number" value={editDevice.serial_number} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>Condition:</label>
                <select name="condition" value={editDevice.condition} onChange={handleInputChange}>
                    <option value="Good">Good Condition</option>
                    <option value="Bad">Bad Conditiion</option>
                </select>
            </div>

            <div className="field">
                <label>Computer Name:</label>
                <input type="text" name="computer_name" value={editDevice.computer_name || ""} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>Activation Updates:</label>
                <select name="activation_updates" value={editDevice.activation_updates} onChange={handleInputChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div className="field">
                <label>Estimated Acquisition Year:</label>
                <input type="text" name="estimated_acquisition_year" value={editDevice.estimated_acquisition_year} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>Location:</label>
                <input type="text" name="location" value={editDevice.location} onChange={handleInputChange} />
            </div>

            <div className="field">
                <label>QR Code:</label>
                <select name="qr_code" value={editDevice.qr_code} onChange={handleInputChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div className="field">
                <label>Warranty:</label>
                <select name="with_warranty" value={editDevice.with_warranty} onChange={handleInputChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div className="field">
                <label>Remarks:</label>
                <input type="text" name="remarks" value={editDevice.remarks || ""} onChange={handleInputChange} />
            </div>
            </div>

                    {/* Save & Close Button */}
                    <button type="button" onClick={handleSaveChanges} className="save-btn1">Save & Close</button>
                </form>
            </div>
        </div>
    </div>
)}
        </>
    );
}