import { useState, useEffect } from "react";
import axios from "axios";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaUpload, FaDownload } from "react-icons/fa";

const InventoryImportFiles = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importedFiles, setImportedFiles] = useState<any[]>([]);

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
        }
    };

    return (
        <div className="inventory-import-container">
            <SidebarInventory />
            <div className="import-content">
                <h2>File Management</h2>
                
                <div className="import-box">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleImport}><FaUpload /> Import</button>
                </div>
                
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
                                    <td>{file.filename}</td>
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
