import { useState } from "react";
import { Head } from "@inertiajs/react";
import { FaDownload, FaSearch, FaUpload, FaTimes } from "react-icons/fa";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/UserList.css";
import "@/styles/ImportFiles.css";
import mmpcLogo from "@/assets/mmpc-logo.png";

const InventoryImportFiles = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importedFiles, setImportedFiles] = useState<{ name: string; date: string; action: string }[]>([]);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(15);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isExportModalOpen, setExportModalOpen] = useState<boolean>(false);
    const [exportFormat, setExportFormat] = useState<"pdf" | "xlsx">("pdf");
    const [templateName, setTemplateName] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && (file.type === "application/pdf" || file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
            setSelectedFile(file);
            setImportedFiles((prevFiles) => [
                ...prevFiles,
                { name: file.name, date: new Date().toLocaleDateString("en-GB"), action: "Import" }
            ]);
        } else {
            alert("Invalid file type. Only PDF and Excel files are allowed.");
        }
    };

    const handleExport = () => {
        if (!templateName) {
            alert("Please enter a template name.");
            return;
        }
        if (selectedFiles.length === 0) {
            alert("Please select at least one file to export.");
            return;
        }
        setImportedFiles([...importedFiles, { name: templateName + '.' + exportFormat, date: new Date().toLocaleDateString("en-GB"), action: "Export" }]);
        setExportModalOpen(false);
        alert(`Exporting ${selectedFiles.join(", ")} as ${templateName}.${exportFormat}`);
    };

    return (
        <>
            <Head title="File Management" />
            <div className="inventory-userlist-container">
                <SidebarInventory />
                <div className="import-content">
                    <h2>File Management</h2>
                    <div className="file-actions">
                        <div className="import-box">
                            <label htmlFor="file-upload" className="file-label">Choose file to import (.pdf/.xlsx)</label>
                            <input type="file" id="file-upload" accept=".pdf,.xls,.xlsx" onChange={handleFileChange} hidden />
                            <button
                                className="import-btn"
                                onClick={() => {
                                    const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
                                    fileInput?.click();
                                }}>
                                <FaUpload /> Import
                            </button>
                        </div>
                        <div className="export-box">
                            <label>Choose file to export (.pdf/.xlsx)</label>
                            <button className="export-btn" onClick={() => setExportModalOpen(true)}>
                                <FaDownload /> Export
                            </button>
                        </div>
                    </div>

                    <div className="filter-container">
                        <label>Show <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select> entries</label>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Search..." className="search-box" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div className="userlist-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {importedFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td>{file.name}</td>
                                        <td>{file.date}</td>
                                        <td>{file.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isExportModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header2">
                            <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
                            <h2>Export Files</h2>
                            <FaTimes className="close-icon" onClick={() => setExportModalOpen(false)} />
                        </div>
                        <label className="template">Template Name:</label>
                        <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template Name" />
                        <label className="format">Format:</label>
                        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as "pdf" | "xlsx")}> 
                            <option value="pdf">PDF</option>
                            <option value="xlsx">XLSX</option>
                        </select>
                        <h3>Existing Files</h3>
                        <div className="checkbox-group">
                            {["Employees", "Devices",].map((file, index) => (
                                <label key={index}>
                                    <input type="checkbox" value={file} onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedFiles(prev => prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]);
                                    }} />
                                    {file}
                                </label>
                            ))}
                        </div>
                        <button className="export-modal-btn" onClick={handleExport}>Export</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InventoryImportFiles;