import { useEffect, useState } from 'react';
import SidebarExit from '@/components/sidebar-exitclearance';
import '@/styles/ExitClearanceStatus.css';
import '@/styles/userlist.css';
import { FaSearch } from 'react-icons/fa';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

interface Employee {
  user_id: number;
  employee_number: string;
  employee_name: string;
  division_department: string;
  position: string;
  employee_type: string;
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

const ClearanceStatus: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`/clearance-status/list?status=${activeTab}`);
        const data = await response.json();
        setEmployees(data);

        // Get unique divisions from the fetched data
        const uniqueDivisions = Array.from(new Set(data.map((emp: Employee) => emp.division_department)));
        setDivisions(uniqueDivisions as string[]);  // Ensure TypeScript knows this is an array of strings
  
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchEmployees();
  }, [activeTab]);

  const sortedEmployees = [...employees].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.employee_name.localeCompare(b.employee_name)
      : b.employee_name.localeCompare(a.employee_name);
  });

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      (employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_number.includes(searchTerm)) &&
        (selectedDivision === "" || employee.division_department === selectedDivision) &&
        (selectedEmployeeType === "" || employee.employee_type === selectedEmployeeType)
  );

  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleConfirmDeletion = async (id: number) => {
    try {
      const response = await fetch(`/clearance-status/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
  
      if (!response.ok) throw new Error("Failed to confirm deletion");
  
      alert("Deletion confirmed and marked as Approved!");
  
      // Refresh list by refetching
      const refreshed = await fetch(`/clearance-status/list?status=${activeTab}`);
      const updatedData = await refreshed.json();
      setEmployees(updatedData);
  
    } catch (error) {
      alert("Error confirming deletion");
      console.error(error);
    }
  };  

  return (
    <div className="clearance-status-container">
      <SidebarExit />
      <div className="clearance-status-content">
      <h2>Exit Clearance List</h2>

      <div className="status-tabs">
          <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>For Deletion</button>
          <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>Completed</button>
        </div>
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


        <div className="clearance-status-table-container">
          <table>
            <thead>
              <tr>
                <th onClick={handleSort} className="sortable-header">
                  User ID {sortOrder === 'asc' ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </th>
                <th>Employee Number</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Division</th>
                <th>Effectivity Date</th>
                <th>Advise of HR</th>
                <th>WISESDIT</th>
                <th>WISEDA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {paginatedEmployees.map((employee) => {
    const value = (employee as any).wiseda_exit_clearance;
    const isLink = value?.startsWith("http://") || value?.startsWith("https://");
    const displayText = isLink ? `WISESDIT-${value?.slice(-5)}` : value;
    const lastFive = employee.wisedit_deactivation
      ? employee.wisedit_deactivation.slice(-5)
      : "";

    // For Deletion tab (must have wiseda value)
    if (activeTab === 'pending') {
      if (!value || value.trim() === "") return null;

      return (
        <tr key={employee.user_id}>
          <td>{employee.user_id}</td>
          <td>{employee.employee_number}</td>
          <td>{employee.employee_name}</td>
          <td>{employee.division_department}</td>
          <td>{employee.position}</td>
          <td>{employee.effectivity_date}</td>
          <td>{employee.advise_of_hr}</td>
          <td>{employee.wisedit_deactivation ? (
            <a
              href={employee.wisedit_deactivation}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              WISEDIT-{lastFive}
            </a>
          ) : (
            "No Link Provided"
          )}</td>
          <td>
  {isLink ? (
    <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
      {displayText}
    </a>
  ) : (
    <span className="completed-status">{displayText}</span>
  )}
</td>
<td>
  <button
    style={{ padding: '5px 10px', backgroundColor: '#43a047', color: 'white', border: 'none', borderRadius: '4px' }}
    onClick={() => handleConfirmDeletion(employee.user_id)}
  >
    Confirm Deletion
  </button>
</td>
        </tr>
      );
    }

    // Completed tab (remarks must be 'Approved')
    if (activeTab === 'completed' && employee.remarks === 'Approved') {
      return (
        <tr key={employee.user_id}>
          <td>{employee.user_id}</td>
          <td>{employee.employee_number}</td>
          <td>{employee.employee_name}</td>
          <td>{employee.division_department}</td>
          <td>{employee.position}</td>
          <td><span className="completed-status">Approved</span></td>
        </tr>
      );
    }

    return null;
  })}
</tbody>

          </table>
        </div>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          {[...Array(totalPages)].map((_, index) => (
            <button key={index + 1} className={currentPage === index + 1 ? 'active' : ''} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ClearanceStatus;