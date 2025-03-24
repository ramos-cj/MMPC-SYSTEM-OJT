import { useState, useEffect } from "react";
import axios from "axios";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUpload, FaDownload } from "react-icons/fa";
import "@/styles/ImportFiles.css";

const InventoryImportFiles = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importedFiles, setImportedFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedExports, setSelectedExports] = useState<string[]>([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/inventory/file-logs');
            setImportedFiles(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleImport = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        setLoading(true);

        try {
            const response = await axios.post('/inventory/import', formData);
            if (response.data.success) {
                alert(response.data.message);
                fetchFiles();
            } else {
                alert("Import Failed: " + response.data.message);
            }
        } catch (error) {
            alert("Error importing file.");
        } finally {
            setLoading(false);
            setSelectedFile(null);
        }
    };

    const handleExport = async () => {
        if (selectedExports.length === 0) {
            alert("Please select at least one data type to export.");
            return;
        }
    
        try {
            const response = await axios.post('/inventory/export', { selectedData: selectedExports }, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', `Inventory_Data_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Error exporting data.");
            console.error(error);
        }
    };    

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        if (checked) {
            setSelectedExports(prev => [...prev, value]);
        } else {
            setSelectedExports(prev => prev.filter(item => item !== value));
        }
    };

    return (
        <div className="inventory-import-container">
            <SidebarInventory />
            <div className="import-content">
                <h2>File Management</h2>
                
                {/* File Import Section */}
                <div className="import-box">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleImport} disabled={loading}>
                        {loading ? "Importing..." : <><FaUpload /> Import</>}
                    </button>
                </div>
                
                {/* File Export Section */}
                <div className="export-box">
                    <h3>Select Data to Export:</h3>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                value="Employees"
                                onChange={handleCheckboxChange}
                            /> Employees
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Devices"
                                onChange={handleCheckboxChange}
                            /> Devices
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="DeviceAssignments"
                                onChange={handleCheckboxChange}
                            /> Device Assignments
                        </label>
                    </div>
                    <button onClick={handleExport} disabled={selectedExports.length === 0}>
                        <FaDownload /> Export Selected Data
                    </button>
                </div>

                {/* Imported Files Table */}
                <div>
                    <h3>Imported Files</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Action</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td>{file.file_name}</td>
                                    <td>{file.action}</td>
                                    <td>{new Date(file.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryImportFiles;
