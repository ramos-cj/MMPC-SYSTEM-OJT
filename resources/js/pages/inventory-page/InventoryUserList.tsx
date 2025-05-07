import React, { useState, useEffect } from "react";
import mmpcLogo from '@/assets/mmpc-logo1.png'; 
import { FaEdit, FaTrash, FaSearch, FaTimes, FaUsers } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import SidebarInventory from "@/components/sidebar-inventory";
import "@/styles/userlist.css";
import "@/styles/ExitUserList.css";


interface Employee {
  employee_id: number;
  employee_number: string;
  first_name: string;
  middle_initial?: string;
  last_name: string;
  position: string;
  division_department: string;
  division_code: string;
  department_code: string;
  section_code: string;
  assigned_devices: string[];
  computer_name?: string;
  employee_type: string;
}

const InventoryUserList: React.FC = () => {
  const [users, setUsers] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const employeeTypes: string[] = [
    "Regular Employee",
    "Third-Party",
    "Hourly Personnel",
    "Japanese Executives"
  ];

  // Fetch employees
  useEffect(() => {
    const fetchUsersAndDivisions = async () => {
        try {
            const userResponse = await fetch("/inventory-user-management/list");
            const userData = await userResponse.json();
            setUsers(userData);

            const divisionResponse = await fetch("/inventory-user-management/divisions");
            const divisionData = await divisionResponse.json();
            setDivisions(divisionData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchUsersAndDivisions();
  }, []);


  // Sorting function
  const sortedUsers = [...users].sort((a, b) => {
    const fieldToSort = selectedDivision ? "division_department" : "department_code";
    return sortOrder === "asc"
      ? String(a[fieldToSort as keyof Employee]).localeCompare(String(b[fieldToSort as keyof Employee]))
      : String(b[fieldToSort as keyof Employee]).localeCompare(String(a[fieldToSort as keyof Employee]));
  });

  // Filter users
  const filteredUsers = sortedUsers.filter(
    (user) =>
      (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employee_number.includes(searchTerm)) &&
      (selectedDivision === "" || user.division_department === selectedDivision) &&
      (selectedEmployeeType === "" || 
        user.employee_type?.toLowerCase().trim() === selectedEmployeeType.toLowerCase().trim()
      )
  );  

  const getFullName = (user: Employee) => {
    const middleInitial =
      user.middle_initial &&
      user.middle_initial !== "N/A" &&
      user.middle_initial !== "-" &&
      user.middle_initial.trim() !== ""
        ? `${user.middle_initial.replace(".", "")}. `
        : "";
    return `${user.first_name} ${middleInitial}${user.last_name}`;
  };
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Change Page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Sort User ID
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Open modal
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  // Close modal
  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const handleEditClick = async (employee: Employee) => {
    try {
      const response = await fetch(`/inventory-user-management/get/${employee.employee_id}`);
      if (!response.ok) throw new Error("Failed to fetch employee details.");
  
      const employeeData = await response.json();
  
      // Remove the dot if middle_initial has one
      const cleanedMiddleInitial = employeeData.middle_initial?.replace(".", "") || "";
  
      setEditEmployee({
        employee_id: employee.employee_id,
        employee_number: employeeData.employee_number,
        first_name: employeeData.first_name,
        middle_initial: cleanedMiddleInitial, // ✅ no dot
        last_name: employeeData.last_name,
        employee_type: employeeData.employee_type || "N/A",
        position: employeeData.position,
        division_department: employeeData.division_department,
        division_code: employeeData.division_code,
        department_code: employeeData.department_code,
        section_code: employeeData.section_code,
        assigned_devices: employee.assigned_devices || []
      });
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Error fetching employee details.");
    }
  };  

const handleSaveChanges = async () => {
  if (!editEmployee || !editEmployee.employee_id) {
      alert("Failed to find employee ID. Please try again.");
      return;
  }

  try {
      const response = await fetch(`/inventory-user-management/update/${editEmployee.employee_id}`, { 
          method: "PUT", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              employee_number: editEmployee.employee_number,
              first_name: editEmployee.first_name,
              middle_initial: editEmployee.middle_initial,
              last_name: editEmployee.last_name,
              employee_type: editEmployee.employee_type === "N/A" ? null : editEmployee.employee_type, // Save as null if set to N/A
              position: editEmployee.position,
              division_department: editEmployee.division_department,
              division_code: editEmployee.division_code,
              department_code: editEmployee.department_code,
              section_code: editEmployee.section_code
          }),
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error updating employee:", errorMessage);
          throw new Error("Failed to update employee.");
      }

      const updatedEmployee = await response.json();
      alert("Employee details updated successfully!");

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.employee_id === editEmployee.employee_id
            ? { ...user, ...editEmployee, assigned_devices: user.assigned_devices }
            : user
        )
      );      

      setEditEmployee(null); // Close the edit form
  } catch (error) {
      console.error("Error updating employee:", error);
      alert("Error updating employee.");
  }
};


const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this employee?")) return;

  try {
      const response = await fetch(`/inventory-user-management/delete/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete employee.");

      alert("Employee deleted successfully!"); // ✅ Simple alert for success

      window.location.reload(); // ✅ Refresh the user list
  } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee."); // ✅ Alert for errors
  }
};

const handlePrintAAR = async (employeeId: number) => {
  try {
    const response = await fetch(`/inventory-user-management/print-aar/${employeeId}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to generate AAR.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AAR_${employeeId}.docx`); // Change extension to .docx
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error generating AAR:", error);
    alert("Failed to generate AAR.");
  }
};

  
  return (
    <div className={`inventory-userlist-container ${selectedEmployee ? "blurred" : ""}`}>
      <SidebarInventory />
      <div className="userlist-content">
        <h2>User List ({users.length} employees)</h2>

        {/* Filters */}
        <div className="filter-container">
          <label className="entries-label">
            Show
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing entries per page
              }}
              className="entries-select"
            >
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

          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
              <option value="">All Divisions</option>
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>

            <select value={selectedEmployeeType} onChange={(e) => setSelectedEmployeeType(e.target.value)}>
              <option value="">All Employee Types</option>
              {employeeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
                <th>Full Name</th>
                <th>Employee Type</th>
                <th>Division</th>
                <th>Position</th>
                <th>Assigned Devices</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {paginatedUsers.map((user: Employee, index: number) => (
    <tr key={user.employee_id}>
      <td>{(currentPage - 1) * entriesPerPage + index + 1}</td>
      <td className="clickable" onClick={() => handleEmployeeClick(user)}>{user.employee_number}</td>
      <td className="clickable" onClick={() => handleEmployeeClick(user)}>{getFullName(user)}</td>
      <td>{user.employee_type}</td>
      <td>{user.division_department}</td>
      <td>{user.position}</td>
      <td>
        {user.assigned_devices && user.assigned_devices.length > 0 ? (
          user.assigned_devices.map((device: string, idx: number) => (
            <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>
              {device}
            </div>
          ))
        ) : (
          "No Device Assigned"
        )}
      </td>
      <td className="userlist-actions">
      <FaEdit className="edit-icon" onClick={() => handleEditClick(user)} />
      <FaTrash className="delete-icon" onClick={() => handleDelete(user.employee_id)} />
      <IoDocumentText className="edit-icon" onClick={() => handlePrintAAR(user.employee_id)} />
    </td>

    </tr>
  ))}
</tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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

      {/* Employee Info Modal */}
{selectedEmployee && (
    <div className="modal-overlay">
        <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
                <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
                <h2>Employee’s Information</h2>
                <FaTimes className="close-icon" onClick={closeModal} />
            </div>

            {/* Profile Picture & Name */}
            <div className="profile-section">
                <FaUsers className="user-icon" />
                <p className="employee-name">
  {selectedEmployee.first_name}{" "}
  {(selectedEmployee.middle_initial &&
    selectedEmployee.middle_initial !== "N/A" &&
    selectedEmployee.middle_initial !== "-" &&
    selectedEmployee.middle_initial.trim() !== "")
    ? `${selectedEmployee.middle_initial.replace(".", "")}. `
    : ""}
  {selectedEmployee.last_name}
</p>

            </div>

            {/* Employee Details (2 Columns) */}
            <div className="employee-details">
                <div className="column">
                    <label>First Name:</label>
                    <input type="text" value={selectedEmployee.first_name} readOnly />
                    <label>Middle Initial:</label>
                    <input type="text" value={selectedEmployee.middle_initial ?? ""} readOnly />
                    <label>Last Name:</label>
                    <input type="text" value={selectedEmployee.last_name} readOnly />
                    <label>Position:</label>
                    <input type="text" value={selectedEmployee.position} readOnly />
                    <label>Employee Type</label>
                <input type="text" value={selectedEmployee.employee_type} readOnly/>
                </div>

                <div className="column">
                    <label>Division Code:</label>
                    <input type="text" value={selectedEmployee.division_code} readOnly />
                    <label>Department Code:</label>
                    <input type="text" value={selectedEmployee.department_code} readOnly />
                    <label>Division/Department:</label>
                    <input type="text" value={selectedEmployee.division_department} readOnly />
                    <label>Section Code:</label>
                    <input type="text" value={selectedEmployee.section_code} readOnly />
                    <label>Assigned Devices:</label>
                <div className="assigned-devices-input">{selectedEmployee.assigned_devices && selectedEmployee.assigned_devices.length > 0 ? (
                    <ul>
                        {selectedEmployee.assigned_devices.map((device, idx) => (
                            <li key={idx}>{device}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No Device Assigned</p>
                )}
                </div>
                </div>
            </div>
        </div>
    </div>
)}

      
      {editEmployee && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
        <h3>Edit Profile</h3>
        <FaTimes className="close-icon" onClick={() => setEditEmployee(null)} />
      </div>

      <div className="modal-form">
  {editEmployee && (
    <>
      <div className="form-group1">
        <label>Employee Number:</label>
        <input
          type="text"
          value={editEmployee.employee_number || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, employee_number: e.target.value })}
        />
      </div>

      <div className="form-group1">
        <label>First Name:</label>
        <input
          type="text"
          value={editEmployee.first_name || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, first_name: e.target.value })}
        />
      </div>

      <div className="form-group1">
        <label>Middle Initial:</label>
        <input
          type="text"
          value={editEmployee.middle_initial || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, middle_initial: e.target.value })}
        />
      </div>

      <div className="form-group1">
        <label>Last Name:</label>
        <input
          type="text"
          value={editEmployee.last_name || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, last_name: e.target.value })}
        />
      </div>

      <div className="form-group1">
      <label>Division:</label>
            <select 
              value={editEmployee.division_department} 
              onChange={(e) => setEditEmployee({ ...editEmployee, division_department: e.target.value })}
            >
              {divisions.map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
      </div>

      <div className="form-group2">
        <label>Department:</label>
        <input
          type="text"
          value={editEmployee.position || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, position: e.target.value })}
        />
      </div>

      <div className="form-group2">
        <label>Section Code:</label>
        <input
          type="text"
          value={editEmployee.section_code || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, section_code: e.target.value })}
        />
      </div>

      <div className="form-group2">
        <label>Division Code:</label>
        <input
          type="text"
          value={editEmployee.division_code || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, division_code: e.target.value })}
        />
      </div>

      <div className="form-group2">
        <label>Department Code:</label>
        <input
          type="text"
          value={editEmployee.department_code || ""}
          onChange={(e) => setEditEmployee({ ...editEmployee, department_code: e.target.value })}
        />
        </div>
      <div className="form-group2">
        <label>Employee Type:</label>
            <select 
              value={editEmployee.employee_type} 
              onChange={(e) => setEditEmployee({ ...editEmployee, employee_type: e.target.value })}
            >
              {employeeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            </div>
    </>
  )}
</div>


      <button className="save-button" onClick={handleSaveChanges}>Save & Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default InventoryUserList;
