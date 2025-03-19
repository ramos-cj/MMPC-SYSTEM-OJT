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
    general_name: string;
    classification: string;
    model: string;
    condition: string;
    remarks: string;
    brand_name: string;
    location: string;
    serial_number: string;
    estimated_acquisition_year: string;
    accessories?: string;
    with_warranty: string;
    computer_name?: string;
    qr_code: string;
    need_to_be_repair: string;
    pi_guard: string;
    property_tag: string;
    activation_updates: string;
    image_file?: string; // Image filename stored in the database
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
                const uniqueBrands = [...new Set(data.map(device => device.brand_name))];

                setClassifications(uniqueClassifications);
                setBrands(uniqueBrands);
            })
            .catch(err => console.error("Error fetching devices:", err));
    }, []);

    // Filtering logic
    const filteredDevices = devices.filter(device =>
        (device.general_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.tag_no.includes(searchTerm)) &&
        (selectedClassification === "" || device.classification === selectedClassification) &&
        (selectedBrand === "" || device.brand_name === selectedBrand)
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
                    device.id === updatedDevice.device.id ? updatedDevice.device : device
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
                                    <th>Tag No.</th>
                                    <th>General Name</th>
                                    <th>Classification</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Condition</th>
                                    <th>Remarks</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDevices.map((device) => (
                                    <tr key={device.id}>
                                        <td>{device.id}</td>
                                        <td className="clickable" onClick={() => handleDeviceClick(device)}>{device.tag_no}</td>
                                        <td>{device.general_name}</td>
                                        <td>{device.classification}</td>
                                        <td>{device.brand_name}</td>
                                        <td>{device.model}</td>
                                        <td>{device.condition}</td>
                                        <td>{device.remarks}</td>
                                        <td className="device-actions">
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
                    <div className="modal-content">
                        {/* Header */}
            <div className="modal-header">
              <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
              <h2>Device's Information</h2>
              <FaTimes className="close-icon" onClick={closeModal} />
            </div>

                        {/* Image Display */}
                        {selectedDevice.image_file ? (
   <img
   src={`/device-image/${selectedDevice.image_file}`} 
   alt="Device Image"
   className="device-image"
   style={{ width: "150px", height: "auto" }}
   onError={(e) => e.currentTarget.style.display='none'} // Hide if not found
/>

) : (
    <p>No Image Available</p>
)}


                        {/* Device Details */}
                        <div className="device-details">
                            <p><strong>Tag No:</strong> {selectedDevice.tag_no}</p>
                            <p><strong>IP Guard:</strong> {selectedDevice.pi_guard}</p>
                            <p><strong>General Name:</strong> {selectedDevice.general_name}</p>
                            <p><strong>With Activation Updates:</strong> {selectedDevice.activation_updates}</p>
                            <p><strong>Classification:</strong> {selectedDevice.classification}</p>
                            <p><strong>Brand Name:</strong> {selectedDevice.brand_name}</p>
                            <p><strong>Model Name:</strong> {selectedDevice.model}</p>
                            <p><strong>Location:</strong> {selectedDevice.location}</p>
                            <p><strong>Have QR Code:</strong> {selectedDevice.qr_code}</p>
                            <p><strong>Property Tag:</strong> {selectedDevice.property_tag}</p>
                            <p><strong>With Activation:</strong> {selectedDevice.with_warranty}</p>
                            <p><strong>Computer Name:</strong> {selectedDevice.computer_name}</p>
                            <p><strong>Serial Number:</strong> {selectedDevice.serial_number}</p>
                            <p><strong>Estimated Acquisition Year:</strong> {selectedDevice.estimated_acquisition_year}</p>
                            <p><strong>Condition:</strong> {selectedDevice.condition}</p>
                            <p><strong>Defects/Issues:</strong> {selectedDevice.need_to_be_repair}</p>
                            <p><strong>Remarks:</strong> {selectedDevice.remarks}</p>
                        </div>
                    </div>
                </div>
            )}

             {/* Edit Device Modal */}
{editDevice && (
    <div className="modal-overlay">
        <div className="modal-content edit-modal">
            <div className="modal-header">
                <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
                <h2>EDIT DEVICE</h2>
                <FaTimes className="close-icon" onClick={closeEditModal} />
            </div>

            <div className="modal-body">
                <form className="edit-device-form">
                    <div className="edit-grid">
                        {/* Left Column */}
                        <div className="edit-column">
                            <label>Tag No.:</label>
                            <input type="text" name="tag_no" value={editDevice.tag_no} onChange={handleInputChange} />

                            <label>General Name:</label>
                            <input type="text" name="general_name" value={editDevice.general_name} onChange={handleInputChange} />

                            <label>Brand Name:</label>
                            <input type="text" name="brand_name" value={editDevice.brand_name} onChange={handleInputChange} />

                            <label>Classification:</label>
                            <select name="classification" value={editDevice.classification} onChange={handleInputChange}>
                                <option value="Laptop">Laptop</option>
                                <option value="Phone">Phone</option>
                                <option value="Tablet">Tablet</option>
                            </select>

                            <label>Model:</label>
                            <input type="text" name="model" value={editDevice.model} onChange={handleInputChange} />

                            <label>Serial Number:</label>
                            <input type="text" name="serial_number" value={editDevice.serial_number} onChange={handleInputChange} />

                            <label>Property Tag:</label>
                            <input type="text" name="property_tag" value={editDevice.property_tag || ""} onChange={handleInputChange} />

                            <label>Computer Name:</label>
                            <input type="text" name="computer_name" value={editDevice.computer_name || ""} onChange={handleInputChange} />
                        </div>

                        {/* Right Column */}
                        <div className="edit-column">
                            <label>With IP-Guard:</label>
                            <select name="pi_guard" value={editDevice.pi_guard} onChange={handleInputChange}>
                                <option value="Unauthorized">Unauthorized</option>
                                <option value="Unclassified">Unclassified</option>
                            </select>

                            <label>Activation Updates:</label>
                            <select name="activation_updates" value={editDevice.activation_updates} onChange={handleInputChange}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <label>Accessories:</label>
                            <input type="text" name="accessories" value={editDevice.accessories || ""} onChange={handleInputChange} />

                            <label>Estimated Acquisition Year:</label>
                            <input type="text" name="estimated_acquisition_year" value={editDevice.estimated_acquisition_year} onChange={handleInputChange} />

                            <label>Location:</label>
                            <input type="text" name="location" value={editDevice.location} onChange={handleInputChange} />

                            <label>QR Code:</label>
                            <select name="qr_code" value={editDevice.qr_code} onChange={handleInputChange}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <label>Warranty:</label>
                            <select name="with_warranty" value={editDevice.with_warranty} onChange={handleInputChange}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <label>Remarks:</label>
                            <input type="text" name="remarks" value={editDevice.remarks || ""} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="edit-image-section">
                    <label>Current Image:</label>
                    {imagePreview || editDevice?.image_file ? (
                        <img src={`/device-image/${editDevice?.image_file}`} alt="Device Image" style={{ width: "150px", height: "auto" }} />
                    ) : (
                        <p>No Image Available</p>
                    )}
                    <input type="file" name="image_file" onChange={handleFileChange} />
                    </div>

                    {/* Save & Close Button */}
                    <button type="button" onClick={handleSaveChanges} className="save-btn">Save & Close</button>
                </form>
            </div>
        </div>
    </div>
)}
        </>
    );
}