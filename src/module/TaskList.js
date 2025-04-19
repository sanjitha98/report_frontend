// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//         // Initialize evaluation and review state with fetched data
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
//     if (userType === "Admin") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       };
//       fetchEmployeeData();
//     }

//     // Fetch report data when dependencies change
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const saveEvaluationAndReview = async (id, review, evaluation) => {
//     try {
//       const payload = {
//         id: id,
//         review: review,
//         evaluation: evaluation
//       };

//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         payload
//       );

//       return response.data; // Return the response
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       return { status: "Fail" }; // Return fail status
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

//   // Handle Save function
//   const handleSave = async (id) => {
//     const evaluation = evaluationInputs[id];
//     const review = reviewInputs[id];

//     try {
//       const response = await saveEvaluationAndReview(id, review, evaluation);
      
//       if (response.status === "Success") {
//         alert("Evaluation and Review saved successfully"); // Success feedback
//       } else {
//         alert("Failed to save Evaluation and Review");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("An error occurred while saving. Please try again.");
//     }

//     // Refresh report data
//     fetchReportData();
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
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
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Evaluation</th>
//                   <th className="border px-4 py-2" style={{ width: "750px" }}>Review</th>
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Edit</th>
//                   )}
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Delete</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";
//                   const isEditable = moment(item.date).isSameOrBefore(moment(), "day");

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       {(userType === "Admin") && (
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
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.review}</span>
//                         )}
//                       </td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
//                       {userType !== "Admin" && isEditable && (
//                         <td className="px-4 py-3">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="text-blue-600 hover:underline"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                       )}
//                       {userType !== "Admin" && isEditable && (
//                         <td className="px-4 py-3">
//                           <button onClick={() => handleDelete(item.id)}>
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </td>
//                       )}
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




// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//         // Initialize evaluation and review state with fetched data
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
//     if (userType === "Admin") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       };
//       fetchEmployeeData();
//     }

//     // Fetch report data when dependencies change
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const saveEvaluationAndReview = async (id, review, evaluation) => {
//     try {
//       const payload = {
//         id: id,
//         review: review,
//         evaluation: evaluation
//       };

//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         payload
//       );

//       return response.data; // Return the response
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       return { status: "Fail" }; // Return fail status
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

//   // Handle Save function
//   const handleSave = async (id) => {
//     const evaluation = evaluationInputs[id];
//     const review = reviewInputs[id];

//     try {
//       const response = await saveEvaluationAndReview(id, review, evaluation);
      
//       if (response.status === "Success") {
//         alert("Evaluation and Review saved successfully"); // Success feedback
//       } else {
//         alert("Failed to save Evaluation and Review");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("An error occurred while saving. Please try again.");
//     }

//     // Refresh report data
//     fetchReportData();
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="overflow-x-auto border border-gray-300">
//           <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//               <thead className="bg-slate-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="border px-4 py-2">S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
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
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Edit</th>
//                   )}
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Delete</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";
//                   const isEditable = moment(item.date).isSameOrBefore(moment(), "day");

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       {(userType === "Admin") && (
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
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.review}</span>
//                         )}
//                       </td>
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
//                       {userType !== "Admin" && designation === "Sr. Technical Head" && isEditable && (
//                         <>
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => handleEditClick(item)}
//                               className="text-blue-600 hover:underline"
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                           <td className="px-4 py-3">
//                             <button onClick={() => handleDelete(item.id)}>
//                               <FontAwesomeIcon icon={faTrash} />
//                             </button>
//                           </td>
//                         </>
//                       )}
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




// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//         // Initialize evaluation and review state with fetched data
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
//     if (userType === "Admin") {
//       const fetchEmployeeData = async () => {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       };
//       fetchEmployeeData();
//     }

//     // Fetch report data when dependencies change
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const saveEvaluationAndReview = async (id, review, evaluation) => {
//     try {
//       const payload = {
//         id: id,
//         review: review,
//         evaluation: evaluation
//       };

//       const response = await axios.post(
//         "http://192.168.2.133:4001/api/createtask",
//         payload
//       );

//       return response.data; // Return the response
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       return { status: "Fail" }; // Return fail status
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

//   // Handle Save function
//   const handleSave = async (id) => {
//     const evaluation = evaluationInputs[id];
//     const review = reviewInputs[id];

//     try {
//       const response = await saveEvaluationAndReview(id, review, evaluation);
      
//       if (response.status === "Success") {
//         alert("Evaluation and Review saved successfully"); // Success feedback
//       } else {
//         alert("Failed to save Evaluation and Review");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("An error occurred while saving. Please try again.");
//     }

//     // Refresh report data
//     fetchReportData();
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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
//                   {(userType !== "Admin" && designation === "Sr. Technical Head") && (
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
//                   const employeeName = item.employeeName || "N/A";
//                   const isEditable = moment(item.date).isSameOrBefore(moment(), "day");

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
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
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.review}</span>
//                         )}
//                       </td>
//                       {(userType !== "Admin" && designation === "Sr. Technical Head" && isEditable) && (
//                         <>
//                           <td className="border px-4 py-4">
//                             <button
//                               onClick={() => handleEditClick(item)}
//                               className="text-blue-600 hover:underline"
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                           <td className="border px-4 py-4">
//                             <button onClick={() => handleDelete(item.id)}>
//                               <FontAwesomeIcon icon={faTrash} />
//                             </button>
//                           </td>
//                         </>
//                       )}
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
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




// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//     const fetchEmployeeData = async () => {
//       if (userType === "Admin") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };
//     fetchEmployeeData();
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
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

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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
//                   {(userType !== "Admin" && designation === "Sr. Technical Head") && (
//                     <>
//                       <th className="border px-4 py-2">Edit</th>
//                       <th className="border px-4 py-2">Delete</th>
//                     </>
//                   )}
//                   {userType === "employee" && (
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
//                   const employeeName = item.employeeName || "N/A";
//                   const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
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
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.review}</span>
//                         )}
//                       </td>
//                       {(userType === "employee" && isToday) && (
//                         <>
//                           <td className="border px-4 py-4">
//                             <button
//                               onClick={() => handleEditClick(item)}
//                               className="text-blue-600 hover:underline"
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                           <td className="border px-4 py-4">
//                             <button onClick={() => handleDelete(item.id)}>
//                               <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:underline" />
//                             </button>
//                           </td>
//                         </>
//                       )}
//                       {(userType !== "Admin" && designation === "Sr. Technical Head") && (
//                         <>
//                           <td className="border px-4 py-4">
//                             <button
//                               onClick={() => handleEditClick(item)}
//                               className="text-blue-600 hover:underline"
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                           <td className="border px-4 py-4">
//                             <button onClick={() => handleDelete(item.id)}>
//                               <FontAwesomeIcon icon={faTrash} />
//                             </button>
//                           </td>
//                         </>
//                       )}
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
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



// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//     const fetchEmployeeData = async () => {
//       if (userType === "Admin") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };
//     fetchEmployeeData();
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
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
//       [id]: newValue,
//     }));
//   };

//   const handleReviewChange = (id, e) => {
//     const newValue = e.target.value;
//     setReviewInputs((prev) => ({
//       ...prev,
//       [id]: newValue,
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

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter((item) => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Edit</th>
//                   )}
//                   {(userType !== "Admin") && (
//                     <th className="border px-4 py-2">Delete</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";
//                   const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");
//                   const isEditable = isToday && userType === "employee";

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
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
//                         {designation === "Sr. Technical Head" ? (
//                           <span>{item.review}</span>
//                         ) : (
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         )}
//                       </td>
//                       {userType !== "Admin" && isEditable && (
//                         <td className="px-4 py-3">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="text-blue-600 hover:underline"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </button>
//                         </td>
//                       )}
//                       {userType !== "Admin" && isEditable && (
//                         <td className="px-4 py-3">
//                           <button onClick={() => handleDelete(item.id)}>
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </td>
//                       )}
//                       {isEditable && (
//                         <>
//                           <td className="border px-4 py-4">
//                             <button
//                               onClick={() => handleEditClick(item)}
//                               className="text-blue-600 hover:underline"
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                           <td className="border px-4 py-4">
//                             <button onClick={() => handleDelete(item.id)}>
//                               <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:underline" />
//                             </button>
//                           </td>
//                         </>
//                       )}
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
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




// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//     const fetchEmployeeData = async () => {
//       if (userType === "Admin") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };
//     fetchEmployeeData();
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item, index) => {
//                   const reportDate = moment(item.date).format("DD-MM-YYYY");
//                   const employeeName = item.employeeName || "N/A";
//                   const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");
//                   const isEditable = userType !== "Admin"; // Change based on edit restriction

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
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
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={reviewInputs[item.id] || ""}
//                             onChange={(e) => handleReviewChange(item.id, e)}
//                             className="p-2 border border-gray-300"
//                           />
//                         ) : (
//                           <span>{item.review}</span>
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
//                       {userType === "Admin" && (
//                         <td className="border px-4 py-4">
//                           <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
//                             Save
//                           </button>
//                         </td>
//                       )}
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





// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//     const fetchEmployeeData = async () => {
//       if (userType === "Admin") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };
//     fetchEmployeeData();
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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
//                   const employeeName = item.employeeName || "N/A";
//                   const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");
//                   const isEditable = userType !== "Admin";

//                   return (
//                     <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
//                       <td className="border px-4 py-4">
//                         {index + 1 + (page - 1) * maxDisplayCount}
//                       </td>
//                       <td className="border px-4 py-4">{reportDate}</td>
//                       <td className="border px-4 py-4">{moment(item.date).format("HH:mm")}</td>
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













// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const navigate = useNavigate();
//   const employeeId = localStorage.getItem("employeeId");
//   const [evaluationInputs, setEvaluationInputs] = useState({});
//   const [reviewInputs, setReviewInputs] = useState({});

//   // Fetch report data function
//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//         employeeId: selectedEmployee || employeeId,
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
//     const fetchEmployeeData = async () => {
//       if (userType === "Admin") {
//         try {
//           const response = await axios.get(
//             `${process.env.REACT_APP_API_URL}/api/employees`
//           );
//           if (response.data.status === "Success") {
//             setEmployees(response.data.data);
//           } else {
//             setEmployees([]);
//           }
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//         }
//       }
//     };
//     fetchEmployeeData();
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployee]);

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

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const filteredData = selectedEmployee
//     ? reportData.filter(item => item.employeeName === selectedEmployee)
//     : reportData;

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//             <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//               >
//                 <option value="">All Employees</option>
//                 {Array.from(new Set(reportData.map((employee) => employee.employeeName))).map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
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












// import React, { useEffect, useState } from "react";
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
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
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

//   const styles = {
//         column: {
//             marginBottom: '1rem',
//             // Add other styling as needed
//         },
//         label: {
//             display: 'block',
//             marginBottom: '0.5rem',
//             fontWeight: 'bold',
//             // Add other styling as needed
//         },
//         input: {
//             width: '100%',
//             padding: '0.5rem',
//             borderRadius: '0.25rem',
//             border: '1px solid #ccc',
//             // Add other styling as needed
//         },
//     };

//   return (
//     <div className="container mx-auto">
//         <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Daily Task</h5>
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//                 <div style={styles.column}>
//                     <label style={styles.label}>Employee Name:</label>
//                     <select
//                         style={styles.input}
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
//         </div>
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












import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
  const { userType, designation } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");
  const [evaluationInputs, setEvaluationInputs] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // Fetch report data function
  const fetchReportData = async () => {
    try {
      const payload = {
        page: page.toString(),
        limit: maxDisplayCount,
        fromDate,
        toDate,
        employeeId: selectedEmployeeId || employeeId,
      };

      const apiEndpoint =
        userType === "Admin"
          ? `${process.env.REACT_APP_API_URL}/api/reportHistory_admin`
          : `${process.env.REACT_APP_API_URL}/api/reportHistory/${employeeId}`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data, totalRecords } = response.data;

      if (status === "Success") {
        setTotalRecords(totalRecords);
        setReportData(data || []);
        const evaluations = {};
        const reviews = {};
        data.forEach((item) => {
          evaluations[item.id] = item.evaluation;
          reviews[item.id] = item.review;
        });
        setEvaluationInputs(evaluations);
        setReviewInputs(reviews);
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setReportData([]);
    }
  };

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
        if (response.data.status === 'Success') {
          setEmployeeList(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching employee list:', err);
      }
    };
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType, selectedEmployeeId]);

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
    const confirmDelete = window.confirm("Are you sure you want to delete this Daily Task?");
    if (confirmDelete) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/deleteTask/${id}`);
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

  const saveEvaluationAndReview = async (id, review, evaluation) => {
    try {
      const payload = { id, review, evaluation };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, payload);
      return response.data;
    } catch (error) {
      console.error("Error saving evaluation and review:", error);
      return { status: "Fail" };
    }
  };

  const handleEvaluationChange = (id, e) => {
    const newValue = e.target.value;
    setEvaluationInputs((prev) => ({
      ...prev,
      [id]: newValue
    }));
  };

  const handleReviewChange = (id, e) => {
    const newValue = e.target.value;
    setReviewInputs((prev) => ({
      ...prev,
      [id]: newValue
    }));
  };

  const handleSave = async (id) => {
    const evaluation = evaluationInputs[id];
    const review = reviewInputs[id];

    const response = await saveEvaluationAndReview(id, review, evaluation);
    if (response.status === "Success") {
      alert("Evaluation and Review saved successfully");
    } else {
      alert("Failed to save Evaluation and Review");
    }

    fetchReportData();
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  // const handleEmployeeChange = (e) => {
  //   setSelectedEmployee(e.target.value);
  //   setPage(1);
  // };

  const filteredData = selectedEmployeeId
    ? reportData.filter(item => item.employeeId === selectedEmployeeId)
    : reportData;

  return (
    <div className="container mx-auto">
        <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Daily Task</h5>
      <div className="my-4 flex flex-col sm:flex-row items-center">
            <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">Start Date:</label>
            <input
                type="date"
                name="fromDate"
                value={fromDate}
                onChange={handleDateChange}
                max={today}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
                style={{ width: "200px" }}
            />
            <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">End Date:</label>
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
                    <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
              <thead className="bg-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="border px-4 py-2">S/No</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>Date</th>
                  <th className="border px-4 py-2" style={{ width: "350px" }}>Time</th>
                  {userType === "Admin" && (
                    <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
                  )}
                  <th className="border px-4 py-2" style={{ width: "150px" }}>Customer</th>
                  <th className="border px-4 py-2" style={{ width: "1050px" }}>Task</th>
                  <th className="border px-4 py-2" style={{ width: "120px" }}>Estimated Time</th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>Start Time</th>
                  <th className="border px-4 py-2" style={{ width: "200px" }}>End Time</th>
                  <th className="border px-4 py-2" style={{ width: "100px" }}>Status</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Reason for Incomplete</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Remarks</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Admin Review</th>
                  <th className="border px-4 py-2" style={{ width: "750px" }}>Team Leader Review</th>
                  {(userType !== "Admin" && designation !== "Sr. Technical Head") && (
                    <>
                      <th className="border px-4 py-2">Edit</th>
                      <th className="border px-4 py-2">Delete</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const reportDate = moment(item.date).format("DD-MM-YYYY");
                  const reportTime = moment(item.createdAt).format("HH:mm A"); // Format the time from createdAt
                  const employeeName = item.employeeName || "N/A";
                  const isToday = moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day");
                  const isEditable = userType !== "Admin";

                  return (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="border px-4 py-4">
                        {index + 1 + (page - 1) * maxDisplayCount}
                      </td>
                      <td className="border px-4 py-4">{reportDate}</td>
                      <td className="border px-4 py-4">{reportTime}</td> {/* Display formatted time */}
                      {userType === "Admin" && (
                        <td className="border px-4 py-4">{employeeName}</td>
                      )}
                      <td className="border px-4 py-4">{item.customer}</td>
                      <td className="border px-4 py-4">{item.task}</td>
                      <td className="border px-4 py-4">{item.estimatedTime}</td>
                      <td className="border px-4 py-4">{item.startTime}</td>
                      <td className="border px-4 py-4">{item.endTime}</td>
                      <td className="border px-4 py-4">{item.taskStatus}</td>
                      <td className="border px-4 py-4">{item.reasonForIncomplete}</td>
                      <td className="border px-4 py-4">{item.remarks}</td>
                      <td className="border px-4 py-4">
                        {userType === "Admin" ? (
                          <input
                            type="text"
                            value={evaluationInputs[item.id] || ""}
                            onChange={(e) => handleEvaluationChange(item.id, e)}
                            className="p-2 border border-gray-300"
                          />
                        ) : (
                          <span>{item.evaluation}</span>
                        )}
                      </td>
                      <td className="border px-4 py-4">
                        {userType === "Admin" ? (
                            <span>{item.review}</span>
                          ) : (
                            <span>{item.review}</span>
                        )}

                      </td>
                      {isEditable && (
                        <td className="border px-4 py-4">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      )}
                      {isEditable && (
                        <td className="border px-4 py-4">
                          <button onClick={() => handleDelete(item.id)}>
                            <FontAwesomeIcon icon={faTrash} className="text-red-600 hover:underline" />
                          </button>
                        </td>
                      )}
                       {userType === "Admin" && (
                         <td className="border px-4 py-4">
                            <button onClick={() => handleSave(item.id)} className="text-blue-500 hover:underline">
                              Save
                            </button>
                          </td>
                        )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">No reports available.</div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(page < totalPages ? page + 1 : totalPages)
          }
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeReportList;