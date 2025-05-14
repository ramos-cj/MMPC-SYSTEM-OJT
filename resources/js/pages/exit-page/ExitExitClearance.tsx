import { useEffect, useState } from 'react';
import SidebarExit from '@/components/sidebar-exitclearance';
import '@/styles/exitClearance.css';
import "@/styles/userlist.css";
import { FaSearch, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { FcLeave } from 'react-icons/fc';
import { GoIssueTracks } from "react-icons/go";
import mmpcLogo from '@/assets/mmpc-logo1.png';

interface Employee {
  id: number;
  employee_number: string;
  first_name: string;
  middle_initial: string;
  last_name: string;
  division_department: string;
  position: string;
  section_code: string;
  division_code: string;
  department_code: string;
  employee_type: string;
  assigned_devices: string[];
  effectivity_date: string;
  advise_of_hr: string;
  wisedit_deactivation: string;
  wiseda_exit_clearance: string;
  remarks: string;
}

const employeeTypes: string[] = [
  "Regular Employee",
  "Third-Party",
  "Hourly Personnel",
  "Japanese Executives"
];

const ExitClearance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [selectedEmployeeForUpdate, setSelectedEmployeeForUpdate] = useState<Employee | null>(null);
  const [wisedaLink, setWisedaLink] = useState<string>("");
  const [showWisedaModal, setShowWisedaModal] = useState(false);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/exit-clearance/list");
        if (!response.ok) {
          throw new Error("Failed to fetch issued clearances.");
        }
  
        const data: Employee[] = await response.json();  // Tell TypeScript this is an array of Employee objects
        setEmployees(data);
  
        // Get unique divisions from the fetched data
        const uniqueDivisions = Array.from(new Set(data.map((emp: Employee) => emp.division_department)));
        setDivisions(uniqueDivisions as string[]);  // Ensure TypeScript knows this is an array of strings
  
      } catch (error) {
        console.error("Error fetching issued clearance data:", error);
      }
    };
    fetchEmployees();
  }, []);
  

  const sortedEmployees = [...employees].sort((a, b) => {
    return sortOrder === "asc"
      ? a.first_name.localeCompare(b.first_name)
      : b.first_name.localeCompare(a.first_name);
  });

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      (!employee.wiseda_exit_clearance || employee.wiseda_exit_clearance.trim() === "") && 
      (employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_number.includes(searchTerm)) &&
      (selectedDivision === "" || employee.division_department === selectedDivision) &&
      (selectedEmployeeType === "" || employee.employee_type === selectedEmployeeType)
  );  

  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleWisedaClick = (employee: Employee) => {
    setSelectedEmployeeForUpdate(employee);
    setWisedaLink(employee.wiseda_exit_clearance || ""); // preload if available
    setShowWisedaModal(true);
  };  

  const handleSaveWisedaLink = async () => {
    if (!selectedEmployeeForUpdate) return;
  
    try {
      const response = await fetch(`/exit-clearance/update-wiseda/${selectedEmployeeForUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wiseda_exit_clearance: wisedaLink || null }),
      });
  
      if (!response.ok) throw new Error("Failed to update WISEDA link");
  
      alert("Wiseda link updated successfully!");
      setShowWisedaModal(false);
      setSelectedEmployeeForUpdate(null);
      setWisedaLink("");
  
      // Refresh data
      const updated = await response.json();
      setEmployees(prev => prev.map(emp => 
        emp.id === updated.id ? { ...emp, wiseda_exit_clearance: updated.wiseda_exit_clearance } : emp
      ));
    } catch (error) {
      alert("Error updating wiseda_exit_clearance");
      console.error(error);
    }
  };  

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee's exit clearance record?")) return;
  
    try {
      const response = await fetch(`/exit-clearance/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Failed to delete employee.");
  
      // Remove the employee from state without reloading
      setEmployees(prev => prev.filter(emp => emp.id !== id));
  
      alert("Exit clearance deleted successfully!");
    } catch (error) {
      console.error("Error deleting exit clearance:", error);
      alert("Error deleting exit clearance.");
    }
  };

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
  
  return (
    <div className="exit-clearance-container">
      <SidebarExit />
      <div className="exit-clearance-content">
        <h2>Issued Exit Clearances</h2>

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
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Division Filter */}
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">All Divisions</option>
            {divisions.map((division) => (
              <option key={division} value={division}>{division}</option>
            ))}
          </select>

          {/* Employee Type Filter */}
          <select value={selectedEmployeeType} onChange={(e) => setSelectedEmployeeType(e.target.value)}>
            <option value="">All Employee Types</option>
            {employeeTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="userlist-table-container">
          <table>
            <thead>
              <tr style={{ backgroundColor: "#c62828", color: "white" }}>
                <th onClick={handleSort} className="sortable-header">
                  User ID {sortOrder === "asc" ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </th>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Device Assigned</th>
                <th>Effectivity Date</th>
                <th>Advise of HR</th>
                <th>WISESDIT</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {paginatedEmployees.map((employee) => {
    // Extract last 5 characters from the wisedit_deactivation link
    const lastFive = employee.wisedit_deactivation
      ? employee.wisedit_deactivation.slice(-5)
      : "";

    return (
      <tr key={employee.id}>
        <td>{employee.id}</td>
        <td>{employee.employee_number}</td>
        <td>{getFullName(employee)}</td>
        <td>{employee.division_department}</td>
        <td>{employee.position}</td>
        <td>
  {employee.assigned_devices && employee.assigned_devices.trim() !== "" ? (
    employee.assigned_devices.split(",").map((device: string, idx: number) => (
      <div key={idx} style={{ whiteSpace: "pre-wrap" }}>{device.trim()}</div>
    ))
  ) : (
    "No Device Assigned"
  )}
</td>
        <td>{employee.effectivity_date}</td>
        <td>{employee.advise_of_hr}</td>
        <td>
          {employee.wisedit_deactivation ? (
            <a
              href={employee.wisedit_deactivation}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "red", textDecoration: "underline" }}
            >
              WISEDIT-{lastFive}
            </a>
          ) : (
            "No Link Provided"
          )}
        </td>
        <td className="userlist-actions">
        <GoIssueTracks
  className="edit-icon"
  title="Update WISEDA"
  onClick={() => handleWisedaClick(employee)}
/>
          <FaTrash className="delete-icon" onClick={() => handleDelete(employee.id)} />
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>


        {showWisedaModal && (
          <div className="modal-overlay">
    <div className="modal-content">
        {/* Header */}
        <div className="exit-modal-header">
            <img src={mmpcLogo} alt="MMPC Logo" className="mmpc-logo" />
            <h3>Update WISEDA - Exit Clearance</h3>
            <FaTimes className="exit-close-icon" onClick={() => setShowWisedaModal(false)} />
        </div>

        {/* Body */}
        <label className="input-label">Choose or input a link:</label>
        <input
            type="text"
            placeholder="https://example.com/..."
            value={wisedaLink}
            onChange={(e) => setWisedaLink(e.target.value.trim())}
            className="styled-input"
        />

        <button className="employee-docu" onClick={() => setWisedaLink("Clearance Document")}>
            Employee's Document Cleared
        </button>

        {/* Footer */}
        <div style={{ marginTop: "15px" }}>
            <button className="save-button" onClick={handleSaveWisedaLink}>Save</button>
            <button className="cancel-button" onClick={() => setShowWisedaModal(false)} style={{ marginLeft: "10px" }}>
                Cancel
            </button>
        </div>
    </div>
</div>
)}

      </div>
    </div>
  );
};

export default ExitClearance;
