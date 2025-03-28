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
  division_code: string;
  department: string;
  remarks: string;
}

const ClearanceStatus: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
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
      (selectedDepartment ? employee.department === selectedDepartment : true) &&
      (selectedDivision ? employee.division_code === selectedDivision : true)
  );

  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
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
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
          </select>
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">Select Division</option>
            <option value="Admin">Admin</option>
            <option value="Finance">Finance</option>
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
                <th>Division Code</th>
                <th>Department</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.user_id}>
                  <td>{employee.user_id}</td>
                  <td>{employee.employee_number}</td>
                  <td>{employee.employee_name}</td>
                  <td>{employee.division_code}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span className={employee.remarks === 'Pending' ? 'pending-status' : 'completed-status'}>
                      {employee.remarks}
                    </span>
                  </td>
                </tr>
              ))}
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