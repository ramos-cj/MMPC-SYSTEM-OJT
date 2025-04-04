import { useEffect, useState } from 'react';
import SidebarExit from '@/components/sidebar-exitclearance';
import '@/styles/ExitClearanceStatus.css';
import '@/styles/userlist.css';
import { FaSearch } from 'react-icons/fa';
import ForDeletionTable from './ForDeletionTable';
import CompletedTable from './CompletedTable';

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

  // 🚀 Fetch data immediately when tab changes
  useEffect(() => {
    fetchEmployees(activeTab);
  }, [activeTab]);

  const fetchEmployees = async (tab: 'pending' | 'completed') => {
    try {
      const res = await fetch(`/clearance-status/list?status=${tab}`);
      const data = await res.json();
      setEmployees(data);

      const uniqueDivisions = Array.from(new Set(data.map((emp: Employee) => emp.division_department)));
      setDivisions(uniqueDivisions as string[]);  // Ensure TypeScript knows this is an array of strings
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

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

  const filteredByTab = filteredEmployees;

const totalPages = Math.ceil(filteredByTab.length / entriesPerPage);
const paginatedEmployees = filteredByTab.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);


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
  {activeTab === 'pending' ? (
    <ForDeletionTable
      data={paginatedEmployees}
      sortOrder={sortOrder}
      handleSort={handleSort}
      handleConfirmDeletion={handleConfirmDeletion}
    />
  ) : (
    <CompletedTable data={paginatedEmployees} />
  )}
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