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
                                            <FaEdit className="edit-icon" />
                                            <FaTrash className="delete-icon" />
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
                        {selectedDevice.image_file && (
                            <img src={`/storage/device_images/${selectedDevice.image_file}`} alt="Device Image" className="device-image" />
                        )}

                        {/* Device Details */}
                        <div className="device-details">
                            <p><strong>Tag No:</strong> {selectedDevice.tag_no}</p>
                            <p><strong>General Name:</strong> {selectedDevice.general_name}</p>
                            <p><strong>Classification:</strong> {selectedDevice.classification}</p>
                            <p><strong>Brand:</strong> {selectedDevice.brand_name}</p>
                            <p><strong>Model:</strong> {selectedDevice.model}</p>
                            <p><strong>Location:</strong> {selectedDevice.location}</p>
                            <p><strong>Serial Number:</strong> {selectedDevice.serial_number}</p>
                            <p><strong>Estimated Acquisition Year:</strong> {selectedDevice.estimated_acquisition_year}</p>
                            <p><strong>Condition:</strong> {selectedDevice.condition}</p>
                            <p><strong>Remarks:</strong> {selectedDevice.remarks}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
