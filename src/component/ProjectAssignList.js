// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProjectAssignList = () => {
//   const navigate = useNavigate();
//   const { isAuth, userData } = useSelector((state) => state.login);
//   const employeeId = userData ? userData.employeeId : null;
//   const userType = userData ? userData.userType : null;
//   const [assignments, setAssignments] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const isAdmin = userType === "Admin";

//   useEffect(() => {
//     fetchEmployees();
//     fetchAssignments();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/employee_list`
//       );
//       setEmployees(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch employee list", err);
//     }
//   };

//   const fetchAssignments = async () => {
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const payload = {
//         employee_id: isAdmin ? selectedEmployee : employeeId,
//         from_date: today || "",
//         to_date: today || "",
//       };

//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get_assigned_project`,
//         payload
//       );
//       setAssignments(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch assignments", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this assignment?"))
//       return;

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/delete_project_assign?id=${id}`
//       );
//       setSuccessMessage("Assignment deleted successfully.");
//       fetchAssignments();
//     } catch (err) {
//       console.error("Failed to delete assignment", err);
//     }
//   };

//   const handleEdit = (id) => {
//     if (isAdmin) {
//       navigate(`/dashboard/project-assign`, { state: { id } });
//     } else {
//       navigate(`/dashboard/employeeTask`, { state: { id } });
//     }
//   };

//   const formatDateTime = (datetime) => {
//     if (!datetime) return "";
//     const date = new Date(datetime);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     })}`;
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {isAdmin ? <h2 className="text-4xl font-bold text-center text-black mb-6">
//         Project Assignment List
//       </h2>:<h2 className="text-4xl font-bold text-center text-black mb-6">
//       Daily Task List
//       </h2>}

//       {isAdmin && (
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={() => navigate("/dashboard/project-assign")}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
//           >
//             Assign Project
//           </button>
//         </div>
//       )}

//       {successMessage && (
//         <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
//           {successMessage}
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         {isAdmin && (
//           <select
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3"
//           >
//             <option value="">Select Employee</option>
//             {employees.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>
//         )}

//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3"
//         />

//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3"
//         />

//         <button
//           onClick={() => fetchAssignments()}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
//         >
//           Filter
//         </button>
//       </div>

//       {assignments.length > 0 ? (
//         <div className="overflow-x-auto mt-6">
//           <table className="min-w-full border border-gray-600 table-auto shadow-lg rounded-xl">
//             <thead className="bg-gray-200 text-gray-800 text-md">
//               <tr>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Employee Name
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Project
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Sub Product
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Assigned Date
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Deadline Date
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center w-64">
//                   Task
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center w-96">
//                   Description
//                 </th>
//                 <th className="p-4 border border-gray-600 text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {assignments.map((assign) => (
//                 <tr key={assign.id} className="text-center hover:bg-gray-100">
//                   <td className="p-4 border border-gray-600">
//                     {assign.employee_name}
//                   </td>
//                   <td className="p-4 border border-gray-600">
//                     {assign.project_name}
//                   </td>
//                   <td className="p-4 border border-gray-600">
//                     {assign.sub_products}
//                   </td>
//                   <td className="p-4 border border-gray-600">
//                     {formatDateTime(assign.assigned_date)}
//                   </td>
//                   <td className="p-4 border border-gray-600">
//                     {formatDateTime(assign.deadline_date)}
//                   </td>
//                   <td className="p-4 border border-gray-600 text-center whitespace-pre-wrap">
//                     {assign.task_details}
//                   </td>
//                   <td className="p-4 border border-gray-600 text-center whitespace-pre-wrap">
//                     {assign.task_description}
//                   </td>
//                   <td className="p-4 border border-gray-600">
//                     {isAdmin ? (
//                       <div className="flex justify-center gap-4">
//                         <button
//                           onClick={() => handleEdit(assign.id)}
//                           className="text-blue-600 font-semibold hover:underline"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(assign.id)}
//                           className="text-red-600 font-semibold hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-center gap-4">
//                         <button
//                           onClick={() => handleEdit(assign.id)}
//                           className="text-blue-600 font-semibold hover:underline"
//                         >
//                           View
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center text-black mt-10">
//           No assignments found.
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectAssignList;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProjectAssignList = () => {
  const navigate = useNavigate();
  const { isAuth, userData } = useSelector((state) => state.login);
  const employeeId = userData ? userData.employeeId : null;
  const userType = userData ? userData.userType : null;
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isAdmin = userType === "Admin";

  useEffect(() => {
    fetchEmployees();
    fetchAssignments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee_list`
      );
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch employee list", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        employee_id: isAdmin ? selectedEmployee : employeeId,
        from_date: fromDate || today,
        to_date: toDate || today,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_assigned_project`,
        payload
      );
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/delete_project_assign?id=${id}`
      );
      setSuccessMessage("Assignment deleted successfully.");
      fetchAssignments();
    } catch (err) {
      console.error("Failed to delete assignment", err);
    }
  };

  const handleEdit = (id) => {
    if (isAdmin) {
      navigate(`/dashboard/project-assign`, { state: { id } });
    } else {
      navigate(`/dashboard/employeeTask`, { state: { id } });
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-4xl font-bold text-center text-black mb-6">
        {isAdmin ? "Project Assignment List" : "Daily Task List"}
      </h2>

      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/dashboard/project-assign")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
          >
            Assign Project
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
          {successMessage}
        </div>
      )}

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
        {isAdmin && (
          <div>
            <label className="mb-1 font-medium text-gray-700 block">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 font-medium text-gray-700 block">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        <div>
          <label className="mb-1 font-medium text-gray-700 block">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        <div>
          <button
            onClick={fetchAssignments}
            className="bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {assignments.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300 table-auto shadow-lg rounded-xl text-sm">
            <thead className="bg-blue-100 text-blue-900 font-semibold">
              <tr>
                <th className="p-3 border border-gray-300">Employee</th>
                <th className="p-3 border border-gray-300">Project</th>
                <th className="p-3 border border-gray-300">Sub Product</th>
                <th className="p-3 border border-gray-300">Assigned Date</th>
                <th className="p-3 border border-gray-300">Deadline</th>
                <th className="p-3 border border-gray-300">Estimated Time</th>
                <th className="p-3 border border-gray-300">Task</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assign) => (
                <tr key={assign.id} className="text-center hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{assign.employee_name}</td>
                  <td className="p-3 border border-gray-300">{assign.project_name}</td>
                  <td className="p-3 border border-gray-300">{assign.sub_products}</td>
                  <td className="p-3 border border-gray-300">
                    {formatDateTime(assign.assigned_date)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {formatDateTime(assign.deadline_date)}
                  </td>
                  <td className="p-3 border border-gray-300">
                  {assign.estimated_time}
                  </td>
                  {/* Updated styles for Task and Description columns */}
                  <td className="p-3 border border-gray-300 text-center" style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    textAlign: 'center'
                  }}>
                       {assign.task_details ? assign.task_details : "No Task Details"}
                  </td>
                  <td className="p-3 border border-gray-300 text-center" style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    textAlign: 'center'
                  }}>
                    {assign.task_description ? assign.task_description : "No Description Available"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {isAdmin ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(assign.id)}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assign.id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleEdit(assign.id)}
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-black mt-10">
          No assignments found.
        </div>
      )}
    </div>
  );
};

export default ProjectAssignList;



