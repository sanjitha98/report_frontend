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
//   const [selectedUserType, setSelectedUserType] = useState("");

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
//   const [allAssignments, setAllAssignments] = useState([]);
//   const fetchAssignments = async () => {
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const payload = {
//         employee_id: isAdmin ? selectedEmployee : employeeId,
//         from_date: fromDate || today,
//         to_date: toDate || today,
//       };

//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get_assigned_project`,
//         payload
//       );
//       const data = res.data.data || [];
//       setAllAssignments(data);
//       setAssignments(filterByUserType(data, selectedUserType)); // <-- initial filter
//     } catch (err) {
//       console.error("Failed to fetch assignments", err);
//     }
//   };

//   const filterByUserType = (data, type) => {
//     if (!type) return data;
//     return data.filter((item) => item.created_by === type);
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
//       <h2 className="text-4xl font-bold text-center text-black mb-6">
//         {isAdmin ? "Project Assignment List" : "Daily Task List"}
//       </h2>

//       {/* <div className="flex justify-end mb-6">
//         <button
//           onClick={() => navigate("/dashboard/project-assign")}
//           className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
//         >
//           Assign Project
//         </button>
//       </div> */}

//       <div className="flex justify-end mb-6">
//         <button
//           onClick={() => navigate("/dashboard/project-assign")}
//           className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
//         >
//           {isAdmin ? "Assign Project" : "Assign Task"}
//         </button>
//       </div>

//       {successMessage && (
//         <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
//           {successMessage}
//         </div>
//       )}

//       {/* Filter Section */}
//       <div className="flex flex-wrap items-end gap-4 mb-6">
//         {isAdmin && (
//           <div className="flex flex-col">
//             <label className="mb-1 font-medium text-gray-700">Employee</label>
//             <select
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="p-2 border border-gray-300 rounded-lg"
//             >
//               <option value="">Select Employee</option>
//               {employees.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">User Type</label>
//           <select
//             value={selectedUserType}
//             onChange={(e) => {
//               const type = e.target.value;
//               setSelectedUserType(type);
//               setAssignments(filterByUserType(allAssignments, type));
//             }}
//             className="p-2 border border-gray-300 rounded-lg"
//           >
//             <option value="">Select User Type</option>
//             <option value="Admin">Admin</option>
//             <option value="Sr Technicals Lead">Sr Technicals Lead</option>
//             <option value="employee">Employee</option>
//           </select>
//         </div>

//         <div>
//           <button
//             onClick={fetchAssignments}
//             className="bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-all"
//           >
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       {assignments.length > 0 ? (
//         <div className="overflow-x-auto mt-6">
//           <table className="min-w-full border border-gray-300 table-auto shadow-lg rounded-xl text-sm">
//             <thead className="bg-blue-100 text-blue-900 font-semibold">
//               <tr>
//                 {isAdmin && (
//                   <th className="p-3 border border-gray-300">Employee</th>
//                 )}
//                 <th className="p-3 border border-gray-300">Project</th>
//                 <th className="p-3 border border-gray-300">Sub Product</th>
//                 <th className="p-3 border border-gray-300">Assigned Date</th>
//                 <th className="p-3 border border-gray-300">Deadline</th>
//                 <th className="p-3 border border-gray-300 whitespace-nowrap">
//                   Estimated Time
//                 </th>
//                 <th className="p-3 border border-gray-300">Task</th>
//                 <th className="p-3 border border-gray-300">Description</th>
//                 <th className="p-3 border border-gray-300 whitespace-nowrap">
//                   Created By
//                 </th>
//                 <th className="p-3 border border-gray-300">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assignments.map((assign) => (
//                 <tr key={assign.id} className="text-center hover:bg-gray-100">
//                   {isAdmin && (
//                     <td className="p-3 border border-gray-300">
//                       {assign.employee_name}
//                     </td>
//                   )}
//                   <td className="p-3 border border-gray-300">
//                     {assign.project_name}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {assign.sub_products}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {formatDateTime(assign.assigned_date)}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {formatDateTime(assign.deadline_date)}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {assign.estimated_time}
//                   </td>
//                   {/* Updated styles for Task and Description columns */}
//                   <td
//                     className="p-3 border border-gray-300 text-center"
//                     style={{
//                       whiteSpace: "normal",
//                       wordWrap: "break-word",
//                       textAlign: "center",
//                     }}
//                   >
//                     {assign.task_details
//                       ? assign.task_details
//                       : "No Task Details"}
//                   </td>
//                   <td
//                     className="p-3 border border-gray-300 text-center"
//                     style={{
//                       whiteSpace: "normal",
//                       wordWrap: "break-word",
//                       textAlign: "center",
//                     }}
//                   >
//                     {assign.task_description
//                       ? assign.task_description
//                       : "No Description Available"}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {assign.created_by}
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     {isAdmin ? (
//                       <div className="flex justify-center gap-3">
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
//                       <div className="flex justify-center gap-3">
//                         <button
//                           onClick={() => handleEdit(assign.id)}
//                           className="text-blue-600 font-semibold hover:underline"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleDelete(assign.id)}
//                           className="text-red-600 font-semibold hover:underline"
//                         >
//                           Delete
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
import moment from "moment";

const ProjectAssignList = () => {
  const navigate = useNavigate();
  const { isAuth, userData } = useSelector((state) => state.login);
  const employeeId = userData ? userData.employeeId : null;
  const userType = userData ? userData.userType : null;
  const isAdmin = userType === "Admin";

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [isAllowedTime, setIsAllowedTime] = useState(false);
  const [allAssignments, setAllAssignments] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAssignments();
    if (!isAdmin) {
      checkPunchTimeWindow();
      const timer = setInterval(checkPunchTimeWindow, 60 * 1000); // Check every 1 minute
      return () => clearInterval(timer);
    }
  }, []);

  const checkPunchTimeWindow = async () => {
    const todayDate = moment().format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/dailypunch`,
        { date: todayDate }
      );
      const punchData = response.data.data;

       const userPunch = punchData.find(
      (entry) => entry.employeeId === employeeId && entry.logType === "In"
    );

      if (userPunch && userPunch.logTime) {
      const punchTime = moment(userPunch.logTime);
      const punchMinutes = punchTime.hours() * 60 + punchTime.minutes();

      const now = moment();
      const nowMinutes = now.hours() * 60 + now.minutes();

        if (punchMinutes > 9 * 60 + 30) {
        const validFrom = punchMinutes;
        const validTo = punchMinutes + 15;
        setIsAllowedTime(nowMinutes >= validFrom && nowMinutes <= validTo);
      } else {
        setIsAllowedTime(true); // Before or at 9:30 AM is allowed anytime
      }
    } else {
      setIsAllowedTime(false);
    }
  } catch (err) {
    console.error("Failed to fetch punch data", err);
  }
};

  // const fetchEmployees = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/employee_list`
  //     );
  //     setEmployees(res.data.data || []);
  //   } catch (err) {
  //     console.error("Failed to fetch employee list", err);
  //   }
  // };
  const fetchEmployees = async () => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/employee_list`
    );

    let employeeData = res.data.data || [];

    // Read logged-in user info from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // e.g., { employeeId: "kst77", isAdmin: false }

    if (loggedInUser && !loggedInUser.isAdmin) {
      employeeData = employeeData.filter(
        (emp) => emp.employeeId === loggedInUser.employeeId
      );
    }

    setEmployees(employeeData);
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
      const data = res.data.data || [];
      setAllAssignments(data);
      setAssignments(filterByUserType(data, selectedUserType));
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  const filterByUserType = (data, type) => {
    if (!type) return data;
    return data.filter((item) => item.created_by === type);
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

      <div className="flex justify-end mb-6">
        <button
          onClick={() =>
            isAdmin
              ? navigate("/dashboard/project-assign")
              : navigate("/dashboard/task-assign")
          }
          disabled={!isAllowedTime && !isAdmin}
          className={`px-6 py-3 rounded-xl transition-all ${
            isAdmin
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : isAllowedTime
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {isAdmin ? "Assign Project" : "Assign Task"}
        </button>
      </div>

      {!isAdmin && !isAllowedTime && (
        <p className="text-red-600 text-sm text-right">
          Task assignment allowed only for 15 minutes after your punch-in if you punched in after 9:30 AM.
        </p>
      )}

      {successMessage && (
        <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
          {successMessage}
        </div>
      )}

      {/* Filter Section */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {isAdmin && (
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
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

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">User Type</label>
          <select
            value={selectedUserType}
            onChange={(e) => {
              const type = e.target.value;
              setSelectedUserType(type);
              setAssignments(filterByUserType(allAssignments, type));
            }}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select User Type</option>
            <option value="Admin">Admin</option>
            <option value="Sr Technicals Lead">Sr Technicals Lead</option>
            <option value="employee">Employee</option>
          </select>
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
                {isAdmin && (
                  <th className="p-3 border border-gray-300">Employee</th>
                )}
                <th className="p-3 border border-gray-300">Project</th>
                <th className="p-3 border border-gray-300">Sub Product</th>
                <th className="p-3 border border-gray-300">Assigned Date</th>
                <th className="p-3 border border-gray-300">Deadline</th>
                <th className="p-3 border border-gray-300">Estimated Time</th>
                <th className="p-3 border border-gray-300">Task</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300">Created By</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assign) => (
                <tr key={assign.id} className="text-center hover:bg-gray-100">
                  {isAdmin && (
                    <td className="p-3 border border-gray-300">
                      {assign.employee_name}
                    </td>
                  )}
                  <td className="p-3 border border-gray-300">
                    {assign.project_name}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.sub_products}
                  </td>
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
                   <td
                     className="p-3 border border-gray-300 text-center"
                     style={{
                       whiteSpace: "normal",
                       wordWrap: "break-word",
                       textAlign: "center",
                     }}
                   >
                     {assign.task_details
                       ? assign.task_details
                       : "No Task Details"}
                   </td>
                   <td
                     className="p-3 border border-gray-300 text-center"
                     style={{
                       whiteSpace: "normal",
                       wordWrap: "break-word",
                       textAlign: "center",
                     }}
                   >
                     {assign.task_description
                       ? assign.task_description
                       : "No Description Available"}
                   </td>
                  <td className="p-3 border border-gray-300">
                    {assign.created_by}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      onClick={() => handleEdit(assign.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-xl mr-2 hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assign.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-xl hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-600 mt-6">
          No assignments found.
        </p>
      )}
    </div>
  );
};

export default ProjectAssignList;


