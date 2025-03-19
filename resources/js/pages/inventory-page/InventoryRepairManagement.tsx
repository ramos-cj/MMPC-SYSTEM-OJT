import React, { useState, useEffect } from "react";
import SidebarInventory from "@/components/sidebar-inventory";
import { FaSearch, FaTools } from "react-icons/fa";
import "@/styles/userlist.css";
import "@/styles/DeviceRepairManagement.css";

interface RepairItem {
  id: number;
  tag_no: string;
  general_name: string;
  brand_name: string;
  classification: string;
  model: string;
  computer_name: string;
  with_warranty: string;
  location: string;
  condition: string; // Added field to check for "Bad" condition
  need_to_be_repair: string; // Stores defects/issues
}

const RepairManagement: React.FC = () => {
  const [items, setItems] = useState<RepairItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [classifications, setClassifications] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Fetch only devices with "Bad" condition
  useEffect(() => {
    fetch("/repair-management/list")
      .then((response) => response.json())
      .then((data: RepairItem[]) => {
        // ✅ Filter only devices with a "Bad" condition
        const badDevices = data.filter((item) => item.condition === "Bad");
        setItems(badDevices);
        const uniqueClassifications = [...new Set(data.map(device => device.classification))];
                const uniqueBrands = [...new Set(data.map(device => device.brand_name))];

                setClassifications(uniqueClassifications);
                setBrands(uniqueBrands);
      })
      .catch((error) => console.error("Error fetching repair data:", error));
  }, []);

  // Filtering logic
  const filteredItems = items.filter(
    (item) =>
      (item.general_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tag_no.includes(searchTerm)) &&
        (selectedClassification === "" || item.classification === selectedClassification) &&
        (selectedBrand === "" || item.brand_name === selectedBrand)
  );

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  return (
    <div className="repair-management-container">
      <SidebarInventory />
      <div className="repair-content">
        <h2>Repair Management ({items.length} devices)</h2>

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
        <div className="repair-table-container">
          <table>
            <thead>
              <tr>
                <th>Tag No.</th>
                <th>General Name</th>
                <th>Brand Name</th>
                <th>Classification</th>
                <th>Model</th>
                <th>Computer Name</th>
                <th>Warranty</th>
                <th>Location</th>
                <th>Defects/Issues</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.tag_no}</td>
                  <td>{item.general_name}</td>
                  <td>{item.brand_name}</td>
                  <td>{item.classification}</td>
                  <td>{item.model}</td>
                  <td>{item.computer_name}</td>
                  <td>{item.with_warranty}</td>
                  <td>{item.location}</td>
                  <td>{item.need_to_be_repair || "N/A"}</td>
                  <td>
                    <button className="repair-action-btn">
                      <FaTools />
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
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </div>
      </div>
    </div>
  );
};

export default RepairManagement;
