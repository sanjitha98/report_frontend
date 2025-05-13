// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { userType, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployeeId || employeeId,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);
//         const evaluations = {};
//         const reviews = {};
//         data.forEach((item) => {
//           evaluations[item.id] = item.evaluation;
//           reviews[item.id] = item.review;
//         });
//         setEvaluationInputs(evaluations);
//         setReviewInputs(reviews);
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//         if (response.data.status === 'Success') {
//           setEmployeeList(response.data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching employee list:', err);
//       }
//     };
//     fetchEmployeeList();
//   }, []);

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployeeId]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const handleEditClick = (report) => {
//     localStorage.setItem("selectedReport", JSON.stringify(report.id));
//     navigate("/dashboard/employeeTaskEdit");
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this Daily Task?");
//     if (confirmDelete) {
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`);
//         if (response.data.status === "Success") {
//           alert("Record deleted successfully");
//           fetchReportData(); // Refresh report data after deletion
//         } else {
//           alert("Failed to delete record");
//         }
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         alert("An error occurred while deleting the record");
//       }
//     }
//   };

//   const saveEvaluationAndReview = async (id, review, evaluation) => {
//     try {
//       const payload = { id, review, evaluation };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, payload);
//       return response.data;
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       return { status: "Fail" };
//     }
//   };

//   const handleEvaluationChange = (id, e) => {
//     const newValue = e.target.value;
//     setEvaluationInputs((prev) => ({
//       ...prev,
//       [id]: newValue
//     }));
//   };

//   const handleReviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setReviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue
//     }));
//   };

//   const handleSave = async (id) => {
//     const evaluation = evaluationInputs[id];
//     const review = reviewInputs[id];

//     const response = await saveEvaluationAndReview(id, review, evaluation);
//     if (response.status === "Success") {
//       alert("Evaluation and Review saved successfully");
//     } else {
//       alert("Failed to save Evaluation and Review");
//     }

//     fetchReportData();
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   // const handleEmployeeChange = (e) => {
//   //   setSelectedEmployee(e.target.value);
//   //   setPage(1);
//   // };

//   const filteredData = selectedEmployeeId
//     ? reportData.filter(item => item.employeeId === selectedEmployeeId)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//         <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Daily Task</h5>
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//             <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">Start Date:</label>
//             <input
//                 type="date"
//                 name="fromDate"
//                 value={fromDate}
//                 onChange={handleDateChange}
//                 max={today}
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                 style={{ width: "200px" }}
//             />
//             <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">End Date:</label>
//             <input
//                 type="date"
//                 name="toDate"
//                 value={toDate}
//                 onChange={handleDateChange}
//                 max={today}
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                 style={{ width: "200px" }}
//             />
//             {userType === "Admin" && (
//                  <div className="flex items-center">
//                     <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//                     <select
//                         id="employee"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//                         style={{ width: "240px" }}
//                         value={selectedEmployeeId}
//                         onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         {employeeList.map((emp) => (
//                             <option key={emp.employeeId} value={emp.employeeId}>
//                                 {emp.employeeName}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             )}
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Time</th>
//                   {userType === "Admin" && (
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
//                   <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
//                   <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
//                   <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
//                   {(userType !== "Admin" && designation !== "Sr. Technical Head") && (
//                     <>
//                       <th className="border px-4 py-2">Edit</th>
//                       <th className="border px-4 py-2">Delete</th>
//                     </>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const reportTime = moment(item.createdAt).format("HH:mm A"); // Format the time from createdAt
//                   const employeeName = item.employeeName || "N/A";
//                   const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");
//                   const isEditable = userType !== "Admin";

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{reportTime}</td> {/* Display formatted time */}
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">{employeeName}</td>
//                       )}
//                       <td className="border px-4 py-4">{item.customer}</td>
//                       <td className="border px-4 py-4">{item.task}</td>
//                       <td className="border px-4 py-4">{item.estimatedTime}</td>
//                       <td className="border px-4 py-4">{item.startTime}</td>
//                       <td className="border px-4 py-4">{item.endTime}</td>
//                       <td className="border px-4 py-4">{item.taskStatus}</td>
//                       <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
//                       <td className="border px-4 py-4">{item.remarks}</td>
//                       <td className="border px-4 py-4">
//                         {userType === "Admin" ? (
//                           <input
//                             type="text"
//                             value={evaluationInputs[item.id] || ""}
//                             onChange={(e) => handleEvaluationChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.evaluation}</span>
//                         )}
//                       </td>
//                       <td className="border px-4 py-4">
//                         {userType === "Admin" ? (
//                             <span>{item.review}</span>
//                           ) : (
//                             <span>{item.review}</span>
//                         )}

//                       </td>
//                       {isEditable && (
//                         <td className="border px-4 py-4">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="text-blue-600 hover:underline"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                       )}
//                       {isEditable && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleDelete(item.id)}>
//                             <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:underline" />
//                           </button>
//                         </td>
//                       )}
//                        {userType === "Admin" && (
//                          <td className="border px-4 py-4">
//                             <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                               Save
//                             </button>
//                           </td>
//                         )}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">No reports available.</div>
//       )}

//       {/* Pagination controls */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//           disabled={page === 1}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             handlePageChange(page < totalPages ? page + 1 : totalPages)
//           }
//           disabled={page === totalPages}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeReportList;

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const { userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const [team_leader_reviewInputs, setteam_leader_reviewInputs] = useState({});
  const [admin_reviewInputs, setadmin_reviewInputs] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const fetchReportData = async () => {
    try {
      const payload = {
        page: page.toString(),
        limit: maxDisplayCount,
        fromDate,
        toDate,
        employeeId: selectedEmployeeId || employeeId,
      };

      const apiEndpoint = `${process.env.REACT_APP_API_URL}/get_assigned_project`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data, totalRecords } = response.data;

      if (status === "Success") {
        setTotalRecords(totalRecords);
        setReportData(data);
        const admin_review = {};
        const team_leader_review = {};
        data.forEach((item) => {
          admin_review[item.id] = item.admin_review;
          team_leader_review[item.id] = item.team_leader_review;
        });
        setadmin_reviewInputs(admin_review);
        setteam_leader_reviewInputs(team_leader_review);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setReportData([]);
    }
  };

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee_list/`
        );
        if (response.data.status === "Success") {
          setEmployeeList(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [
    fromDate,
    toDate,
    page,
    maxDisplayCount,
    employeeId,
    userType,
    selectedEmployeeId,
  ]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMaxDisplayCountChange = (e) => {
    setMaxDisplayCount(e.target.value);
    setPage(1);
  };

  const handleEditClick = (report) => {
    localStorage.setItem("selectedReport", JSON.stringify(report.id));
    navigate("/dashboard/employeeTaskEdit");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Daily Task?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/delete_project_assign`,
          {
            id: id,
          }
        );

        if (response.data.status === "Success") {
          alert("Record deleted successfully");
          fetchReportData(); // Refresh report data after deletion
        } else {
          alert("Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("An error occurred while deleting the record");
      }
    }
  };

  const saveadmin_reviewandteam_leader_review = async (payload) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_assign`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error saving task:", error);
      return { status: "Fail" };
    }
  };

  const handleadmin_reviewChange = (id, e) => {
    const newValue = e.target.value;
    setadmin_reviewInputs((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleteam_leader_reviewChange = (id, e) => {
    const newValue = e.target.value;
    setteam_leader_reviewInputs((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleSave = async (id) => {
    console.log("id", id);
    console.log("reportData", reportData);
    const payload = reportData.find((data) => data.id === id);
    console.log("payload", payload);

    payload.admin_review = admin_reviewInputs[id];
    payload.team_leader_review = team_leader_reviewInputs[id];

    const response = await saveadmin_reviewandteam_leader_review(payload);
    if (response.status === "Success") {
      alert("admin_review and team_leader_review saved successfully");
    } else {
      alert("Failed to save admin_review and team_leader_review");
    }

    fetchReportData();
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  const filteredData = selectedEmployeeId
    ? reportData.filter((item) => item.employeeId === selectedEmployeeId)
    : reportData;

  return (
    <div className="container mx-auto">
      <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">
        Daily Task
      </h5>
      <div className="my-4 flex flex-col sm:flex-row items-center">
        <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">
          Start Date:
        </label>
        <input
          type="date"
          name="fromDate"
          value={fromDate}
          onChange={handleDateChange}
          max={today}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          style={{ width: "200px" }}
        />
        <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">
          End Date:
        </label>
        <input
          type="date"
          name="toDate"
          value={toDate}
          onChange={handleDateChange}
          max={today}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
          style={{ width: "200px" }}
        />
        {userType === "Admin" && (
          <div className="flex items-center">
            <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
              Select Employee:
            </label>
            <select
              id="employee"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              style={{ width: "240px" }}
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">All</option>
              {employeeList.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto border border-gray-300">
          <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
            <table
              className="w-full text-sm text-left rtl:text-right text-gray-500"
              style={{ minWidth: "2000px" }}
            >
              <thead className="bg-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>
                    Date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>
                    Time
                  </th>
                  {userType === "Admin" && (
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Employee Name
                    </th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>
                    project_name
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    sub_products
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    task_details
                  </th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>
                    task_description
                  </th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>
                    Estimated Time
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    assigned_date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>
                    deadline_date
                  </th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>
                    task_status
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    remarks
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    created_by
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Admin Review
                  </th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>
                    Team Leader Review
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.time}</td>
                    {userType === "Admin" && (
                      <td className="border px-4 py-2">{item.employee_name}</td>
                    )}
                    <td className="border px-4 py-2">{item.project_name}</td>
                    <td className="border px-4 py-2">{item.sub_products}</td>
                    <td className="border px-4 py-2">{item.task_details}</td>
                    <td className="border px-4 py-2">
                      {item.task_description}
                    </td>
                    <td className="border px-4 py-2">{item.estimated_time}</td>
                    <td className="border px-4 py-2">{item.assigned_date}</td>
                    <td className="border px-4 py-2">{item.deadline_date}</td>
                    <td className="border px-4 py-2">{item.task_status}</td>
                    <td className="border px-4 py-2">{item.remarks}</td>
                    <td className="border px-4 py-2">{item.created_by}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={admin_reviewInputs[item.id] || ""}
                        onChange={(e) => handleadmin_reviewChange(item.id, e)}
                        placeholder="Enter Admin Review"
                        className="w-full p-2 border rounded-md"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={team_leader_reviewInputs[item.id] || ""}
                        onChange={(e) =>
                          handleteam_leader_reviewChange(item.id, e)
                        }
                        placeholder="Enter Team Leader Review"
                        className="w-full p-2 border rounded-md"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleSave(item.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>{`Page ${page} of ${totalPages}`}</span>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No records found</p>
      )}
    </div>
  );
};

export default EmployeeReportList;
