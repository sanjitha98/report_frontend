// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]); // State to store unique employee names
//   const [selectedEmployee, setSelectedEmployee] = useState("All"); // Set default to "All"

//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           domain: "Development",
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//         };

//         const apiEndpoint =
//         userType === "Admin"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);
//         } else {
//           setReportData([]);
//         }

//         if(userType === "Admin" ){
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]); // Add "All" option at the beginning
//           }
//         }

//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };
//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };
//   return (
//     <div className="container mx-auto">
//     <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//       <div className="flex flex-col sm:flex-row">
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//          {userType === "Admin" && (
//   <div className="flex items-center">
//     <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//       Select Employee:
//     </label>
//     <select
//       id="employee"
//       value={selectedEmployee}
//       onChange={handleEmployeeChange}
//       className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//     >
//       <option value="">Select Employee</option>
//       {employees.map((employeeName, index) => (
//         <option key={index} value={employeeName}>
//           {employeeName}
//         </option>
//       ))}
//     </select>
//   </div>
// )}

//         </div>
//       </div>

//       {/* Admin View Table */}
//       {userType === "Admin" || userType === "developerAdmin" ? (
//          <div className="my-5">
//           {reportData.length > 0 ? (
//            <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300 "
//               style={{ position: 'sticky', top: 0, zIndex: 1, height: '55px' }}
//               >
//               <tr>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//               </tr>
//             </thead>
//             <tbody>
//             {(() => {
//   // Calculate the starting serial number based on the current page and maxDisplayCount
//   let serialNo = (page - 1) * maxDisplayCount + 1;
//   return reportData.map((dateItem, dateIndex) => {
//     const reports = dateItem.reports || [];

//     return (
//       <React.Fragment key={dateIndex}>
//         {reports
//           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee) // Filter by selected employee
//           .map((reportItem) => {
//             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//             const employeeName = reportItem.name || "N/A";
//             const reportDetails = reportItem.reportDetails || [];

//             return reportDetails.map((detailItem, detailIndex) => {
//               const subcategories = detailItem.subCategory || [];

//             return (
//               <React.Fragment key={detailIndex}>
//                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                     {subCatIndex === 0 && detailIndex === 0 && (
//                       <>
//                         {/* Serial Number */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {serialNo++} {/* Increment serial number here */}
//                         </td>
//                         {/* Report Date */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {reportDate}
//                         </td>
//                         {/* Employee Name */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {employeeName}
//                         </td>
//                       </>
//                     )}
//                     {/* Project Name */}
//                     {subCatIndex === 0 && (
//                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                         {detailItem.projectName || "N/A"}
//                       </td>
//                     )}
//                     {/* Subcategory */}
//                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                     {/* Report */}
//                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                   </tr>
//                 ))}
//               </React.Fragment>
//             );
//           });
//         })}
//       </React.Fragment>
//     );
//   });
// })()}

//             </tbody>
//           </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             //<div className="overflow-auto max-h-80">
//               <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {/* <th className="border px-4 py-2" style={{ width: "50px" }}>Edit</th> */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter

//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting the date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                       <td className="px-4 py-3">
//                         <button onClick={() => handleEdit(dateItem.id)}>
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                       </td>
//                     )} */}
//                     {(userType === "employee" || userType === "Employee")  && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                     <td className="px-4 py-3">
//                     <button onClick={() => handleDelete(dateItem.id)}>
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </td>
//                     )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// // Define constants for magic numbers
// const TABLE_MAX_HEIGHT = 470;
// const PAGE_SIZE_OPTIONS = [10, 25, 50];

// const EmployeeReportList = () => {
//     const { employeeId, userType } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();

//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [editedReports, setEditedReports] = useState({});

//     // Define a function to fetch report data
//     const fetchReportData = async () => {
//         try {
//             const payload = {
//                 domain: "Development",
//                 page: page.toString(),
//                 limit: maxDisplayCount,
//                 fromDate,
//                 toDate,
//             };

//             const apiEndpoint =
//                 userType === "Admin"
//                     ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                     : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//             const response = await axios.post(apiEndpoint, payload);
//             const { status, data, totalRecords: total } = response.data;

//             if (status === "Success") {
//                 setTotalRecords(total);
//                 setReportData(data || []);

//                 if (userType === "Admin" && Array.isArray(data)) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((empReport) => empReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } else {
//                 setReportData([]);
//             }
//         } catch (error) {
//             console.error("Error occurred:", error);
//             setReportData([]);
//         }
//     };

//     // Define a function to handle date changes
//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else {
//             setToDate(e.target.value);
//         }
//     };

//     // Define a function to handle employee changes
//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     // Define a function to handle page changes
//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     // Define a function to handle max display count changes
//     const handleMaxDisplayCountChange = (e) => {
//         setMaxDisplayCount(parseInt(e.target.value, 10));
//         setPage(1);
//     };

//     // Define a function to handle delete
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//             if (response.data.status === "Success") {
//                 alert("Record deleted successfully");
//                 fetchReportData();
//             } else {
//                 alert("Failed to delete record");
//             }
//         } catch (error) {
//             console.error("Error deleting record:", error);
//             alert("An error occurred while deleting the record");
//         }
//     };

//     // Define a function to handle save
//     const handleSave = async (reportId) => {
//         // Fetch the evaluation and review data for the given reportId
//         const { evaluation, review } = editedReports[reportId] || {};

//         // Log the data to ensure correct values are being sent
//         console.log("Saving report:", reportId, "Evaluation:", evaluation, "Review:", review);

//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/post_emp_report`,
//                 { id: reportId, evaluation, review }
//             );

//             if (response.data.status === "Success") {
//                 alert("Changes saved successfully");
//                 fetchReportData();
//             } else {
//                 alert("Failed to save changes: " + response.data.message);
//             }
//         } catch (error) {
//             console.error("Error saving record:", error);
//             alert("An error occurred while saving the record");
//         }
//     };

//     // Define a function to handle evaluation changes
//     const handleEvaluationChange = (id, value) => {
//         setEditedReports((prev) => ({
//             ...prev,
//             [id]: {
//                 ...prev[id],
//                 evaluation: value,
//             },
//         }));
//     };

//     // Define a function to handle review changes
//     const handleReviewChange = (id, value) => {
//         setEditedReports((prev) => ({
//             ...prev,
//             [id]: {
//                 ...prev[id],
//                 review: value,
//             },
//         }));
//     };

//     // Define a function to render table rows
//     const renderTableRows = (reportData) => {
//         let serialNo = (page - 1) * maxDisplayCount + 1;

//         return reportData.map((dateItem, dateIndex) => {
//             const reports = dateItem.reports || [];
//             return reports
//                 .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                 .flatMap((reportItem) => {
//                     const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                     const employeeName = reportItem.name || "N/A";
//                     const reportDetails = reportItem.reportDetails || [];

//                     return reportDetails.map((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];
//                         return subcategories.map((subCategoryItem, subCatIndex) => (
//                             <tr key={`report-${dateIndex}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                     <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {serialNo++}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {employeeName}
//                                         </td>
//                                     </>
//                                 )}
//                                 {subCatIndex === 0 && (
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {detailItem.projectName || "N/A"}
//                                     </td>
//                                 )}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {userType === "Admin" && (
//                                     <>
//                                         <td className="border px-6 py-4">
//                                             <input
//                                                 type="text"
//                                                 value={editedReports[reportItem.id]?.evaluation || ""}
//                                                 onChange={(e) => handleEvaluationChange(reportItem.id, e.target.value)}
//                                                 className="border border-gray-300 rounded-lg p-1"
//                                                 placeholder="Enter evaluation"
//                                             />
//                                         </td>
//                                         <td className="border px-6 py-4">
//                                             <input
//                                                 type="text"
//                                                 value={editedReports[reportItem.id]?.review || ""}
//                                                 onChange={(e) => handleReviewChange(reportItem.id, e.target.value)}
//                                                 className="border border-gray-300 rounded-lg p-1"
//                                                 placeholder="Enter review"
//                                             />
//                                         </td>
//                                         <td className="border px-6 py-4">
//                                             <button
//                                                 onClick={() => handleSave(reportItem.id)}
//                                                 className="bg-blue-500 text-white px-2 py-1 rounded-md"
//                                             >
//                                                 Save
//                                             </button>
//                                         </td>
//                                     </>
//                                 )}
//                             </tr>
//                         ));
//                     });
//                 });
//         });
//     };

//     useEffect(() => {
//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);

//     return (
//         <div className="container mx-auto">
//             <div className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={new Date().toISOString().split("T")[0]}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
//                         focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={new Date().toISOString().split("T")[0]}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
//                         focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                     />
//                     {userType === "Admin" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
//                                 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//                             >
//                                 <option value="All">All</option>
//                                 {employees.map((employeeName, index) => (
//                                     <option key={index} value={employeeName}>
//                                         {employeeName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Table Section */}
//             {userType === "Admin" || userType === "developerAdmin" ? (
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: TABLE_MAX_HEIGHT }}>
//                             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>
//                                             S/No
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                             Date
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                             Employee Name
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                             Project Name
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                             Subcategory
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>
//                                             Report
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>
//                                             Evaluation
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>
//                                             Review
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "100px" }}></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>{renderTableRows(reportData)}</tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             ) : (
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: TABLE_MAX_HEIGHT - 40 }}>
//                             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>
//                                             S/No
//                                         </th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                             Date
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {/* render table rows for other user types */}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EmployeeReportList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id];
//     const review = reviews[id];
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       alert("Evaluation and Review saved successfully");
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin View Table */}
//       {userType === "Admin" || userType === "developerAdmin" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Save</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1;
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];
//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];
//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                           {detailItem.projectName || "N/A"}
//                                         </td>
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {userType === "Admin" && (
//                                           <>
//                                             <td className="border px-6 py-4">
//                                               <input
//                                                 type="text"
//                                                 value={evaluations[reportItem.id] || ""}
//                                                 onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                                 className="border rounded p-1"
//                                               />
//                                             </td>
//                                             <td className="border px-6 py-4">
//                                               <input
//                                                 type="text"
//                                                 value={reviews[reportItem.id] || ""}
//                                                 onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                                 className="border rounded p-1"
//                                               />
//                                             </td>
//                                             <td className="border px-6 py-4">
//                                               <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">
//                                                 Save
//                                               </button>
//                                             </td>
//                                           </>
//                                         )}
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Evalution</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1;
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                   {detailItem.projectName || "N/A"}
//                                 </td>
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {(userType === "employee" || userType === "Employee")  && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                   <td className="px-4 py-3">
//                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id];
//     const review = reviews[id];
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       alert("Evaluation and Review saved successfully");
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin View Table */}
//       {userType === "Admin" || userType === "developerAdmin" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1;
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];
//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];
//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                           {detailItem.projectName || "N/A"}
//                                         </td>
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {userType === "Admin" && (
//                                           <>
//                                             <td className="border px-6 py-4">
//                                               <input
//                                                 type="text"
//                                                 value={evaluations[reportItem.id] || ""}
//                                                 onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                                 className="border rounded p-1"
//                                                 placeholder="Add Evaluation"
//                                               />
//                                             </td>
//                                             <td className="border px-6 py-4">
//                                               <input
//                                                 type="text"
//                                                 value={reviews[reportItem.id] || ""}
//                                                 onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                                 className="border rounded p-1"
//                                                 placeholder="Add Review"
//                                               />
//                                             </td>
//                                             <td className="border px-6 py-4">
//                                               <button
//                                                 onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                                 className="bg-blue-500 text-white px-2 rounded">
//                                                 Save
//                                               </button>
//                                             </td>
//                                           </>
//                                         )}
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1;
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                   {detailItem.projectName || "N/A"}
//                                 </td>
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 <td className="border px-6 py-4">{subCategoryItem.evaluation || "N/A"}</td>
//                                 <td className="border px-6 py-4">{subCategoryItem.review || "N/A"}</td>
//                                 {(userType === "employee" || userType === "Employee") && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                   <td className="px-4 py-3">
//                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Set evaluations and reviews only for Admin
//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id]; // Get the evaluation from state
//     const review = reviews[id]; // Get the review from state
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       {/* Date Range and Employee Selection */}
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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       {userType === "Admin" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reports = dateItem.reports || [];
//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reports
//                           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                           .map((reportItem) => {
//                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                             const employeeName = reportItem.name || "N/A";
//                             const reportDetails = reportItem.reportDetails || [];
//                             return reportDetails.map((detailItem, detailIndex) => {
//                               const subcategories = detailItem.subCategory || [];
//                               return (
//                                 <React.Fragment key={detailIndex}>
//                                   {subcategories.map((subCategoryItem, subCatIndex) => (
//                                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                       {subCatIndex === 0 && detailIndex === 0 && (
//                                         <>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {dateIndex + 1}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {reportDate}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {employeeName}
//                                           </td>
//                                         </>
//                                       )}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {detailItem.projectName || "N/A"}
//                                       </td>
//                                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Evaluation"
//                                         />
//                                       </td>
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Review"
//                                         />
//                                       </td>
//                                       <td className="border px-6 py-4">
//                                         <button
//                                           onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                           className="bg-blue-500 text-white px-2 rounded"
//                                         >
//                                           Save
//                                         </button>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </React.Fragment>
//                               );
//                             });
//                           })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                     const reportDetails = dateItem.reportDetails || [];

//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];

//                           return subcategories.map((subCategoryItem, subCatIndex) => (
//                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                               {subCatIndex === 0 && detailIndex === 0 && (
//                                 <>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {dateIndex + 1}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {reportDate}
//                                   </td>
//                                 </>
//                               )}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {detailItem.projectName || "N/A"}
//                               </td>
//                               <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.evaluation || "N/A"}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.review || "N/A"}</td>
//                               {userType === "employee" && (
//                                 <td className="px-4 py-3">
//                                   <button onClick={() => handleDelete(dateItem.id)}>
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               )}
//                             </tr>
//                           ));
//                         })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Set evaluations and reviews only for Admin
//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || ""; // Default to empty string if not set
//     const review = reviews[id]; // Maintain any type of data stored in review

//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       {/* Date Range and Employee Selection */}
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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       {userType === "Admin" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reports = dateItem.reports || [];
//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reports
//                           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                           .map((reportItem) => {
//                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                             const employeeName = reportItem.name || "N/A";
//                             const reportDetails = reportItem.reportDetails || [];
//                             return reportDetails.map((detailItem, detailIndex) => {
//                               const subcategories = detailItem.subCategory || [];
//                               return (
//                                 <React.Fragment key={detailIndex}>
//                                   {subcategories.map((subCategoryItem, subCatIndex) => (
//                                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                       {subCatIndex === 0 && detailIndex === 0 && (
//                                         <>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {dateIndex + 1}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {reportDate}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {employeeName}
//                                           </td>
//                                         </>
//                                       )}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {detailItem.projectName || "N/A"}
//                                       </td>
//                                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Evaluation"
//                                         />
//                                       </td>
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Review"
//                                         />
//                                       </td>
//                                       <td className="border px-6 py-4">
//                                         <button
//                                           onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                           className="bg-blue-500 text-white px-2 rounded"
//                                         >
//                                           Save
//                                         </button>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </React.Fragment>
//                               );
//                             });
//                           })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Evaluation</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Delete column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                     const reportDetails = dateItem.reportDetails || [];

//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];

//                           return subcategories.map((subCategoryItem, subCatIndex) => (
//                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                               {subCatIndex === 0 && detailIndex === 0 && (
//                                 <>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {dateIndex + 1}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {reportDate}
//                                   </td>
//                                 </>
//                               )}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {detailItem.projectName || "N/A"}
//                               </td>
//                               <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.evaluation || ""}</td> {/* Show Evaluation */}
//                               <td className="border px-6 py-4">{subCategoryItem.review || ""}</td> {/* Show Review */}
//                               {userType === "employee" && (
//                                 <td className="px-4 py-3">
//                                   <button onClick={() => handleDelete(detailItem.id)}> {/* Pass report item's ID to delete */}
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               )}
//                             </tr>
//                           ));
//                         })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [adminReview, setAdminReview] = useState("");
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]); // State to store unique employee names
//   const [selectedEmployee, setSelectedEmployee] = useState("All"); // Set default to "All"

//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         const payload = {
//           domain: "Development",
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//         };

//         const apiEndpoint =
//         userType === "Admin"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);
//         } else {
//           setReportData([]);
//         }

//         if(userType === "Admin" ){
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]); // Add "All" option at the beginning
//           }
//         }

//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };
//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleAdminReviewChange = (e) => {
//     setAdminReview(e.target.value);
//   };

//   return (
//     <div className="container mx-auto">
//       {/* <h2 className="text-2xl font-bold mb-4">Report List</h2> */}
//       <div date-rangepicker className="my-4 flex items-center">
//         <div className="flex">
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//         />
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//         />
//          {userType === "Admin" && (
//   <div className="flex items-center">
//     <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//       Select Employee:
//     </label>
//     <select
//       id="employee"
//       value={selectedEmployee}
//       onChange={handleEmployeeChange}
//       className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//     >
//       <option value="">Select Employee</option>
//       {employees.map((employeeName, index) => (
//         <option key={index} value={employeeName}>
//           {employeeName}
//         </option>
//       ))}
//     </select>
//   </div>
// )}

//         </div>
//       </div>

//       {/* Admin View Table */}
//       {userType === "Admin" || userType === "developerAdmin" ? (
//          <div className="my-5">
//           {reportData.length > 0 ? (
//            <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300 "
//               style={{ position: 'sticky', top: 0, zIndex: 1, height: '55px' }}
//               >
//               <tr>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                 <th className="border px-4 py-2" style={{ width: "200px" }}>Admin Review</th>
//               </tr>
//             </thead>
//             <tbody>
//             {(() => {
//   // Calculate the starting serial number based on the current page and maxDisplayCount
//   let serialNo = (page - 1) * maxDisplayCount + 1;
//   return reportData.map((dateItem, dateIndex) => {
//     const reports = dateItem.reports || [];

//     return (
//       <React.Fragment key={dateIndex}>
//         {reports
//           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee) // Filter by selected employee
//           .map((reportItem) => {
//             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//             const employeeName = reportItem.name || "N/A";
//             const reportDetails = reportItem.reportDetails || [];

//             return reportDetails.map((detailItem, detailIndex) => {
//               const subcategories = detailItem.subCategory || [];

//             return (
//               <React.Fragment key={detailIndex}>
//                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                     {subCatIndex === 0 && detailIndex === 0 && (
//                       <>
//                         {/* Serial Number */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {serialNo++} {/* Increment serial number here */}
//                         </td>
//                         {/* Report Date */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {reportDate}
//                         </td>
//                         {/* Employee Name */}
//                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                           {employeeName}
//                         </td>
//                       </>
//                     )}
//                     {/* Project Name */}
//                     {subCatIndex === 0 && (
//                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                         {detailItem.projectName || "N/A"}
//                       </td>
//                     )}
//                     {/* Subcategory */}
//                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                     {/* Report */}
//                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                     {/* Admin Review */}
//                     <td className="border px-6 py-4">
//                       <input
//                         type="text"
//                         value={dateItem.adminReview || ""}
//                         onChange={handleAdminReviewChange}
//                         className="w-full border border-gray-300 p-1 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </React.Fragment>
//             );
//           });
//         })}
//       </React.Fragment>
//     );
//   });
// })()}

//             </tbody>
//           </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             //<div className="overflow-auto max-h-80">
//               <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {/* <th className="border px-4 py-2" style={{ width: "50px" }}>Edit</th> */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter

//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting the date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Edit Button */}
//                                 {/* {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                       <td className="px-4 py-3">
//                         <button onClick={() => handleEdit(dateItem.id)}>
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                       </td>
//                     )} */}
//                     {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                     <td className="px-4 py-3">
//                     <button onClick={() => handleDelete(dateItem.id)}>
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </td>
//                     )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Set evaluations and reviews only for Admin
//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || ""; // Default to empty string if not set
//     const review = reviews[id]; // Maintain any type of data stored in review

//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       {/* Date Range and Employee Selection */}
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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       <div className="my-5">
//         {reportData.length > 0 ? (
//           <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//               <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                 <tr>
//                   <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                   <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                   {userType === "Admin" && <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>}
//                   {userType === "Sr. Technical Head" && <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>}
//                   <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((dateItem, dateIndex) => {
//                   const reports = dateItem.reports || [];
//                   return (
//                     <React.Fragment key={dateIndex}>
//                       {reports
//                         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                         .map((reportItem) => {
//                           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                           const reportTime = reportItem.reportDetails[0]?.time || "N/A"; // Display the report time or "N/A" if not available
//                           const employeeName = reportItem.name || "N/A";
//                           const reportDetails = reportItem.reportDetails || [];
//                           return reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];
//                             return (
//                               <React.Fragment key={detailIndex}>
//                                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && detailIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {dateIndex + 1}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportTime}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {employeeName}
//                                         </td>
//                                       </>
//                                     )}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {detailItem.projectName || "N/A"}
//                                     </td>
//                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                     {userType === "Admin" ? (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                         />
//                                       </td>
//                                     ) : (
//                                       <td className="border px-6 py-4" disabled>
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                           disabled={true} // Disabled for non-Admin users
//                                         />
//                                       </td>
//                                     )}

//                                     {userType === "Sr. Technical Head" ? (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Team Leader Review"
//                                         />
//                                       </td>
//                                     ) : (
//                                       <td className="border px-6 py-4" disabled>
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Team Leader Review"
//                                           disabled={true} // Disabled for non-Team Leader users
//                                         />
//                                       </td>
//                                     )}

//                                     <td className="border px-6 py-4">
//                                       <button
//                                         onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                         className="bg-blue-500 text-white px-2 rounded"
//                                       >
//                                         Save
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </React.Fragment>
//                             );
//                           });
//                         })}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500">No reports found for the selected date range.</p>
//         )}
//       </div>

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Set evaluations and reviews only for Admin
//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || ""; // Default to empty string if not set
//     const review = reviews[id]; // Maintain any type of data stored in review

//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       {/* Date Range and Employee Selection */}
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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       <div className="my-5">
//         {reportData.length > 0 ? (
//           <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//               <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                 <tr>
//                   <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                   <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                   {userType === "Admin" && <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>}
//                   {userType === "Sr. Technical Head" && <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>}
//                   {userType === "employee" && <th className="border px-4 py-2" style={{ width: "50px" }}></th>} {/* Delete icon for employee */}
//                   <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((dateItem, dateIndex) => {
//                   const reports = dateItem.reports || [];
//                   return (
//                     <React.Fragment key={dateIndex}>
//                       {reports
//                         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                         .map((reportItem) => {
//                           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                           const reportTime = reportItem.reportDetails[0]?.time || "N/A"; // Display the report time or "N/A" if not available
//                           const employeeName = reportItem.name || "N/A";
//                           const reportDetails = reportItem.reportDetails || [];
//                           return reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];
//                             return (
//                               <React.Fragment key={detailIndex}>
//                                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && detailIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {dateIndex + 1}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportTime}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {employeeName}
//                                         </td>
//                                       </>
//                                     )}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {detailItem.projectName || "N/A"}
//                                     </td>
//                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                     {userType === "Admin" ? (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                         />
//                                       </td>
//                                     ) : (
//                                       <td className="border px-6 py-4" disabled>
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                           disabled={true} // Disabled for non-Admin users
//                                         />
//                                       </td>
//                                     )}

//                                     {userType === "Sr. Technical Head" ? (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Team Leader Review"
//                                         />
//                                       </td>
//                                     ) : (
//                                       <td className="border px-6 py-4" disabled>
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Team Leader Review"
//                                           disabled={true} // Disabled for non-Team Leader users
//                                         />
//                                       </td>
//                                     )}

//                                     {userType === "employee" && (
//                                       <td className="border px-6 py-4">
//                                         <button onClick={() => handleDelete(subCategoryItem.id)}>
//                                           <FontAwesomeIcon icon={faTrash} className="text-red-500" />
//                                         </button>
//                                       </td>
//                                     )}

//                                     <td className="border px-6 py-4">
//                                       <button
//                                         onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                         className="bg-blue-500 text-white px-2 rounded"
//                                       >
//                                         Save
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </React.Fragment>
//                             );
//                           });
//                         })}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500">No reports found for the selected date range.</p>
//         )}
//       </div>

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id];
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       {userType === "Admin" || userType === "Sr. Technical Head" ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {userType === "Admin" && (
//                       <th className="border px-4 py-2" style={{ width: "100px" }}>Admin Review</th>
//                     )}
//                     {userType === "Sr. Technical Head" && (
//                       <th className="border px-4 py-2" style={{ width: "100px" }}>Team Leader</th>
//                     )}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Save column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reports = dateItem.reports || [];
//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reports
//                           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                           .map((reportItem) => {
//                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                             const employeeName = reportItem.name || "N/A";
//                             const reportDetails = reportItem.reportDetails || [];
//                             return reportDetails.map((detailItem, detailIndex) => {
//                               const subcategories = detailItem.subCategory || [];
//                               return (
//                                 <React.Fragment key={detailIndex}>
//                                   {subcategories.map((subCategoryItem, subCatIndex) => (
//                                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                       {subCatIndex === 0 && detailIndex === 0 && (
//                                         <>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {dateIndex + 1}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {reportDate}
//                                           </td>
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {employeeName}
//                                           </td>
//                                         </>
//                                       )}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {detailItem.projectName || "N/A"}
//                                       </td>
//                                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                       {userType === "Admin" && (
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                       )}
//                                       {userType === "Sr. Technical Head" && (
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                           />
//                                         </td>
//                                       )}
//                                       <td className="border px-6 py-4">
//                                         <button
//                                           onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                           className="bg-blue-500 text-white px-2 rounded"
//                                         >
//                                           Save
//                                         </button>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </React.Fragment>
//                               );
//                             });
//                           })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Team Leader</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for Delete column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                     const reportDetails = dateItem.reportDetails || [];

//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];

//                           return subcategories.map((subCategoryItem, subCatIndex) => (
//                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                               {subCatIndex === 0 && detailIndex === 0 && (
//                                 <>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {dateIndex + 1}
//                                   </td>
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {reportDate}
//                                   </td>
//                                 </>
//                               )}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {detailItem.projectName || "N/A"}
//                               </td>
//                               <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                               <td className="border px-6 py-4">{subCategoryItem.evaluation || ""}</td> {/* Show Admin Review */}
//                               <td className="border px-6 py-4">{subCategoryItem.review || ""}</td> {/* Show Team Leader */}
//                               {userType === "employee" && (
//                                 <td className="px-4 py-3">
//                                   <button onClick={() => handleDelete(detailItem.id)}> {/* Pass report item's ID to delete */}
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               )}
//                             </tr>
//                           ));
//                         })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id];
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       <div className="my-5">
//         {reportData.length > 0 ? (
//           <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//               <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                 <tr>
//                   <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                   <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                   {userType === "Admin" && (
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Admin Review</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Team Leader Review</th>
//                   <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Save column */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((dateItem, dateIndex) => {
//                   const reports = dateItem.reports || [];
//                   return (
//                     <React.Fragment key={dateIndex}>
//                       {reports
//                         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                         .map((reportItem) => {
//                           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                           const employeeName = reportItem.name || "N/A";
//                           const reportDetails = reportItem.reportDetails || [];
//                           return reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];
//                             return (
//                               <React.Fragment key={detailIndex}>
//                                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && detailIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {dateIndex + 1}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {employeeName}
//                                         </td>
//                                       </>
//                                     )}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {detailItem.projectName || "N/A"}
//                                     </td>
//                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                     {userType === "Admin" && (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                         />
//                                       </td>
//                                     )}
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={reviews[reportItem.id] || ""}
//                                         onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                         className="border rounded p-1"
//                                         placeholder="Team Leader Review"
//                                         disabled={userType === "Admin"} // Disable typing for Admin
//                                       />
//                                     </td>
//                                     <td className="border px-6 py-4">
//                                       {userType === "Admin" ? (
//                                         <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                       ) : userType === "employee" ? (
//                                         <button onClick={() => handleDelete(detailItem.id)} className="text-red-600 px-2"><FontAwesomeIcon icon={faTrash} /></button>
//                                       ) : null}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </React.Fragment>
//                             );
//                           });
//                         })}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500">No reports found for the selected date range.</p>
//         )}
//       </div>

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const evals = {};
//           const revs = {};
//           data.forEach(report => {
//             report.reports.forEach(reportItem => {
//               evals[reportItem.id] = reportItem.evaluation || "";
//               revs[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setEvaluations(evals);
//           setReviews(revs);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, userType]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id];
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Report Table */}
//       <div className="my-5">
//         {reportData.length > 0 ? (
//           <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//               <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                 <tr>
//                   <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                   <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                   <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                   <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                   {userType === "Admin" && (
//                     <th className="border px-4 py-2" style={{ width: "100px" }}>Admin Review</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "100px" }}>Team Leader Review</th>
//                   {userType === "employee" && (
//                     <th className="border px-4 py-2" style={{ width: "80px" }}>Delete</th>
//                   )}
//                   <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Save column */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((dateItem, dateIndex) => {
//                   const reports = dateItem.reports || [];
//                   return (
//                     <React.Fragment key={dateIndex}>
//                       {reports
//                         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                         .map((reportItem) => {
//                           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                           const employeeName = reportItem.name || "N/A";
//                           const reportDetails = reportItem.reportDetails || [];
//                           return reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];
//                             return (
//                               <React.Fragment key={detailIndex}>
//                                 {subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && detailIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {dateIndex + 1}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {employeeName}
//                                         </td>
//                                       </>
//                                     )}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {detailItem.projectName || "N/A"}
//                                     </td>
//                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                     {userType === "Admin" && (
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                         />
//                                       </td>
//                                     )}
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={reviews[reportItem.id] || ""}
//                                         onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                         className="border rounded p-1"
//                                         placeholder="Team Leader Review"
//                                         disabled={userType === "Admin"} // Disable typing for Admin
//                                       />
//                                     </td>
//                                     {userType === "employee" && (
//                                       <td className="border px-6 py-4">
//                                         <button
//                                           onClick={() => handleDeleteConfirmation(detailItem.id)}
//                                           className="bg-red-600 text-white px-2 rounded"
//                                         >
//                                           Delete
//                                         </button>
//                                       </td>
//                                     )}
//                                     <td className="border px-6 py-4">
//                                       {userType === "Admin" ? (
//                                         <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                       ) : null}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </React.Fragment>
//                             );
//                           });
//                         })}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500">No reports found for the selected date range.</p>
//         )}
//       </div>

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                           />
//                                         </td>
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="bg-red-500 text-white px-2 ml-2 rounded"><FontAwesomeIcon icon={faTrash} /></button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         time: new Date().toLocaleTimeString(), // Adjust the time as per your logic
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         time: new Date().toLocaleTimeString(), // Adjust the time as per your logic
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Save</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];
//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Save Button */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Save</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Save Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleSaveEvaluationReview(detailItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         time: new Date().toLocaleTimeString(), // Adjust the time as per your logic
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Action</th> {/* Keep this for Save if needed */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Removed Action Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Removed Action Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Removed Action Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review - Disabled for Admin */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Optional Action Header */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="text-red-600 ml-2">
//                                             <FontAwesomeIcon icon={faTrash} />
//                                           </button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType !== "Admin" && ( // Show delete button only if not admin
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="text-red-600 ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     {/* Delete column header removed */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 {userType !== "Admin" && ( // Show delete button only if not admin
//                                   <td className="border px-6 py-4">
//                                     <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map((reportItem) => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={(e) => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={(e) => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType === "employee" && ( // Show delete button only for employees
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="text-red-600 ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={(e) => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={(e) => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//         />
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleDateChange}
//           max={today}
//           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//         />
//         {userType === "Admin" && (
//           <div className="flex items-center">
//             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//               Select Employee:
//             </label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={handleEmployeeChange}
//               className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//             >
//               <option value="All">Select Employee</option>
//               {employees.map((employeeName, index) => (
//                 <option key={index} value={employeeName}>
//                   {employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reports = dateItem.reports || [];
//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reports
//                           .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                           .map((reportItem) => {
//                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                             const employeeName = reportItem.name || "N/A";
//                             const reportDetails = reportItem.reportDetails || [];

//                             return reportDetails.map((detailItem, detailIndex) => {
//                               const subcategories = detailItem.subCategory || [];

//                               return (
//                                 <React.Fragment key={detailIndex}>
//                                   {subcategories.map((subCategoryItem, subCatIndex) => (
//                                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                       {subCatIndex === 0 && detailIndex === 0 && (
//                                         <>
//                                           {/* Serial Number */}
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {((dateIndex * maxDisplayCount) + dateIndex + 1)}
//                                           </td>
//                                           {/* Report Date */}
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {reportDate}
//                                           </td>
//                                           {/* Employee Name */}
//                                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                             {employeeName}
//                                           </td>
//                                         </>
//                                       )}
//                                       {/* Project Name */}
//                                       {subCatIndex === 0 && (
//                                         <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                           {detailItem.projectName || "N/A"}
//                                         </td>
//                                       )}
//                                       {/* Subcategory */}
//                                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                       {/* Report */}
//                                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                       {/* Admin Review */}
//                                      <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={evaluations[reportItem.id] || ""}
//                                           onChange={(e) =>
//                                             setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })
//                                           }
//                                           className="border rounded p-1"
//                                           placeholder="Add Admin Review"
//                                         />
//                                       </td>
//                                       {/* Team Leader Review */}
//                                       <td className="border px-6 py-4">
//                                         <input
//                                           type="text"
//                                           value={reviews[reportItem.id] || ""}
//                                           onChange={(e) =>
//                                             setReviews({ ...reviews, [reportItem.id]: e.target.value })
//                                           }
//                                           className="border rounded p-1"
//                                           placeholder="Add Team Leader Review"
//                                         />
//                                       </td>
//                                       {/* Action Buttons */}
//                                       <td className="border px-6 py-4">
//                                         <button
//                                           onClick={() => handleSaveEvaluationReview(reportItem.id)}
//                                           className="bg-blue-500 text-white px-2 rounded"
//                                         >
//                                           Save
//                                         </button>
//                                         {userType === "employee" && (
//                                           <button
//                                             onClick={() => handleDeleteConfirmation(reportItem.id)}
//                                             className="text-red-600 ml-2"
//                                           >
//                                             <FontAwesomeIcon icon={faTrash} />
//                                           </button>
//                                         )}
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </React.Fragment>
//                               );
//                             });
//                           })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((dateItem, dateIndex) => {
//                     const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                     const reportDetails = dateItem.reportDetails || [];

//                     return (
//                       <React.Fragment key={dateIndex}>
//                         {reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];

//                           return subcategories.map((subCategoryItem, subCatIndex) => (
//                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                               {subCatIndex === 0 && detailIndex === 0 && (
//                                 <>
//                                   {/* Serial Number */}
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {((dateIndex * maxDisplayCount) + dateIndex + 1)}
//                                   </td>
//                                   {/* Report Date */}
//                                   <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                     {reportDate}
//                                   </td>
//                                 </>
//                               )}
//                               {/* Project Name */}
//                               {subCatIndex === 0 && (
//                                 <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                   {detailItem.projectName || "N/A"}
//                                 </td>
//                               )}
//                               {/* Subcategory */}
//                               <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                               {/* Report */}
//                               <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                               {/* Admin Review */}
//                               <td className="border px-6 py-4">
//                                 <span>{evaluations[detailItem.id] || "N/A"}</span>
//                               </td>
//                               <td className="border px-6 py-4">
//                                 <span>{reviews[detailItem.id] || "N/A"}</span>
//                               </td>
//                               {/* Delete Button */}
//                               <td className="border px-6 py-4">
//                                 <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                   <FontAwesomeIcon icon={faTrash} />
//                                 </button>
//                               </td>
//                             </tr>
//                           ));
//                         })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector(state => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = e => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = e => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = newPage => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = e => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = id => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async id => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = id => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async id => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Admin or Developer Admin View Table */}
//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType === "employee" && ( // Show delete button only for employees
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="text-red-600 ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector(state => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = e => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = e => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = newPage => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = e => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = id => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async id => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = id => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async id => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={evaluations[reportItem.id] || ""}
//                                             onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Admin Review"
//                                           />
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled={userType !== "Employee"} // Enable only if user is Employee
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {(userType === "employee") && ( // Show delete button only for employees
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="text-red-600 ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleDeleteConfirmation(detailItem.id)} className="text-red-600">
//                                     <FontAwesomeIcon icon={faTrash} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector(state => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = e => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = e => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = newPage => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = e => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = id => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async id => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = id => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async id => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled={userType !== "Employee"} // Enable only if user is Employee
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                         moment(),
//                                                         "day"
//                                                       ) && (
//                                                     <td className="px-4 py-3">
//                                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                                       <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                   </td>
//                                                     )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                         moment(),
//                                                         "day"
//                                                       ) && (
//                                                     <td className="px-4 py-3">
//                                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                                       <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                   </td>
//                                                     )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector(state => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations and reviews with existing report data
//         const existingEvaluations = {};
//         const existingReviews = {};
//         if (userType === "Admin" || userType === "developerAdmin") {
//           data.forEach(report => {
//             existingEvaluations[report.id] = report.evaluation || "";
//             existingReviews[report.id] = report.review || "";
//           });
//           setEvaluations(existingEvaluations);
//           setReviews(existingReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = e => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = e => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = newPage => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = e => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = id => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async id => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = id => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async id => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reports = dateItem.reportDetails || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports.map((reportItem, reportIndex) => {
//                             const projectName = reportItem.projectName || "N/A";
//                             const subcategories = reportItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {reportDate}
//                                     </td>
//                                     {/* Employee Name */}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {dateItem.employeeId || "N/A"}
//                                     </td>
//                                     {/* Project Name */}
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {projectName}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   {userType === "Employee" ? (
//                                     <div className="border rounded p-1 bg-gray-100">
//                                       {evaluations[dateItem.id] || "No admin review available."}
//                                     </div>
//                                   ) : (
//                                     <input
//                                       type="text"
//                                       value={evaluations[dateItem.id] || ""}
//                                       onChange={e => setEvaluations({ ...evaluations, [dateItem.id]: e.target.value })}
//                                       className="border rounded p-1"
//                                       placeholder="Add Admin Review"
//                                     />
//                                   )}
//                                 </td>
//                                 {/* Team Leader Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[dateItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [dateItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled={userType !== "Employee"}
//                                   />
//                                 </td>
//                                 {/* Action Buttons */}
//                                 <td className="border px-6 py-4">
//                                   <button onClick={() => handleSaveEvaluationReview(dateItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                   {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                           moment(),
//                                                           "day"
//                                                         ) && (
//                                                       <td className="px-4 py-3">
//                                                       <button onClick={() => handleDelete(dateItem.id)}>
//                                                         <FontAwesomeIcon icon={faTrash} />
//                                                       </button>
//                                                     </td>
//                                                       )}
//                                 </td>
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                         moment(),
//                                                         "day"
//                                                       ) && (
//                                                     <td className="px-4 py-3">
//                                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                                       <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                   </td>
//                                                     )}

//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Refresh the report data after deletion
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled={userType !== "Employee"} // Enable only if user is Employee
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType === "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th> {/* Empty header for action column */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review */}
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 {/* Delete Button */}
//                                 {userType === "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                   <td className="px-4 py-3">
//                                     <button onClick={() => handleDeleteConfirmation(detailItem.id)}>
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Assuming the delete endpoint is correct
//       const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       console.log('Delete Response:', response.data); // Log the delete response for debugging
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh the report data after deletion
//       } else {
//         alert("Failed to delete record"); // Provide user feedback
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record"); // Provide user feedback
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled={userType !== "Employee"} // Enable only if user is Employee
//                                           />
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                           {userType === "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                             <button onClick={() => handleDeleteConfirmation(reportItem.id)} className="ml-2">
//                                               <FontAwesomeIcon icon={faTrash} />
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {/* <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={evaluations[detailItem.id] || ""}
//                                     onChange={e => setEvaluations({ ...evaluations, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Admin Review"
//                                     disabled
//                                   />
//                                 </td>
//                                 <td className="border px-6 py-4">
//                                   <input
//                                     type="text"
//                                     value={reviews[detailItem.id] || ""}
//                                     onChange={e => setReviews({ ...reviews, [detailItem.id]: e.target.value })}
//                                     className="border rounded p-1"
//                                     placeholder="Add Team Leader Review"
//                                     disabled
//                                   />
//                                 </td> */}
//                                 {/* Delete Button */}
//                                 {userType === "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                                   <td className="px-4 py-3">
//                                     <button onClick={() => handleDeleteConfirmation(detailItem.id)}>
//                                       <FontAwesomeIcon icon={faTrash} />
//                                     </button>
//                                   </td>
//                                 )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleMaxDisplayCountChange = (e) => {
//     setMaxDisplayCount(e.target.value);
//     setPage(1);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDeleteConfirmation = (id) => {
//     const confirmDelete = window.confirm("Do you really want to delete this report?");
//     if (confirmDelete) {
//       handleDelete(id);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       console.log('Delete Response:', response.data);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData(); // Refresh the report data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     {/* <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review
//                                         <td className="border px-6 py-4">
//                                           <input
//                                             type="text"
//                                             value={reviews[reportItem.id] || ""}
//                                             onChange={e => setReviews({ ...reviews, [reportItem.id]: e.target.value })}
//                                             className="border rounded p-1"
//                                             placeholder="Add Team Leader Review"
//                                             disabled={userType !== "Employee"} // Enable only if user is Employee
//                                           />
//                                         </td> */}
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                         moment(),
//                                                         "day"
//                                                       ) && (
//                                                     <td className="px-4 py-3">
//                                                     <button onClick={() => handleDelete(dateItem.id)}>
//                                                       <FontAwesomeIcon icon={faTrash} />
//                                                     </button>
//                                                   </td>
//                                                     )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                               const employeeName = reportItem.name || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {employeeName}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>

//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               const createdAt = reportItem.createdAt || null; // Get createdAt from reportItem

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                              <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//   {reportItem.createdAt || reportItem.updatedAt
//     ? moment(reportItem.createdAt || reportItem.updatedAt).format("hh:mm A")
//     : "N/A"}
// </td>

//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>

//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                     {/* Report Time */}
//                                     <td className="border px-4 py-4">{moment(item.createdAt).format("HH:mm")}</td>

//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations with existing report evaluations
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           // Store existing evaluations to maintain them
//           const existingEvaluations = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               const createdAt = reportItem.createdAt ? moment(reportItem.createdAt).format("HH:mm") : "N/A"; // Format createdAt
//                                const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {createdAt}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>

//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                       {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {detailItem.createdAt ? moment(detailItem.createdAt).format("HH:mm") : 'N/A'}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations and teamLeaderReviews with existing report data
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//               existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//             });
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//         teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData(); // Refresh after save to update data
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> {/* New column */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               const createdAt = reportItem.createdAt ? moment(reportItem.createdAt).format("HH:mm") : "N/A"; // Format createdAt
//                               const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {createdAt}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Admin" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {teamLeaderReviews[reportItem.id] || "No team leader review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={teamLeaderReviews[reportItem.id] || ""}
//                                               onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Team Leader Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                       {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {detailItem.createdAt ? moment(detailItem.createdAt).format("HH:mm") : 'N/A'}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                   <div className="border rounded p-1 bg-gray-100">
//                                     {evaluations[detailItem.id] || "No admin review available."}
//                                   </div>
//                                 </td>
//                                 {/* Team Leader Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                     <div className="border rounded p-1 bg-gray-100">
//                                       {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                     </div>
//                                   </td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations and teamLeaderReviews with existing report data
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//               existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//             });
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//         teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData(); // Refresh after save to update data
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> {/* New column */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               // Ensure that detailItem.createdAt is available before attempting to format it
//                               const createdAt = reportItem.createdAt ? moment(reportItem.createdAt).format("HH:mm") : "N/A"; // Format createdAt
//                               const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {createdAt}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Admin" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {teamLeaderReviews[reportItem.id] || "No team leader review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={teamLeaderReviews[reportItem.id] || ""}
//                                               onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Team Leader Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                       {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {detailItem.createdAt ? moment(detailItem.createdAt).format("HH:mm") : 'N/A'}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                   <div className="border rounded p-1 bg-gray-100">
//                                     {evaluations[detailItem.id] || "No admin review available."}
//                                   </div>
//                                 </td>
//                                 {/* Team Leader Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                     <div className="border rounded p-1 bg-gray-100">
//                                       {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                     </div>
//                                   </td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// // EmployeeReportListTable Component (for Admin and developerAdmin)
// const EmployeeReportListTable = ({
//   reportData,
//   evaluations,
//   teamLeaderReviews,
//   employees,
//   selectedEmployee,
//   handleDelete,
//   handleSaveEvaluationReview,
//   userType,
//   page,
//   maxDisplayCount,
// }) => {
//   // Helper function to calculate the serial number
//   const calculateSerialNumber = (dateIndex, detailIndex, subCatIndex, reportDetailsLength, page, maxDisplayCount) => {
//     let serialNo = (page - 1) * maxDisplayCount + 1;
//     return serialNo + dateIndex * reportDetailsLength;
//   };

//   return (
//     <div className="my-5">
//       {reportData.length > 0 ? (
//         <div className="overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>
//                   S/No
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                   Date
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                   Time
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Employee Name
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Project Name
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Subcategory
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>
//                   Report
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Admin Review
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Team Leader Review
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDetails = reportItem.reportDetails || [];
//                         const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A"; // Format time here

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           const reportDetailsLength = reportDetails.length;
//                           const serialNo = calculateSerialNumber(
//                             dateIndex,
//                             detailIndex,
//                             0,
//                             reportDetailsLength,
//                             page,
//                             maxDisplayCount
//                           );

//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {(subCatIndex === 0 && detailIndex === 0) && (
//                                     <>
//                                       {/* Serial Number */}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {serialNo + subCatIndex}
//                                       </td>
//                                       {/* Report Date */}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {reportDate}
//                                       </td>
//                                       {/* Report Time */}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {createdAt}
//                                       </td>
//                                       {/* Employee Name */}
//                                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                         {reportItem.name || "N/A"}
//                                       </td>
//                                     </>
//                                   )}
//                                   {/* Project Name */}
//                                   {subCatIndex === 0 && (
//                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                       {detailItem.projectName || "N/A"}
//                                     </td>
//                                   )}
//                                   {/* Subcategory */}
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   {/* Report */}
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   {/* Admin Review */}
//                                   <td className="border px-6 py-4">
//                                     {userType === "Employee" ? (
//                                       <div className="border rounded p-1 bg-gray-100">
//                                         {evaluations[reportItem.id] || "No admin review available."}
//                                       </div>
//                                     ) : (
//                                       <input
//                                         type="text"
//                                         value={evaluations[reportItem.id] || ""}
//                                         onChange={(e) =>
//                                           handleSaveEvaluationReview({ ...evaluations, [reportItem.id]: e.target.value }, teamLeaderReviews)
//                                         }
//                                         className="border rounded p-1"
//                                         placeholder="Add Admin Review"
//                                       />
//                                     )}
//                                   </td>
//                                   {/* Team Leader Review */}
//                                   <td className="border px-6 py-4">
//                                     {userType === "Admin" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[reportItem.id] || ""}
//                                         onChange={(e) =>
//                                           handleSaveEvaluationReview(evaluations, { ...teamLeaderReviews, [reportItem.id]: e.target.value })
//                                         }
//                                         className="border rounded p-1"
//                                         placeholder="Add Team Leader Review"
//                                       />
//                                     ) : (
//                                       <div className="border rounded p-1 bg-gray-100">
//                                         {teamLeaderReviews[reportItem.id] || "No team leader review available."}
//                                       </div>
//                                     )}
//                                   </td>
//                                   {/* Action Buttons */}
//                                   <td className="border px-6 py-4">
//                                     <button
//                                       onClick={() =>
//                                         handleSaveEvaluationReview(evaluations, teamLeaderReviews, reportItem.id)
//                                       }
//                                       className="bg-blue-500 text-white px-2 rounded"
//                                     >
//                                       Save
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </React.Fragment>
//                           );
//                         });
//                       })}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500">No reports found for the selected date range.</p>
//       )}
//     </div>
//   );
// };

// // EmployeeReportListTable Component (for Employees)
// const EmployeeReportListTableEmployee = ({ reportData, evaluations, teamLeaderReviews, handleDelete, userType }) => {
//   return (
//     <div className="my-5">
//       {reportData.length > 0 ? (
//         <div className="overflow-auto" style={{ maxHeight: "430px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>
//                   S/No
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                   Date
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                   Time
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Project Name
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Subcategory
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>
//                   Report
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Admin Review
//                 </th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                   Team Leader Review
//                 </th>
//                 {userType === "employee" && (
//                   <th className="border px-4 py-2" style={{ width: "50px" }}>
//                     Delete
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                 const reportDetails = dateItem.reportDetails || [];
//                 let serialNo = 1;

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reportDetails.map((detailItem, detailIndex) => {
//                       const subcategories = detailItem.subCategory || [];
//                       const createdAt = detailItem.created_at ? moment(detailItem.created_at).format("HH:mm A") : 'N/A'; // Format time here

//                       return subcategories.map((subCategoryItem, subCatIndex) => (
//                         <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                           {subCatIndex === 0 && detailIndex === 0 && (
//                             <>
//                               {/* Serial Number */}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {serialNo++}
//                               </td>
//                               {/* Report Date */}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {reportDate}
//                               </td>
//                               {/* Report Time - Created At */}
//                               <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                 {createdAt}
//                               </td>
//                             </>
//                           )}
//                           {/* Project Name */}
//                           {subCatIndex === 0 && (
//                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                               {detailItem.projectName || "N/A"}
//                             </td>
//                           )}
//                           {/* Subcategory */}
//                           <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                           {/* Report */}
//                           <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                           {/* Admin Review (Read-only for Employee) */}
//                           <td className="border px-6 py-4">
//                             <div className="border rounded p-1 bg-gray-100">
//                               {evaluations[detailItem.id] || "No admin review available."}
//                             </div>
//                           </td>
//                           {/* Team Leader Review (Read-only for Employee) */}
//                           <td className="border px-6 py-4">
//                             <div className="border rounded p-1 bg-gray-100">
//                               {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                             </div>
//                           </td>
//                           {userType === "employee" &&
//                             moment(reportDate, "DD-MM-YYYY").isSame(moment(), "day") && (
//                               <td className="px-4 py-3">
//                                 <button onClick={() => handleDelete(dateItem.id)}>
//                                   <FontAwesomeIcon icon={faTrash} />
//                                 </button>
//                               </td>
//                             )}
//                         </tr>
//                       ));
//                     })}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500">No reports found for the selected date range.</p>
//       )}
//     </div>
//   );
// };

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const navigate = useNavigate();
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [error, setError] = useState(null);

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((reportItem) => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//               existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || "";
//             });
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (err) {
//       console.error("Error occurred:", err);
//       setError("Failed to fetch report data. Please try again.");
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//     setPage(1);
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/deleteReport/${id}`);
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         fetchReportData();
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (evals, reviews, id) => {
//     const evaluation = evals[id] || "";
//     const review = reviews[id] || "";
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review,
//         teamLeaderReview: review,
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData();
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       {error && <div className="text-red-500 mb-4">{error}</div>}
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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {userType === "Admin" || userType === "developerAdmin" ? (
//         <EmployeeReportListTable
//           reportData={reportData}
//           evaluations={evaluations}
//           teamLeaderReviews={teamLeaderReviews}
//           employees={employees}
//           selectedEmployee={selectedEmployee}
//           handleDelete={handleDelete}
//           handleSaveEvaluationReview={handleSaveEvaluationReview}
//           userType={userType}
//           page={page}
//           maxDisplayCount={maxDisplayCount}
//         />
//       ) : (
//         <EmployeeReportListTableEmployee
//           reportData={reportData}
//           evaluations={evaluations}
//           teamLeaderReviews={teamLeaderReviews}
//           handleDelete={handleDelete}
//           userType={userType}
//         />
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations and teamLeaderReviews with existing report data
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//               existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//             });
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//         teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData(); // Refresh after save to update data
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//                 <option value="All">Select Employee</option>
//                 {employees.map((employeeName, index) => (
//                   <option key={index} value={employeeName}>
//                     {employeeName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* New column */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               // Ensure that detailItem.createdAt is available before attempting to format it
//                               const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A"; // Format createdAt
//                               const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {createdAt}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Admin" ? (
//                                             <div className="">
//                                               {teamLeaderReviews[reportItem.id] || "No review available"}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={teamLeaderReviews[reportItem.id] || ""}
//                                               onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Team Leader Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                       {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {detailItem.created_at ? moment(detailItem.created_at).format("HH:mm A") : 'N/A'}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                   <div className="border rounded p-1 bg-gray-100">
//                                     {evaluations[detailItem.id] || "No admin review available."}
//                                   </div>
//                                 </td>
//                                 {/* Team Leader Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                     <div className="border rounded p-1 bg-gray-100">
//                                       {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                     </div>
//                                   </td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [evaluations, setEvaluations] = useState({});
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//   const [reviews, setReviews] = useState({});
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");

//   const fetchReportData = async () => {
//     try {
//       const payload = {
//         domain: "Development",
//         page: page.toString(),
//         limit: maxDisplayCount,
//         fromDate,
//         toDate,
//       };

//       const apiEndpoint =
//         userType === "Admin"
//           ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//           : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//       const response = await axios.post(apiEndpoint, payload);
//       const { status, data, totalRecords } = response.data;

//       if (status === "Success") {
//         setTotalRecords(totalRecords);
//         setReportData(data || []);

//         // Initialize evaluations and teamLeaderReviews with existing report data
//         if (userType === "Admin") {
//           const employeeNames = [
//             ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);

//           const existingEvaluations = {};
//           const existingTeamLeaderReviews = {};

//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//               existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//             });
//           });
//           setEvaluations(existingEvaluations);
//           setTeamLeaderReviews(existingTeamLeaderReviews);
//         }
//       } else {
//         setReportData([]);
//       }
//     } catch (error) {
//       console.error("Error occurred:", error);
//       setReportData([]);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/addEmployee`);
//       if (response.data.status === "Success") {
//         setEmployees(response.data.employees); // Store employee list in state
//       }
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     fetchReportData(); // Fetch reports data on component mount or state changes
//     // eslint-disable-next-line
//   }, [fromDate, toDate, page, maxDisplayCount]);

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//         fetchReportData(); // Refresh the data after deletion
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handleSaveEvaluationReview = async (id) => {
//     const evaluation = evaluations[id] || "";
//     const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//     try {
//       const payload = {
//         id,
//         evaluation,
//         review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//         teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//       };
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Evaluation and Review saved successfully");
//         fetchReportData(); // Refresh after save to update data
//       } else {
//         alert("Failed to save Evaluation and Review.");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation and review:", error);
//       alert("An error occurred while saving.");
//     }
//   };

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
//             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//               Select Employee:
//             </label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//             >
//               <option value="All">All</option>
//               {employees.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeName}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           )}
//         </div>
//       </div>

//       {(userType === "Admin" || userType === "developerAdmin") ? (
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//               <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* New column */}
//                     <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reports = dateItem.reports || [];
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reports
//                             .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                             .map(reportItem => {
//                               const reportDetails = reportItem.reportDetails || [];
//                               // Ensure that detailItem.createdAt is available before attempting to format it
//                               const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A"; // Format createdAt
//                               const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                               return reportDetails.map((detailItem, detailIndex) => {
//                                 const subcategories = detailItem.subCategory || [];

//                                 return (
//                                   <React.Fragment key={detailIndex}>
//                                     {subcategories.map((subCategoryItem, subCatIndex) => (
//                                       <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                         {subCatIndex === 0 && detailIndex === 0 && (
//                                           <>
//                                             {/* Serial Number */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {serialNo++}
//                                             </td>
//                                             {/* Report Date */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportDate}
//                                             </td>
//                                              {/* Report Time */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {createdAt}
//                                             </td>
//                                             {/* Employee Name */}
//                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                               {reportItem.name || "N/A"}
//                                             </td>
//                                           </>
//                                         )}
//                                         {/* Project Name */}
//                                         {subCatIndex === 0 && (
//                                           <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                             {detailItem.projectName || "N/A"}
//                                           </td>
//                                         )}
//                                         {/* Subcategory */}
//                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                         {/* Report */}
//                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                         {/* Admin Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Employee" ? (
//                                             <div className="border rounded p-1 bg-gray-100">
//                                               {evaluations[reportItem.id] || "No admin review available."}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={evaluations[reportItem.id] || ""}
//                                               onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Admin Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Team Leader Review */}
//                                         <td className="border px-6 py-4">
//                                           {userType === "Admin" ? (
//                                             <div className="">
//                                               {teamLeaderReviews[reportItem.id] || "No review available"}
//                                             </div>
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={teamLeaderReviews[reportItem.id] || ""}
//                                               onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                               className="border rounded p-1"
//                                               placeholder="Add Team Leader Review"
//                                             />
//                                           )}
//                                         </td>
//                                         {/* Action Buttons */}
//                                         <td className="border px-6 py-4">
//                                           <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                   </React.Fragment>
//                                 );
//                               });
//                             })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       ) : (
//         // Employee View Table
//         <div className="my-5">
//           {reportData.length > 0 ? (
//             <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//               <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                   <tr>
//                     <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                     <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                     <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                     <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                     <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                     {userType === "employee" && (
//                       <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(() => {
//                     let serialNo = 1; // Serial number counter
//                     return reportData.map((dateItem, dateIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                       const reportDetails = dateItem.reportDetails || [];

//                       return (
//                         <React.Fragment key={dateIndex}>
//                           {reportDetails.map((detailItem, detailIndex) => {
//                             const subcategories = detailItem.subCategory || [];

//                             return subcategories.map((subCategoryItem, subCatIndex) => (
//                               <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                   <>
//                                     {/* Serial Number */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {serialNo++}
//                                     </td>
//                                     {/* Report Date */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {reportDate}
//                                     </td>
//                                       {/* Report Time - Created At */}
//                                     <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                       {detailItem.created_at ? moment(detailItem.created_at).format("HH:mm A") : 'N/A'}
//                                     </td>
//                                   </>
//                                 )}
//                                 {/* Project Name */}
//                                 {subCatIndex === 0 && (
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                 )}
//                                 {/* Subcategory */}
//                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                 {/* Report */}
//                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                 {/* Admin Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                   <div className="border rounded p-1 bg-gray-100">
//                                     {evaluations[detailItem.id] || "No admin review available."}
//                                   </div>
//                                 </td>
//                                 {/* Team Leader Review (Read-only for Employee) */}
//                                 <td className="border px-6 py-4">
//                                     <div className="border rounded p-1 bg-gray-100">
//                                       {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                     </div>
//                                   </td>
//                                {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                        moment(),
//                                                        "day"
//                                                      ) && (
//                                                    <td className="px-4 py-3">
//                                                    <button onClick={() => handleDelete(dateItem.id)}>
//                                                      <FontAwesomeIcon icon={faTrash} />
//                                                    </button>
//                                                  </td>
//                                                    )}
//                               </tr>
//                             ));
//                           })}
//                         </React.Fragment>
//                       );
//                     });
//                   })()}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500">No reports found for the selected date range.</p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
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
//           onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, userType } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [evaluations, setEvaluations] = useState({});
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//     const [reviews, setReviews] = useState({});
//     const navigate = useNavigate();

//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [employeeList, setEmployeeList] = useState([]); // Added to store employee list

//     useEffect(() => {
//         const fetchEmployeeList = async () => {
//             try {
//                 const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//                 if (response.data.status === 'Success') {
//                     setEmployeeList(response.data.data);
//                 }
//             } catch (err) {
//                 console.error('Error fetching employee list:', err);
//             }
//         };
//         fetchEmployeeList();
//     }, []);

//     const fetchReportData = async () => {
//         try {
//             const payload = {
//                 domain: "Development",
//                 page: page.toString(),
//                 limit: maxDisplayCount,
//                 fromDate,
//                 toDate,
//             };

//             const apiEndpoint =
//                 userType === "Admin"
//                     ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                     : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//             const response = await axios.post(apiEndpoint, payload);
//             const { status, data, totalRecords } = response.data;

//             if (status === "Success") {
//                 setTotalRecords(totalRecords);
//                 setReportData(data || []);

//                 // Initialize evaluations and teamLeaderReviews with existing report data
//                 if (userType === "Admin") {
//                     const employeeNames = [
//                         ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);

//                     const existingEvaluations = {};
//                     const existingTeamLeaderReviews = {};

//                     data.forEach(dateItem => {
//                         dateItem.reports.forEach(reportItem => {
//                             existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//                             existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//                         });
//                     });
//                     setEvaluations(existingEvaluations);
//                     setTeamLeaderReviews(existingTeamLeaderReviews);
//                 }
//             } else {
//                 setReportData([]);
//             }
//         } catch (error) {
//             console.error("Error occurred:", error);
//             setReportData([]);
//         }
//     };

//     const fetchEmployees = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/addEmployee`);
//             if (response.data.status === "Success") {
//                 setEmployees(response.data.employees); // Store employee list in state
//             }
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     useEffect(() => {
//         fetchReportData(); // Fetch reports data on component mount or state changes
//         // eslint-disable-next-line
//     }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//             );
//             if (response.data.status === "Success") {
//                 alert("Record deleted successfully");
//                 // Optionally, you could update the state or refresh the table
//                 fetchReportData(); // Refresh the data after deletion
//             } else {
//                 alert("Failed to delete record");
//             }
//         } catch (error) {
//             console.error("Error deleting record:", error);
//             alert("An error occurred while deleting the record");
//         }
//     };

//     const handleSaveEvaluationReview = async (id) => {
//         const evaluation = evaluations[id] || "";
//         const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//         try {
//             const payload = {
//                 id,
//                 evaluation,
//                 review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//                 teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//             };
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Evaluation and Review saved successfully");
//                 fetchReportData(); // Refresh after save to update data
//             } else {
//                 alert("Failed to save Evaluation and Review.");
//             }
//         } catch (error) {
//             console.error("Error saving evaluation and review:", error);
//             alert("An error occurred while saving.");
//         }
//     };

//     const styles = {
//         column: {
//             marginBottom: '1rem',
//             display: 'flex',
//             flexDirection: 'column',
//             marginRight: '1rem',
//         },
//         label: {
//             fontWeight: 'bold',
//             marginBottom: '0.5rem',
//         },
//         input: {
//             padding: '0.5rem',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '1rem',
//             width: '200px',
//             height: '30px', // Reduced height
//         },
//     };

//     return (
//         <div className="container mx-auto">
//             <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Employee Report</h5>
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">

//                     <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700">Start Date:</label>
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                         style={styles.input} // Apply reduced height
//                     />
//                     <label htmlFor="toDate" className="mr-2 text-sm text-gray-700">End Date:</label>
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                         style={styles.input} // Apply reduced height
//                     />
//                     <div style={styles.column}>
//                         <label style={styles.label}>Select Employee:</label>
//                         <select
//                             style={styles.input}
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.target.value)}
//                         >
//                             <option value="All">All</option>
//                             {employeeList.map((emp) => (
//                                 <option key={emp.employeeId} value={emp.employeeName}>
//                                     {emp.employeeName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                 </div>
//             </div>

//             {(userType === "Admin" || userType === "developerAdmin") ? (
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//                             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* New column */}
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(() => {
//                                         let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                                         return reportData.map((dateItem, dateIndex) => {
//                                             const reports = dateItem.reports || [];
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                                             return (
//                                                 <React.Fragment key={dateIndex}>
//                                                     {reports
//                                                         .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                                         .map(reportItem => {
//                                                             const reportDetails = reportItem.reportDetails || [];
//                                                             // Ensure that detailItem.createdAt is available before attempting to format it
//                                                             const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A"; // Format createdAt
//                                                             const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                                                             return reportDetails.map((detailItem, detailIndex) => {
//                                                                 const subcategories = detailItem.subCategory || [];

//                                                                 return (
//                                                                     <React.Fragment key={detailIndex}>
//                                                                         {subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                                                                     <>
//                                                                                         {/* Serial Number */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {serialNo++}
//                                                                                         </td>
//                                                                                         {/* Report Date */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {reportDate}
//                                                                                         </td>
//                                                                                         {/* Report Time */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {createdAt}
//                                                                                         </td>
//                                                                                         {/* Employee Name */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {reportItem.name || "N/A"}
//                                                                                         </td>
//                                                                                     </>
//                                                                                 )}
//                                                                                 {/* Project Name */}
//                                                                                 {subCatIndex === 0 && (
//                                                                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                                         {detailItem.projectName || "N/A"}
//                                                                                     </td>
//                                                                                 )}
//                                                                                 {/* Subcategory */}
//                                                                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                                 {/* Report */}
//                                                                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                                                 {/* Admin Review */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     {userType === "Employee" ? (
//                                                                                         <div className="border rounded p-1 bg-gray-100">
//                                                                                             {evaluations[reportItem.id] || "No admin review available."}
//                                                                                         </div>
//                                                                                     ) : (
//                                                                                         <input
//                                                                                             type="text"
//                                                                                             value={evaluations[reportItem.id] || ""}
//                                                                                             onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                                                                             className="border rounded p-1"
//                                                                                             placeholder="Add Admin Review"
//                                                                                         />
//                                                                                     )}
//                                                                                 </td>
//                                                                                 {/* Team Leader Review */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     {userType === "Admin" ? (
//                                                                                         <div className="">
//                                                                                             {teamLeaderReviews[reportItem.id] || "No review available"}
//                                                                                         </div>
//                                                                                     ) : (
//                                                                                         <input
//                                                                                             type="text"
//                                                                                             value={teamLeaderReviews[reportItem.id] || ""}
//                                                                                             onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                                                                             className="border rounded p-1"
//                                                                                             placeholder="Add Team Leader Review"
//                                                                                         />
//                                                                                     )}
//                                                                                 </td>
//                                                                                 {/* Action Buttons */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         ))}
//                                                                     </React.Fragment>
//                                                                 );
//                                                             });
//                                                         })}
//                                                 </React.Fragment>
//                                             );
//                                         });
//                                     })()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             ) : (
//                 // Employee View Table
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//                             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                                         {userType === "employee" && (
//                                             <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                                         )}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(() => {
//                                         let serialNo = 1; // Serial number counter
//                                         return reportData.map((dateItem, dateIndex) => {
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                                             const reportDetails = dateItem.reportDetails || [];

//                                             return (
//                                                 <React.Fragment key={dateIndex}>
//                                                     {reportDetails.map((detailItem, detailIndex) => {
//                                                         const subcategories = detailItem.subCategory || [];

//                                                         return subcategories.map((subCategoryItem, subCatIndex) => (
//                                                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                                                     <>
//                                                                         {/* Serial Number */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {serialNo++}
//                                                                         </td>
//                                                                         {/* Report Date */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {reportDate}
//                                                                         </td>
//                                                                         {/* Report Time - Created At */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {detailItem.created_at ? moment(detailItem.created_at).format("HH:mm A") : 'N/A'}
//                                                                         </td>
//                                                                     </>
//                                                                 )}
//                                                                 {/* Project Name */}
//                                                                 {subCatIndex === 0 && (
//                                                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                         {detailItem.projectName || "N/A"}
//                                                                     </td>
//                                                                 )}
//                                                                 {/* Subcategory */}
//                                                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                 {/* Report */}
//                                                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                                 {/* Admin Review (Read-only for Employee) */}
//                                                                 <td className="border px-6 py-4">
//                                                                     <div className="border rounded p-1 bg-gray-100">
//                                                                         {evaluations[detailItem.id] || "No admin review available."}
//                                                                     </div>
//                                                                 </td>
//                                                                 {/* Team Leader Review (Read-only for Employee) */}
//                                                                 <td className="border px-6 py-4">
//                                                                     <div className="border rounded p-1 bg-gray-100">
//                                                                         {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                                                     </div>
//                                                                 </td>
//                                                                 {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                                     moment(),
//                                                                     "day"
//                                                                 ) && (
//                                                                     <td className="px-4 py-3">
//                                                                         <button onClick={() => handleDelete(dateItem.id)}>
//                                                                             <FontAwesomeIcon icon={faTrash} />
//                                                                         </button>
//                                                                     </td>
//                                                                 )}
//                                                             </tr>
//                                                         ));
//                                                     })}
//                                                 </React.Fragment>
//                                             );
//                                         });
//                                     })()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-4">
//                 <button
//                     onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//                     disabled={page === 1}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {page} of {totalPages}
//                 </span>
//                 <button
//                     onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//                     disabled={page === totalPages}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default EmployeeReportList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, userType } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [evaluations, setEvaluations] = useState({});
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
//     const [reviews, setReviews] = useState({});
//     const navigate = useNavigate();

//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [employeeList, setEmployeeList] = useState([]); // Added to store employee list

//     useEffect(() => {
//         const fetchEmployeeList = async () => {
//             try {
//                 const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//                 if (response.data.status === 'Success') {
//                     setEmployeeList(response.data.data);
//                 }
//             } catch (err) {
//                 console.error('Error fetching employee list:', err);
//             }
//         };
//         fetchEmployeeList();
//     }, []);

//     const fetchReportData = async () => {
//         try {
//             const payload = {
//                 domain: "Development",
//                 page: page.toString(),
//                 limit: maxDisplayCount,
//                 fromDate,
//                 toDate,
//             };

//             const apiEndpoint =
//                 userType === "Admin"
//                     ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                     : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//             const response = await axios.post(apiEndpoint, payload);
//             const { status, data, totalRecords } = response.data;

//             if (status === "Success") {
//                 setTotalRecords(totalRecords);
//                 setReportData(data || []);

//                 // Initialize evaluations and teamLeaderReviews with existing report data
//                 if (userType === "Admin") {
//                     const employeeNames = [
//                         ...new Set(data.flatMap(report => report.reports.map(reportItem => reportItem.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);

//                     const existingEvaluations = {};
//                     const existingTeamLeaderReviews = {};

//                     data.forEach(dateItem => {
//                         dateItem.reports.forEach(reportItem => {
//                             existingEvaluations[reportItem.id] = reportItem.evaluation || "";
//                             existingTeamLeaderReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
//                         });
//                     });
//                     setEvaluations(existingEvaluations);
//                     setTeamLeaderReviews(existingTeamLeaderReviews);
//                 }
//             } else {
//                 setReportData([]);
//             }
//         } catch (error) {
//             console.error("Error occurred:", error);
//             setReportData([]);
//         }
//     };

//     const fetchEmployees = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/addEmployee`);
//             if (response.data.status === "Success") {
//                 setEmployees(response.data.employees); // Store employee list in state
//             }
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     useEffect(() => {
//         fetchReportData(); // Fetch reports data on component mount or state changes
//         // eslint-disable-next-line
//     }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//             );
//             if (response.data.status === "Success") {
//                 alert("Record deleted successfully");
//                 // Optionally, you could update the state or refresh the table
//                 fetchReportData(); // Refresh the data after deletion
//             } else {
//                 alert("Failed to delete record");
//             }
//         } catch (error) {
//             console.error("Error deleting record:", error);
//             alert("An error occurred while deleting the record");
//         }
//     };

//     const handleSaveEvaluationReview = async (id) => {
//         const evaluation = evaluations[id] || "";
//         const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
//         try {
//             const payload = {
//                 id,
//                 evaluation,
//                 review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
//                 teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
//             };
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Evaluation and Review saved successfully");
//                 fetchReportData(); // Refresh after save to update data
//             } else {
//                 alert("Failed to save Evaluation and Review.");
//             }
//         } catch (error) {
//             console.error("Error saving evaluation and review:", error);
//             alert("An error occurred while saving.");
//         }
//     };

//     const styles = {
//         column: {
//             marginBottom: '1rem',
//             display: 'flex',
//             flexDirection: 'column',
//             marginRight: '1rem',
//         },
//         label: {
//             // fontWeight: 'bold',  // Removed bold
//             marginBottom: '0.5rem',
//         },
//         input: {
//             padding: '0.75rem',  // Increased padding for larger text boxes
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '1rem',
//             width: '200px',
//             height: '35px', // Reduced height
//         },
//         select: {  // Style for the select dropdown
//             padding: '0.75rem', // Increased padding
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '1rem',
//             width: '240px',   // Increased width
//             height: '35px',
//         },
//     };

//     return (
//         <div className="container mx-auto">
//             <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Employee Report</h5>
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">

//                     <label htmlFor="fromDate" className="mr-2 text-sm text-gray-700"></label>
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                         style={styles.input} // Apply reduced height
//                     />
//                     <label htmlFor="toDate" className="mr-2 text-sm text-gray-700"></label>
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//                         style={styles.input} // Apply reduced height
//                     />
//                   <div style={styles.column}>
//                        <label htmlFor="employee" style={styles.label}>Select Employee:</label>
//                       <select
//                           id="employee"
//                           style={styles.select}
//                           value={selectedEmployee}
//                           onChange={(e) => setSelectedEmployee(e.target.value)}
//                       >
//                           <option value="All">All</option>
//                           {employeeList.map((emp) => (
//                               <option key={emp.employeeId} value={emp.employeeName}>
//                                   {emp.employeeName}
//                               </option>
//                           ))}
//                       </select>
//                   </div>

//                 </div>
//             </div>

//             {(userType === "Admin" || userType === "developerAdmin") ? (
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: '470px' }}>
//                             <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* New column */}
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(() => {
//                                         let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
//                                         return reportData.map((dateItem, dateIndex) => {
//                                             const reports = dateItem.reports || [];
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");

//                                             return (
//                                                 <React.Fragment key={dateIndex}>
//                                                     {reports
//                                                         .filter(reportItem => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                                         .map(reportItem => {
//                                                             const reportDetails = reportItem.reportDetails || [];
//                                                             // Ensure that detailItem.createdAt is available before attempting to format it
//                                                             const createdAt = reportItem.created_at ? moment(reportItem.created_at).format("HH:mm A") : "N/A"; // Format createdAt
//                                                             const updatedAt = reportItem.updatedAt ? moment(reportItem.updatedAt).format("HH:mm") : "N/A"; // Format updatedAt

//                                                             return reportDetails.map((detailItem, detailIndex) => {
//                                                                 const subcategories = detailItem.subCategory || [];

//                                                                 return (
//                                                                     <React.Fragment key={detailIndex}>
//                                                                         {subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                                                                     <>
//                                                                                         {/* Serial Number */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {serialNo++}
//                                                                                         </td>
//                                                                                         {/* Report Date */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {reportDate}
//                                                                                         </td>
//                                                                                         {/* Report Time */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {createdAt}
//                                                                                         </td>
//                                                                                         {/* Employee Name */}
//                                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                             {reportItem.name || "N/A"}
//                                                                                         </td>
//                                                                                     </>
//                                                                                 )}
//                                                                                 {/* Project Name */}
//                                                                                 {subCatIndex === 0 && (
//                                                                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                                         {detailItem.projectName || "N/A"}
//                                                                                     </td>
//                                                                                 )}
//                                                                                 {/* Subcategory */}
//                                                                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                                 {/* Report */}
//                                                                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                                                 {/* Admin Review */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     {userType === "Employee" ? (
//                                                                                         <div className="border rounded p-1 bg-gray-100">
//                                                                                             {evaluations[reportItem.id] || "No admin review available."}
//                                                                                         </div>
//                                                                                     ) : (
//                                                                                         <input
//                                                                                             type="text"
//                                                                                             value={evaluations[reportItem.id] || ""}
//                                                                                             onChange={e => setEvaluations({ ...evaluations, [reportItem.id]: e.target.value })}
//                                                                                             className="border rounded p-1"
//                                                                                             placeholder="Add Admin Review"
//                                                                                         />
//                                                                                     )}
//                                                                                 </td>
//                                                                                 {/* Team Leader Review */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     {userType === "Admin" ? (
//                                                                                         <div className="">
//                                                                                             {teamLeaderReviews[reportItem.id] || "No review available"}
//                                                                                         </div>
//                                                                                     ) : (
//                                                                                         <input
//                                                                                             type="text"
//                                                                                             value={teamLeaderReviews[reportItem.id] || ""}
//                                                                                             onChange={e => setTeamLeaderReviews({ ...teamLeaderReviews, [reportItem.id]: e.target.value })}
//                                                                                             className="border rounded p-1"
//                                                                                             placeholder="Add Team Leader Review"
//                                                                                         />
//                                                                                     )}
//                                                                                 </td>
//                                                                                 {/* Action Buttons */}
//                                                                                 <td className="border px-6 py-4">
//                                                                                     <button onClick={() => handleSaveEvaluationReview(reportItem.id)} className="bg-blue-500 text-white px-2 rounded">Save</button>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         ))}
//                                                                     </React.Fragment>
//                                                                 );
//                                                             });
//                                                         })}
//                                                 </React.Fragment>
//                                             );
//                                         });
//                                     })()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             ) : (
//                 // Employee View Table
//                 <div className="my-5">
//                     {reportData.length > 0 ? (
//                         <div className="overflow-auto" style={{ maxHeight: '430px' }}>
//                             <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                                     <tr>
//                                         <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                                         <th className="border px-4 py-2" style={{ width: "180px" }}>Time</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                                         <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                                         <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Admin Review</th>
//                                         <th className="border px-4 py-2" style={{ width: "350px" }}>Team Leader Review</th> {/* Team Leader Review Column */}
//                                         {userType === "employee" && (
//                                             <th className="border px-4 py-2" style={{ width: "50px" }}>Delete</th>
//                                         )}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(() => {
//                                         let serialNo = 1; // Serial number counter
//                                         return reportData.map((dateItem, dateIndex) => {
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY"); // Formatting date
//                                             const reportDetails = dateItem.reportDetails || [];

//                                             return (
//                                                 <React.Fragment key={dateIndex}>
//                                                     {reportDetails.map((detailItem, detailIndex) => {
//                                                         const subcategories = detailItem.subCategory || [];

//                                                         return subcategories.map((subCategoryItem, subCatIndex) => (
//                                                             <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                 {subCatIndex === 0 && detailIndex === 0 && (
//                                                                     <>
//                                                                         {/* Serial Number */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {serialNo++}
//                                                                         </td>
//                                                                         {/* Report Date */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {reportDate}
//                                                                         </td>
//                                                                         {/* Report Time - Created At */}
//                                                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                             {detailItem.created_at ? moment(detailItem.created_at).format("HH:mm A") : 'N/A'}
//                                                                         </td>
//                                                                     </>
//                                                                 )}
//                                                                 {/* Project Name */}
//                                                                 {subCatIndex === 0 && (
//                                                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                         {detailItem.projectName || "N/A"}
//                                                                     </td>
//                                                                 )}
//                                                                 {/* Subcategory */}
//                                                                 <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                 {/* Report */}
//                                                                 <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                                 {/* Admin Review (Read-only for Employee) */}
//                                                                 <td className="border px-6 py-4">
//                                                                     <div className="border rounded p-1 bg-gray-100">
//                                                                         {evaluations[detailItem.id] || "No admin review available."}
//                                                                     </div>
//                                                                 </td>
//                                                                 {/* Team Leader Review (Read-only for Employee) */}
//                                                                 <td className="border px-6 py-4">
//                                                                     <div className="border rounded p-1 bg-gray-100">
//                                                                         {teamLeaderReviews[detailItem.id] || "No team leader review available."}
//                                                                     </div>
//                                                                 </td>
//                                                                 {userType === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                                                                     moment(),
//                                                                     "day"
//                                                                 ) && (
//                                                                     <td className="px-4 py-3">
//                                                                         <button onClick={() => handleDelete(dateItem.id)}>
//                                                                             <FontAwesomeIcon icon={faTrash} />
//                                                                         </button>
//                                                                     </td>
//                                                                 )}
//                                                             </tr>
//                                                         ));
//                                                     })}
//                                                 </React.Fragment>
//                                             );
//                                         });
//                                     })()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No reports found for the selected date range.</p>
//                     )}
//                 </div>
//             )}

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-4">
//                 <button
//                     onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
//                     disabled={page === 1}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {page} of {totalPages}
//                 </span>
//                 <button
//                     onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
//                     disabled={page === totalPages}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default EmployeeReportList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
const navigate = useNavigate();
const { isAuth, userData } = useSelector((state) => state.login);
 useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);
  const employeeId = userData?.employeeId ?? null;
  const userType = userData?.userType ?? null;
  
  //const employeeId = userData ? userData.employeeId : null;
  //const { employeeId, userType } = useSelector((state) => state.login.userData);
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(25);
  const [evaluations, setEvaluations] = useState({});
  const [teamLeaderReviews, setTeamLeaderReviews] = useState({}); // State for Team Leader Reviews
  const [reviews, setReviews] = useState({});
  

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [employeeList, setEmployeeList] = useState([]); // Added to store employee list

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

  const fetchReportData = async () => {
    try {
      const payload = {
        domain: "Development",
        page: page.toString(),
        limit: maxDisplayCount,
        fromDate,
        toDate,
      };

      const apiEndpoint =
        userType === "Admin"
          ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
          : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

      const response = await axios.post(apiEndpoint, payload);
      const { status, data, totalRecords } = response.data;

      if (status === "Success") {
        setTotalRecords(totalRecords);
        setReportData(data || []);

        // Initialize evaluations and teamLeaderReviews with existing report data
        if (userType === "Admin") {
          const employeeNames = [
            ...new Set(
              data.flatMap((report) =>
                report.reports.map((reportItem) => reportItem.name)
              )
            ),
          ];
          setEmployees(["All", ...employeeNames]);

          const existingEvaluations = {};
          const existingTeamLeaderReviews = {};

          data.forEach((dateItem) => {
            dateItem.reports.forEach((reportItem) => {
              existingEvaluations[reportItem.id] = reportItem.evaluation || "";
              existingTeamLeaderReviews[reportItem.id] =
                reportItem.teamLeaderReview || ""; // Populate teamLeaderReviews
            });
          });
          setEvaluations(existingEvaluations);
          setTeamLeaderReviews(existingTeamLeaderReviews);
        }
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setReportData([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/addEmployee`
      );
      if (response.data.status === "Success") {
        setEmployees(response.data.employees); // Store employee list in state
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchReportData(); // Fetch reports data on component mount or state changes
    // eslint-disable-next-line
  }, [fromDate, toDate, page, maxDisplayCount, selectedEmployee]);

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalRecords / maxDisplayCount);
  const today = new Date().toISOString().split("T")[0];

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
      );
      if (response.data.status === "Success") {
        alert("Record deleted successfully");
        // Optionally, you could update the state or refresh the table
        fetchReportData(); // Refresh the data after deletion
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record");
    }
  };

  const handleSaveEvaluationReview = async (id) => {
    const evaluation = evaluations[id] || "";
    const review = reviews[id] || ""; // this is not being used anymore, we will use teamLeaderReviews
    try {
      const payload = {
        id,
        evaluation,
        review, // This is being sent for backward compatibility, but teamLeaderReview is the relevant one now
        teamLeaderReview: teamLeaderReviews[id] || "", // Send teamLeaderReview
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/post_emp_report`,
        payload
      );
      if (response.data.status === "Success") {
        alert("Evaluation and Review saved successfully");
        fetchReportData(); // Refresh after save to update data
      } else {
        alert("Failed to save Evaluation and Review.");
      }
    } catch (error) {
      console.error("Error saving evaluation and review:", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <div className="container mx-auto">
      <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">
        Employee Report
      </h5>
      <div
        data-rangepicker
        className="my-4 flex flex-col sm:flex-row items-center"
      >
        <div className="flex flex-col sm:flex-row">
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
          <div className="flex items-center">
            <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
              Select Employee:
            </label>
            <select
              id="employee"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              style={{ width: "240px" }}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="All">All</option>
              {employeeList.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeName}>
                  {emp.employeeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {userType === "Admin" || userType === "developerAdmin" ? (
        <div className="my-5">
          {reportData.length > 0 ? (
            <div className="overflow-auto" style={{ maxHeight: "470px" }}>
              <table
                className="w-full text-sm text-left rtl:text-right text-gray-500"
                style={{ minWidth: "2000px" }}
              >
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>
                      S/No
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Date
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Time
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Employee Name
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Project Name
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Product
                    </th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>
                      Report
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Admin Review
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Team Leader Review
                    </th>{" "}
                    {/* New column */}
                    <th
                      className="border px-4 py-2"
                      style={{ width: "50px" }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = (page - 1) * maxDisplayCount + 1; // Serial number logic
                    return reportData.map((dateItem, dateIndex) => {
                      const reports = dateItem.reports || [];
                      const reportDate = moment(
                        dateItem.reportDate,
                        "DD-MMM-YYYY"
                      ).format("DD-MM-YYYY");

                      return (
                        <React.Fragment key={dateIndex}>
                          {reports
                            .filter(
                              (reportItem) =>
                                selectedEmployee === "All" ||
                                reportItem.name === selectedEmployee
                            )
                            .map((reportItem) => {
                              const reportDetails =
                                reportItem.reportDetails || [];
                              // Ensure that detailItem.createdAt is available before attempting to format it
                              const createdAt = reportItem.created_at
                                ? moment(reportItem.created_at).format(
                                    "HH:mm A"
                                  )
                                : "N/A"; // Format createdAt
                              const updatedAt = reportItem.updatedAt
                                ? moment(reportItem.updatedAt).format("HH:mm")
                                : "N/A"; // Format updatedAt

                              return reportDetails.map(
                                (detailItem, detailIndex) => {
                                  const subcategories =
                                    detailItem.subCategory || [];

                                  return (
                                    <React.Fragment key={detailIndex}>
                                      {subcategories.map(
                                        (subCategoryItem, subCatIndex) => (
                                          <tr
                                            key={subCatIndex}
                                            className="bg-white border-b hover:bg-gray-50"
                                          >
                                            {subCatIndex === 0 &&
                                              detailIndex === 0 && (
                                                <>
                                                  {/* Serial Number */}
                                                  <td
                                                    className="border px-6 py-4"
                                                    rowSpan={reportDetails.reduce(
                                                      (acc, curr) =>
                                                        acc +
                                                        curr.subCategory.length,
                                                      0
                                                    )}
                                                  >
                                                    {serialNo++}
                                                  </td>
                                                  {/* Report Date */}
                                                  <td
                                                    className="border px-6 py-4"
                                                    rowSpan={reportDetails.reduce(
                                                      (acc, curr) =>
                                                        acc +
                                                        curr.subCategory.length,
                                                      0
                                                    )}
                                                  >
                                                    {reportDate}
                                                  </td>
                                                  {/* Report Time */}
                                                  <td
                                                    className="border px-6 py-4"
                                                    rowSpan={reportDetails.reduce(
                                                      (acc, curr) =>
                                                        acc +
                                                        curr.subCategory.length,
                                                      0
                                                    )}
                                                  >
                                                    {createdAt}
                                                  </td>
                                                  {/* Employee Name */}
                                                  <td
                                                    className="border px-6 py-4"
                                                    rowSpan={reportDetails.reduce(
                                                      (acc, curr) =>
                                                        acc +
                                                        curr.subCategory.length,
                                                      0
                                                    )}
                                                  >
                                                    {reportItem.name || "N/A"}
                                                  </td>
                                                </>
                                              )}
                                            {/* Project Name */}
                                            {subCatIndex === 0 && (
                                              <td
                                                className="border px-6 py-4"
                                                rowSpan={subcategories.length}
                                              >
                                                {detailItem.projectName ||
                                                  "N/A"}
                                              </td>
                                            )}
                                            {/* Subcategory */}
                                            <td className="border px-6 py-4">
                                              {subCategoryItem.subCategoryName ||
                                                "N/A"}
                                            </td>
                                            {/* Report */}
                                            <td className="border px-6 py-4">
                                              {subCategoryItem.report ||
                                                "No report available."}
                                            </td>
                                            {/* Admin Review */}
                                            <td className="border px-6 py-4">
                                              {userType === "Employee" ? (
                                                <div className="border rounded p-1 bg-gray-100">
                                                  {evaluations[reportItem.id] ||
                                                    "No admin review available."}
                                                </div>
                                              ) : (
                                                <input
                                                  type="text"
                                                  value={
                                                    evaluations[
                                                      reportItem.id
                                                    ] || ""
                                                  }
                                                  onChange={(e) =>
                                                    setEvaluations({
                                                      ...evaluations,
                                                      [reportItem.id]:
                                                        e.target.value,
                                                    })
                                                  }
                                                  className="border rounded p-1"
                                                  placeholder="Add Admin Review"
                                                />
                                              )}
                                            </td>
                                            {/* Team Leader Review */}
                                            <td className="border px-6 py-4">
                                              {userType === "Admin" ? (
                                                <div className="">
                                                  {teamLeaderReviews[
                                                    reportItem.id
                                                  ] || "No review available"}
                                                </div>
                                              ) : (
                                                <input
                                                  type="text"
                                                  value={
                                                    teamLeaderReviews[
                                                      reportItem.id
                                                    ] || ""
                                                  }
                                                  onChange={(e) =>
                                                    setTeamLeaderReviews({
                                                      ...teamLeaderReviews,
                                                      [reportItem.id]:
                                                        e.target.value,
                                                    })
                                                  }
                                                  className="border rounded p-1"
                                                  placeholder="Add Team Leader Review"
                                                />
                                              )}
                                            </td>
                                            {/* Action Buttons */}
                                            <td className="border px-6 py-4">
                                              <button
                                                onClick={() =>
                                                  handleSaveEvaluationReview(
                                                    reportItem.id
                                                  )
                                                }
                                                className="bg-blue-500 text-white px-2 rounded"
                                              >
                                                Save
                                              </button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </React.Fragment>
                                  );
                                }
                              );
                            })}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No reports found for the selected date range.
            </p>
          )}
        </div>
      ) : (
        // Employee View Table
        <div className="my-5">
          {reportData.length > 0 ? (
            <div className="overflow-auto" style={{ maxHeight: "430px" }}>
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
                  <tr>
                    <th className="border px-4 py-2" style={{ width: "50px" }}>
                      S/No
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Date
                    </th>
                    <th className="border px-4 py-2" style={{ width: "180px" }}>
                      Time
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Project Name
                    </th>
                    <th className="border px-4 py-2" style={{ width: "150px" }}>
                      Subcategory
                    </th>
                    <th className="border px-4 py-2" style={{ width: "500px" }}>
                      Report
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Admin Review
                    </th>
                    <th className="border px-4 py-2" style={{ width: "350px" }}>
                      Team Leader Review
                    </th>{" "}
                    {/* Team Leader Review Column */}
                    {userType === "employee" && (
                      <th
                        className="border px-4 py-2"
                        style={{ width: "50px" }}
                      >
                        Delete
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let serialNo = 1; // Serial number counter
                    return reportData.map((dateItem, dateIndex) => {
                      const reportDate = moment(
                        dateItem.reportDate,
                        "DD-MMM-YYYY"
                      ).format("DD-MM-YYYY"); // Formatting date
                      const reportDetails = dateItem.reportDetails || [];

                      return (
                        <React.Fragment key={dateIndex}>
                          {reportDetails.map((detailItem, detailIndex) => {
                            const subcategories = detailItem.subCategory || [];

                            return subcategories.map(
                              (subCategoryItem, subCatIndex) => (
                                <tr
                                  key={subCatIndex}
                                  className="bg-white border-b hover:bg-gray-50"
                                >
                                  {subCatIndex === 0 && detailIndex === 0 && (
                                    <>
                                      {/* Serial Number */}
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {serialNo++}
                                      </td>
                                      {/* Report Date */}
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {reportDate}
                                      </td>
                                      {/* Report Time - Created At */}
                                      <td
                                        className="border px-6 py-4"
                                        rowSpan={reportDetails.reduce(
                                          (acc, curr) =>
                                            acc + curr.subCategory.length,
                                          0
                                        )}
                                      >
                                        {detailItem.created_at
                                          ? moment(
                                              detailItem.created_at
                                            ).format("HH:mm A")
                                          : "N/A"}
                                      </td>
                                    </>
                                  )}
                                  {/* Project Name */}
                                  {subCatIndex === 0 && (
                                    <td
                                      className="border px-6 py-4"
                                      rowSpan={subcategories.length}
                                    >
                                      {detailItem.projectName || "N/A"}
                                    </td>
                                  )}
                                  {/* Subcategory */}
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.subCategoryName || "N/A"}
                                  </td>
                                  {/* Report */}
                                  <td className="border px-6 py-4">
                                    {subCategoryItem.report ||
                                      "No report available."}
                                  </td>
                                  {/* Admin Review (Read-only for Employee) */}
                                  <td className="border px-6 py-4">
                                    <div className="border rounded p-1 bg-gray-100">
                                      {evaluations[detailItem.id] ||
                                        "No admin review available."}
                                    </div>
                                  </td>
                                  {/* Team Leader Review (Read-only for Employee) */}
                                  <td className="border px-6 py-4">
                                    <div className="border rounded p-1 bg-gray-100">
                                      {teamLeaderReviews[detailItem.id] ||
                                        "No team leader review available."}
                                    </div>
                                  </td>
                                  {userType === "employee" &&
                                    moment(reportDate, "DD-MM-YYYY").isSame(
                                      moment(),
                                      "day"
                                    ) && (
                                      <td className="px-4 py-3">
                                        <button
                                          onClick={() =>
                                            handleDelete(dateItem.id)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                      </td>
                                    )}
                                </tr>
                              )
                            );
                          })}
                        </React.Fragment>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No reports found for the selected date range.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
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
