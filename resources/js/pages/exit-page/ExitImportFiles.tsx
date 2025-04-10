import { Head } from '@inertiajs/react';
import Sidebar from '@/components/header'; // Ensure you have a Sidebar component
import '@/styles/inventoryDashboard.css';
import SidebarExitClearance from '@/components/sidebar-exitclearance';
import { FaUpload, FaDownload, FaSearch } from "react-icons/fa";
import mmpcLogo from "@/assets/mmpc-logo.png";
import "@/styles/ImportFiles.css";
import "@/styles/userlist.css";
import { useEffect, useState } from 'react';
import axios from "axios";


const ExitimportFiles = () => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [importedFiles, setImportedFiles] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);
        const [selectedExports, setSelectedExports] = useState<string[]>([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [templateName, setTemplateName] = useState("");
        const [entriesPerPage, setEntriesPerPage] = useState(15);
        const [currentPage, setCurrentPage] = useState(1);
    
        const filteredFiles = importedFiles.filter(file =>
            file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        const totalPages = Math.ceil(filteredFiles.length / entriesPerPage);
    
        const displayedFiles = filteredFiles.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
    
    
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
            formData.append("file_name", selectedFile.name); // ✅ Include original file name
            setLoading(true);
        
            try {
                const response = await axios.post('/inventory/import', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
        
                if (response.data.success) {
                    alert(response.data.message);
                    fetchFiles();
                } else {
                    alert("Import Failed: " + response.data.message);
                }
            } catch (error) {
                alert("Error importing file.");
                console.error("Error:", error);
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
    
            if (!templateName.trim()) {
                alert("Please enter a template name.");
                return;
            }
    
            try {
                const response = await axios.post('/inventory/export', 
                    { 
                        selectedData: selectedExports,
                        templateName: templateName.trim()  // ✅ Include template name
                    }, 
                    {
                        responseType: 'blob',
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
    
                const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = urlBlob;
                link.setAttribute('download', `${templateName.trim()}.xlsx`);
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
            <div className="inventory-page">
                <SidebarExitClearance />
                <div className="inventory-import-container">
                    <div className="import-header">
                        <h2>Import Files</h2>
                    </div>
                    <div className="file-actions">
                        <div className="import-box">
                        <h4>Choose files to import</h4>  
                            <input className="import-text"type="file" onChange={handleFileChange} />
                            <button onClick={handleImport} disabled={loading} className="import-btn">
                                {loading ? "Importing..." : <><FaUpload /> Import</>}
                            </button>
                        </div>
    
                        <div className="export-box">
                        <h4>Template Name:</h4>   
                        <div className="template-box">   
                        <input
                            type="text"
                            placeholder="Enter Template Name"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="template-name-input"
                        />
                        </div>
                            <div className="export-box-list">
                            <h5>Choose files to export:</h5>
                            <div>
                                <label><input type="checkbox" value="Employees" onChange={handleCheckboxChange} /> Employee</label>
                                <label><input type="checkbox" value="Devices" onChange={handleCheckboxChange} /> Devices</label>
                                <label><input type="checkbox" value="DeviceAssignments" onChange={handleCheckboxChange} /> Devices Assignment</label>
                            </div>
                            </div>
                
    
                            <button onClick={handleExport} className="export-btn"><FaDownload /> Export</button>
                        </div>
                    </div>
    
                    <div className="table-container">
                    <div className="filter-container">
                    <label className="entries-label">
                            Show
                            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                                {[15, 30, 45, 60, 75, 100].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                             entries
                        </label>
    
                        <div className="search-container">
                        <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        </div>
                        
                        <div className="import-table">
                        <h3>Recently Managed Files</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {displayedFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td>{file.file_name}</td>
                                        <td>{file.action}</td>
                                        <td>{new Date(file.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
    
                        {/* Pagination Controls */}
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    };
    
    export default ExitimportFiles ;