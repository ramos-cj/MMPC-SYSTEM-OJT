import React from 'react';

interface Props {
  data: any[];
}

const CompletedTable: React.FC<Props> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Employee Number</th>
          <th>Employee Name</th>
          <th>Department</th>
          <th>Division</th>
          <th>Effectivity Date</th>
          <th>Advise of HR</th>
          <th>WISESDIT</th>
          <th>WISEDA</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((employee) => {
          const lastFiveEdit = employee.wisedit_deactivation?.slice(-5) || "";
          const lastFiveDa = employee.wiseda_exit_clearance?.slice(-5) || "";
          const isDaLink = employee.wiseda_exit_clearance?.startsWith("http");

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
                    WISEDIT-{lastFiveEdit}
                  </a>
                ) : "No Link"}
              </td>
              <td>
                {isDaLink ? (
                  <a href={employee.wiseda_exit_clearance} target="_blank" rel="noopener noreferrer">
                    WISESDIT-{lastFiveDa}
                  </a>
                ) : (
                  <span className="completed-status">{employee.wiseda_exit_clearance}</span>
                )}
              </td>
              <td><span className="completed-status">Approved</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CompletedTable;
