import { useState } from "react";
import { Head } from "@inertiajs/react";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "@/styles/DeviceList.css";
import "@/styles/userlist.css";

export default function InventoryDeviceList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Sample device data
    const devices = [
        { id: 1, tag: "TAG001", name: "Laptop", classification: "Electronics", model: "Dell XPS", condition: "Good", remarks: "None" },
        { id: 2, tag: "TAG002", name: "Tablet", classification: "Electronics", model: "iPad Pro", condition: "Fair", remarks: "Battery Issue" },
        // More sample data here...
    ];

    // Filtering logic
    const filteredDevices = devices.filter(device =>
        (device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedClassification === "" || device.classification === selectedClassification) &&
        (selectedBrand === "" || device.model.includes(selectedBrand))
    );
    
    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredDevices.length / entriesPerPage);
    
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
                                {[15, 30, 45, 60, 75, 100 ].map(num => (
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
                            <option value="select-classification">Select Classification</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                        </select>

                        {/* Brand Dropdown */}
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Select Brand</option>
                            <option value="Dell">Dell</option>
                            <option value="Apple">Apple</option>
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
                                        <td>{device.tag}</td>
                                        <td>{device.name}</td>
                                        <td>{device.classification}</td>
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
        </>
    );
}