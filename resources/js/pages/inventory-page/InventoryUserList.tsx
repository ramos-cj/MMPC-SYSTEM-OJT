import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/userlist.css";

// Define the structure of Employee data
interface Employee {
  id: number;
  employee_number: string;
  first_name: string;
  middle_initial?: string;
  last_name: string;
  division_department: string;
  division_code: string;
  department_code: string;
}

const InventoryUserList: React.FC = () => {
  const [users, setUsers] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch employees and divisions/departments from database
  useEffect(() => {
    fetch("/inventory-user-management/list")
      .then((response) => response.json())
      .then((data: Employee[]) => {
        setUsers(data);

        // Extract unique Division and Department values from database
        const uniqueDivisions = [...new Set(data.map((user) => user.division_department))];
        const uniqueDepartments = [...new Set(data.map((user) => user.department_code))];

        setDivisions(uniqueDivisions);
        setDepartments(uniqueDepartments);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Sorting function for division/department
  const sortedUsers = [...users].sort((a, b) => {
    const fieldToSort = selectedDivision ? "division_department" : "department_code";
    return sortOrder === "asc"
      ? String(a[fieldToSort as keyof Employee]).localeCompare(String(b[fieldToSort as keyof Employee]))
      : String(b[fieldToSort as keyof Employee]).localeCompare(String(a[fieldToSort as keyof Employee]));
  });

  // Filtering based on user selection
  const filteredUsers = sortedUsers.filter(
    (user) =>
      (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employee_number.includes(searchTerm)) &&
      (selectedDivision ? user.division_department === selectedDivision : true) &&
      (selectedDepartment ? user.department_code === selectedDepartment : true)
  );

  // Sorting User ID
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="inventory-userlist-container">
      <SidebarInventory />
      <div className="userlist-content">
        <h2>USER LIST ({users.length} employees)</h2>

        {/* Filters */}
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
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* Division Dropdown */}
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">Filter by Division</option>
            {divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
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
                  ) : (
                    <MdArrowDropDown className="sort-icon" />
                  )}
                </th>
                <th>Employee Number</th>
                <th>First Name</th>
                <th>M.I</th>
                <th>Last Name</th>
                <th>Division</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td> {/* Auto-incrementing user ID */}
                  <td>{user.employee_number}</td>
                  <td>{user.first_name}</td>
                  <td>{user.middle_initial ?? "-"}</td>
                  <td>{user.last_name}</td>
                  <td>{user.division_department}</td>
                  <td>{user.department_code}</td>
                  <td className="userlist-actions">
                    <FaEdit className="edit-icon" />
                    <FaTrash className="delete-icon" />
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

export default InventoryUserList;
