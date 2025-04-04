import React from 'react';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';


interface Props {
  data: any[];
  sortOrder: 'asc' | 'desc';
  handleSort: () => void;
  handleConfirmDeletion: (id: number) => void;
}

const ForDeletionTable: React.FC<Props> = ({ data, sortOrder, handleSort, handleConfirmDeletion }) => {
  return (
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
        {data.map((employee) => {
          const value = employee.wiseda_exit_clearance;
          const isLink = value?.startsWith("http");
          const displayText = isLink ? `WISESDIT-${value?.slice(-5)}` : value;
          const lastFive = employee.wisedit_deactivation?.slice(-5) || "";

          return (
            <tr key={employee.user_id}>
              <td>{employee.user_id}</td>
              <td>{employee.employee_number}</td>
              <td>{employee.employee_name}</td>
              <td>{employee.division_department}</td>
              <td>{employee.position}</td>
              <td>{employee.effectivity_date}</td>
              <td>{employee.advise_of_hr}</td>
              <td>
                {employee.wisedit_deactivation ? (
                  <a href={employee.wisedit_deactivation} target="_blank" rel="noopener noreferrer">
                    WISEDIT-{lastFive}
                  </a>
                ) : "No Link"}
              </td>
              <td>
                {isLink ? (
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    {displayText}
                  </a>
                ) : (
                  <span className="completed-status">{value}</span>
                )}
              </td>
              <td>
              <AiOutlineUserDelete className="edit-icon" onClick={() => handleConfirmDeletion(employee.user_id)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ForDeletionTable;
