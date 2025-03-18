import { useState } from "react";
import { Head } from "@inertiajs/react";
import { FaDownload, FaSearch } from "react-icons/fa";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/UserList.css";
import "@/styles/ImportFiles.css";

export default function InventoryImportFiles() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importedFiles, setImportedFiles] = useState<{ name: string; date: string }[]>([]);
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && (file.type === "application/pdf" || file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
            setSelectedFile(file);
            setImportedFiles([...importedFiles, { name: file.name, date: new Date().toLocaleDateString("en-GB") }]);
        } else {
            alert("Invalid file type. Only PDF and Excel files are allowed.");
        }
    };

    return (
        <>
            <Head title="Import Files" />
            <div className="inventory-userlist-container"> {/* Matches sidebar and table structure */}
                <SidebarInventory />
                <div className="import-content"> 
                    <h2>Import Files</h2>

                    {/* File Upload Box */}
                    <div className="import-box">
                        <label htmlFor="file-upload" className="file-label">
                            Choose file to import <br />
                            (.pdf/.xlsx)
                        </label>
                        <input type="file" id="file-upload" accept=".pdf,.xls,.xlsx" onChange={handleFileChange} hidden />
                        <button className="import-btn" onClick={() => document.getElementById("file-upload")?.click()}>
                            <FaDownload /> Import
                        </button>
                    </div>

                    {/* Filter Section */}
                    <div className="filter-container">
                        <label className="entries-label">Show
                            <select className="entries-select" value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select> entries
                        </label>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Search..." className="search-box" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    {/* File List Table */}
                    <div className="userlist-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {importedFiles.map((file, index) => (
                                    <tr key={index} className="clickable">
                                        <td>{file.name}</td>
                                        <td>{file.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}