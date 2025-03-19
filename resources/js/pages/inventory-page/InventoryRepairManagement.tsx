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
  warranty: string;
  location: string;
  defectivity: string;
}

const RepairManagement: React.FC = () => {
  const [items, setItems] = useState<RepairItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);

  useEffect(() => {
    fetch("/repair-management/list")
      .then((response) => response.json())
      .then((data: RepairItem[]) => setItems(data))
      .catch((error) => console.error("Error fetching repair data:", error));
  }, []);

  const filteredItems = items.filter(
    (item) =>
      (item.general_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tag_no.includes(searchTerm)) &&
      (selectedClassification ? item.classification === selectedClassification : true) &&
      (selectedBrand ? item.brand_name === selectedBrand : true)
  );

  return (
    <div className="repair-management-container">
      <SidebarInventory />
      <div className="repair-content">
        <h2>Repair Management ({items.length} devices)</h2>

        <div className="filter-container">
          <label className="entries-label">
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="entries-select"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
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

          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
          >
            <option value="">Select Classification</option>
            {/* Map classifications dynamically if needed */}
          </select>

          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Select Brand</option>
            {/* Map brands dynamically if needed */}
          </select>
        </div>

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
                <th>Defectivity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.slice(0, entriesPerPage).map((item) => (
                <tr key={item.id}>
                  <td>{item.tag_no}</td>
                  <td>{item.general_name}</td>
                  <td>{item.brand_name}</td>
                  <td>{item.classification}</td>
                  <td>{item.model}</td>
                  <td>{item.computer_name}</td>
                  <td>{item.warranty}</td>
                  <td>{item.location}</td>
                  <td>{item.defectivity}</td>
                  <td>
                    <button className="repair-action-btn">
                      <FaTools /> Repair
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepairManagement;