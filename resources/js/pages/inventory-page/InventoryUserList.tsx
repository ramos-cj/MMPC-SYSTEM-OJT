import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/userlist.css";

const InventoryUserList: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, empNumber: "32012345", firstName: "Marshall", middleInitial: "D", lastName: "Teach", divisionCode: "210321267", deptCode: "210321267" },
    { id: 2, empNumber: "32012346", firstName: "Mel Chor", middleInitial: "D", lastName: "Garp", divisionCode: "210321268", deptCode: "210321268" },
    { id: 3, empNumber: "32012347", firstName: "Shanks", middleInitial: "D", lastName: "Red", divisionCode: "210321269", deptCode: "210321269" },
    // Add more users for pagination testing
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Sort user list based on User ID
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === "asc") return a.id - b.id;
    if (sortOrder === "desc") return b.id - a.id;
    return 0;
  });

  // Filter logic
  const filteredUsers = sortedUsers.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.empNumber.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Toggle sort order
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="inventory-userlist-container">
      <SidebarInventory />
      <div className="userlist-content">
        <h2>USER LIST (253 employees)</h2>

        {/* Filters & Entries Selector */}
        <div className="filter-container">
          <label className="entries-label">
            Show
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="entries-select">
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
              <option value="75">75</option>
              <option value="100">100</option>
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

          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="210321267">Department 1</option>
            <option value="210321268">Department 2</option>
          </select>

          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">Select Division</option>
            <option value="Division 1">Division 1</option>
            <option value="Division 2">Division 2</option>
          </select>
        </div>

        {/* Table */}
        <div className="userlist-table-container">
          <table>
            <thead>
              <tr>
                <th onClick={handleSort} className="sortable-header">
                  User ID{" "}
                  {sortOrder === "asc" ? (
                    <MdArrowDropUp className="sort-icon" />
                  ) : sortOrder === "desc" ? (
                    <MdArrowDropDown className="sort-icon" />
                  ) : null}
                </th>
                <th>Employee Number</th>
                <th>First Name</th>
                <th>M.I</th>
                <th>Surname</th>
                <th>Division Code</th>
                <th>Department Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.empNumber}</td>
                  <td>{user.firstName}</td>
                  <td>{user.middleInitial}</td>
                  <td>{user.lastName}</td>
                  <td>{user.divisionCode}</td>
                  <td>{user.deptCode}</td>
                  <td className="userlist-actions">
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
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUserList;
