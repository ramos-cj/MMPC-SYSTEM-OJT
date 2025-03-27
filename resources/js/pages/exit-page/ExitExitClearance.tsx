import { useEffect, useState } from 'react';
import SidebarExit from '@/components/sidebar-exitclearance';
import '@/styles/exitClearance.css';
import "@/styles/userlist.css";
import { FaSearch, FaEdit, FaTimes } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

interface Employee {
  user_id: number;
  employee_number: string;
  employee_name: string;
  department: string;
  immediate_superior: string;
  remarks: string;
}

const ExitClearance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/exit-clearance/list");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployees();
  }, []);

  const sortedEmployees = [...employees].sort((a, b) => {
    return sortOrder === "asc"
      ? a.employee_name.localeCompare(b.employee_name)
      : b.employee_name.localeCompare(a.employee_name);
  });

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      (employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_number.includes(searchTerm)) &&
      (selectedDepartment ? employee.department === selectedDepartment : true) &&
      (selectedDivision ? employee.immediate_superior === selectedDivision : true)
  );

  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="exit-clearance-container">
      <SidebarExit />
      <div className="exit-clearance-content">
        <h2>Exit Clearance List</h2>

        <div className="filter-container">
          <label>Show
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select> entries
          </label>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Select by Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
          </select>
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">Select by Division</option>
            <option value="Admin">Admin</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="exit-clearance-table-container">
          <table>
            <thead>
              <tr>
                <th onClick={handleSort} className="sortable-header">
                  User ID {sortOrder === "asc" ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </th>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Immediate Superior</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.user_id}>
                  <td>{employee.user_id}</td>
                  <td>{employee.employee_number}</td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.immediate_superior}</td>
                  <td>{employee.remarks}</td>
                  <td>
                    <button onClick={() => setSelectedEmployee(employee)}>Edit User Info</button>
                    <button>Issue Exit Clearance</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>
      </div>

      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Employee Details</h3>
              <FaTimes onClick={() => setSelectedEmployee(null)} />
            </div>
            <div className="modal-body">
              <p><strong>Employee Name:</strong> {selectedEmployee.employee_name}</p>
              <p><strong>Employee Number:</strong> {selectedEmployee.employee_number}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Immediate Superior:</strong> {selectedEmployee.immediate_superior}</p>
              <p><strong>Remarks:</strong> {selectedEmployee.remarks}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitClearance;