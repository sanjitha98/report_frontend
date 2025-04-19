// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]); // State to store unique employee names
//   const [selectedEmployee, setSelectedEmployee] = useState("All"); // Set default to "All"
//   const [reviewData, setReviewData] = useState(null);
//   const [reviewText, setReviewText] = useState("");

//   const handleReviewClick = (id) => {
//     const updatedReview = prompt("Enter the updated review:");
  
//       const payload = {
//         review: updatedReview  
//       };
  
//       console.log("Sending Payload:", payload);  
  
//       axios.post(`${process.env.REACT_APP_API_URL}/updateReview/${id}`, payload)
//         .then(response => {
//           console.log(response.data.message); 
//         })
//         .catch(error => {
//           console.error("Error updating the review:", error.response ? error.response.data : error);
//         });
  
//   };
  
  
  
//   const handleReviewUpdate = async () => {
//     if (!reviewText.trim()) return;

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/updateReview`, {
//         method: "POST",
//         body: JSON.stringify({ id: reviewData.reportId, review: reviewText }),
//       });

//       const result = await response.json();
//       if (result.status === "Success") {
//         alert("Review updated successfully!");
//         setReviewData(null);
//       } else {
//         alert("Error updating review");
//       }
//     } catch (error) {
//       console.error("Error updating review:", error);
//       alert("Error updating review");
//     }
//   };

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
//         designation === "Sr. Technical Head"  
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

//         if(designation === "Sr. Technical Head" ){
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]); 
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
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

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
//          {designation === "Sr. Technical Head" && (
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
//       {designation === "Sr. Technical Head" || designation === "developerAdmin" ? (       
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
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>Review</th>
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
//             const id = reportItem.id || "N/A";
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
//                     <td className="border px-6 py-4">
//                       <button onClick={() => handleReviewClick(id)}>
//                         Update Review
//                       </button>
//                 {/*      { id} */}
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
//                                 {/* {designation === "employee" && moment(reportDate, "DD-MM-YYYY").isSame(
//                         moment(),
//                         "day"
//                       ) && (
//                       <td className="px-4 py-3">
//                         <button onClick={() => handleEdit(dateItem.id)}>
//                           <FontAwesomeIcon icon={faEdit} />
//                         </button>
//                       </td>
//                     )} */}
//                     {designation === "employee" || "Employee" && moment(reportDate, "DD-MM-YYYY").isSame(
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
//       )} {reviewData && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
//             <h3 className="text-xl mb-4">Update Review</h3>
//             <textarea
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//               rows="4"
//               className="w-full border p-2 rounded-md"
//               placeholder="Write your review here"
//             />
//             <div className="mt-4 text-right">
//               <button onClick={handleReviewUpdate} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                 Update Review
//               </button>
//               <button onClick={() => setReviewData(null)} className="ml-2 px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
//                 Cancel
//               </button>
//             </div>
//           </div>
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
//   const { employeeId, designation, userType } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]); 
//   const [selectedEmployee, setSelectedEmployee] = useState("All"); 
//   const [reviewText, setReviewText] = useState("");
//   const [selectedReportId, setSelectedReportId] = useState(null); // Track selected report ID for review

//   const handleReviewUpdate = async () => {
//     if (!reviewText.trim() || !selectedReportId) return;

//     const payload = {
//       id: selectedReportId,
//       time: "9.30 am", // You can customize this or get it from the context
//       evaluation: "Good", // Similarly, this can be customized
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//         setSelectedReportId(null);
//         setReviewText("");
//         // Optionally, refetch or update reportData here
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

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
//           designation === "Sr. Technical Head"
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

//         if (designation === "Sr. Technical Head") {
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]); 
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
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

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
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {designation === "Sr. Technical Head" || designation === "developerAdmin" ? (
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
//                     <th className="border px-4 py-2">Admin Review</th>
//                     {designation === "Sr. Technical Head" && (
//                       <th className="border px-4 py-2">Team Leader Review</th>
//                     )}
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
//                               const id = reportItem.id || "N/A";
//                               const reportDetails = reportItem.reportDetails || [];
//                               const adminReview = reportItem.adminReview || "N/A"; // Assuming adminReview is fetched
//                               const teamLeaderReview = reportItem.teamLeaderReview || ""; // Editable review for Sr. Technical Head

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
//                                         <td className="border px-6 py-4">
//                                           {/* Admin Review Column */}
//                                           <input
//                                             type="text"
//                                             value={adminReview}
//                                             readOnly 
//                                             className="border border-gray-300 rounded-lg p-2 w-full"
//                                           />
//                                         </td>
//                                         {designation === "Sr. Technical Head" && (
//                                           <td className="border px-6 py-4">
//                                             <input
//                                               type="text"
//                                               value={teamLeaderReview}
//                                               onChange={(e) => {
//                                                 setReviewText(e.target.value);
//                                                 setSelectedReportId(id); // Store the ID for saving
//                                               }}
//                                               className="border border-gray-300 rounded-lg p-2 w-full"
//                                             />
//                                             <button onClick={handleReviewUpdate} className="ml-2 text-blue-500">
//                                               Save
//                                             </button>
//                                           </td>
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
//                 <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ height: '50px', overflowY: 'hidden' }}>
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
//                                 <td className="px-4 py-3">
//                                   <button onClick={() => handleDelete(dateItem.id)}>
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
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || "";
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head") {
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]);
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
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id];
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       time: "9.30 am",
//       evaluation: "Good",
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: '470px' }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2" style={{ width: "50px" }}>S/No</th>
//                 <th className="border px-4 py-2" style={{ width: "180px" }}>Date</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Employee Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Project Name</th>
//                 <th className="border px-4 py-2" style={{ width: "150px" }}>Subcategory</th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>Report</th>
//                 <th className="border px-4 py-2" style={{ width: "500px" }}>Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2" style={{ width: "500px" }}>Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];
//                         const adminReview = reportItem.adminReview || "N/A";
//                         const teamLeaderReview = teamLeaderReviews[id] || "";

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && detailIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={adminReview}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReview}
//                                         onChange={(e) => {
//                                           setTeamLeaderReviews((prev) => ({
//                                             ...prev,
//                                             [id]: e.target.value
//                                           }));
//                                         }}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           data.forEach(dateItem => {
//             dateItem.reports.forEach(reportItem => {
//               initialReviews[reportItem.id] = {
//                 teamLeaderReview: reportItem.teamLeaderReview || "",
//                 adminReview: reportItem.adminReview || "",
//               };
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head") {
//           if (data && Array.isArray(data)) {
//             const employeeNames = [
//               ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//             ];
//             setEmployees(["All", ...employeeNames]);
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
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewData = teamLeaderReviews[id];
//     if (!reviewData || !id) return;

//     const payload = {
//       id,
//       evaluation: reviewData.adminReview, // Admin review from the saved state
//       review: reviewData.teamLeaderReview, // Team leader review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: '470px' }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={teamLeaderReviews[id]?.adminReview || ""}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id]?.teamLeaderReview || ""}
//                                         onChange={(e) => {
//                                           setTeamLeaderReviews((prev) => ({
//                                             ...prev,
//                                             [id]: {
//                                               ...prev[id],
//                                               teamLeaderReview: e.target.value
//                                             }
//                                           }));
//                                         }}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // use an empty string if undefined
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id];
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       evaluation: reviewText, // Assume reviewText is used as the evaluation reference
//       review: reviewText, // Team Leader Review Column
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
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

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.adminReview || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => {
//                                           setTeamLeaderReviews((prev) => ({
//                                             ...prev,
//                                             [id]: e.target.value, // Update team leader review
//                                           }));
//                                         }}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // use an empty string if undefined
//             });
//           });
//           setTeamLeaderReviews(initialReviews); // Set the initial reviews here
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id];
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       evaluation: reviewText, // Assume reviewText is used as the evaluation reference
//       review: reviewText, // Team Leader Review Column
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
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

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.adminReview || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => {
//                                           setTeamLeaderReviews((prev) => ({
//                                             ...prev,
//                                             [id]: e.target.value, // Update team leader review
//                                           }));
//                                         }}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           if (data && data.length > 0) {
//             data.forEach((dateItem) => {
//               dateItem.reports.forEach((reportItem) => {
//                 initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // use an empty string if undefined
//               });
//             });
//           }
//           setTeamLeaderReviews(initialReviews); // Set the initial reviews here
//         } else {
//           setReportData([]);
//         }

//         // Set employees if the user is Sr. Technical Head
//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id];
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       evaluation: reviewText, // Assuming this is the value you'll send
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
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

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.review || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     /* <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => {
//                                           setTeamLeaderReviews((prev) => ({
//                                             ...prev,
//                                             [id]: e.target.value, // Update team leader review
//                                           }));
//                                         }}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       /> 
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>*/
//                                     <td className="border px-6 py-4">{reportItem.evaluation || "No report available."}</td>


//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         // Create payload
//         const payload = {
//           domain: "Development",
//           page: page.toString(),
//           limit: maxDisplayCount,
//           fromDate,
//           toDate,
//         };

//         // Determine API endpoint based on designation
//         const apiEndpoint =
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         // Send request
//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews state from fetched data
//           const initialReviews = {};
//           if (data && data.length > 0) {
//             data.forEach((dateItem) => {
//               dateItem.reports.forEach((reportItem) => {
//                 initialReviews[reportItem.id] = {
//                   evaluation: reportItem.teamLeaderReview || "", // Save review text
//                   review: reportItem.review || "" // If any existing review
//                 };
//               });
//             });
//           }
//           setTeamLeaderReviews(initialReviews); // Set the initial reviews here
//         } else {
//           setReportData([]);
//         }

//         // Set employees if the user is Sr. Technical Head
//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const { evaluation, review } = teamLeaderReviews[id] || {};
//     if (!evaluation || !id) return;

//     const payload = {
//       id,
//       evaluation, // Send evaluation text
//       review, // Add review if necessary
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, fieldName, value) => {
//     setTeamLeaderReviews((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [fieldName]: value,
//       },
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.review || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id]?.evaluation || ""}
//                                         onChange={(e) => handleInputChange(id, 'evaluation', e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     // Initialize teamLeaderReviews state from fetched data
//                     const initialReviews = {};
//                     if (data && data.length > 0) {
//                         data.forEach((dateItem) => {
//                             dateItem.reports.forEach((reportItem) => {
//                                 initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Initialize review text
//                             });
//                         });
//                     }
//                     setTeamLeaderReviews(initialReviews); // Set the initial reviews here
//                 } else {
//                     setReportData([]);
//                 }

//                 // Set employees if the user is Sr. Technical Head
//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleReviewUpdate = async (id) => {
//         const reviewText = teamLeaderReviews[id]; // Get the review text
//         if (!reviewText || !id) return; // Ensure there's something to save

//         // Construct the payload
//         const payload = {
//             id,
//             evaluation: reportData.find(item => item.reports.some(r => r.id === id))?.reports.find(r => r.id === id).evaluation || "",
//             review: reviewText // Send the sanitized review text
//         };

//         try {
//             const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//             if (response.data.status === "Success") {
//                 alert("Review submitted successfully!");
//             } else {
//                 alert("Error submitting review");
//             }
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             alert("Error submitting review");
//         }
//     };

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else if (e.target.name === "toDate") {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handleInputChange = (id, value) => {
//         // Sanitize input by trimming leading/trailing whitespace and removing quotes
//         const sanitizedValue = value.trim().replace(/^["']|["']$/g, ''); // Remove leading/trailing quotes if they exist
//         setTeamLeaderReviews(prev => ({
//             ...prev,
//             [id]: sanitizedValue,
//         }));
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     return (
//         <div className="container mx-auto">
//             {/* Date Range Selectors */}
//             <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {/* Report Data Table */}
//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                             <tr>
//                                 <th className="border px-4 py-2">S/No</th>
//                                 <th className="border px-4 py-2">Date</th>
//                                 <th className="border px-4 py-2">Employee Name</th>
//                                 <th className="border px-4 py-2">Project Name</th>
//                                 <th className="border px-4 py-2">Subcategory</th>
//                                 <th className="border px-4 py-2">Report</th>
//                                 <th className="border px-4 py-2">Admin Review</th>
//                                 {designation === "Sr. Technical Head" && (
//                                     <th className="border px-4 py-2">Team Leader Review</th>
//                                 )}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return (
//                                     <React.Fragment key={dateIndex}>
//                                         {reports
//                                             .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                             .map((reportItem, reportIndex) => {
//                                                 const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                                 const employeeName = reportItem.name || "N/A";
//                                                 const id = reportItem.id || "N/A";
//                                                 const reportDetails = reportItem.reportDetails || [];

//                                                 return reportDetails.map((detailItem, detailIndex) => {
//                                                     const subcategories = detailItem.subCategory || [];
//                                                     return (
//                                                         <React.Fragment key={detailIndex}>
//                                                             {subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <>
//                                                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                 {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                                                             </td>
//                                                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                 {reportDate}
//                                                                             </td>
//                                                                             <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                                 {employeeName}
//                                                                             </td>
//                                                                         </>
//                                                                     )}
//                                                                     <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                         {detailItem.projectName || "N/A"}
//                                                                     </td>
//                                                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                                     <td className="border px-6 py-4">
//                                                                         <input
//                                                                             type="text"
//                                                                             value={reportItem.review || "N/A"}
//                                                                             readOnly
//                                                                             className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                         />
//                                                                     </td>
//                                                                     {designation === "Sr. Technical Head" && (
//                                                                         <td className="border px-6 py-4">
//                                                                             <input
//                                                                                 type="text"
//                                                                                 value={teamLeaderReviews[id] || ""}
//                                                                                 onChange={(e) => handleInputChange(id, e.target.value)}
//                                                                                 className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                             />
//                                                                             <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                                                                 Save
//                                                                             </button>
//                                                                         </td>
//                                                                     )}
//                                                                 </tr>
//                                                             ))}
//                                                         </React.Fragment>
//                                                     );
//                                                 });
//                                             })}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
//             )}

//             {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Initialize review text
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]; 
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reportData.find(item => item.reports.some(r => r.id === id))?.reports.find(r => r.id === id).review || "",
//       review: reviewText
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(), // Always trim input text for cleanliness
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.review || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Initialize review text
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]; 
//     if (!reviewText || !id) return;

//     // Get evaluation if needed, otherwise empty string
//     const review = reportData.find(item => item.reports.some(r => r.id === id))?.reports.find(r => r.id === id).review || "";

//     const payload = {
//       id,
//      // This sends the current evaluation if you need it; omit it otherwise
//       review: reviewText // Update the review to the value typed by the Team Leader
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Review submitted successfully!");
//       } else {
//         alert("Error submitting review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(), // Always trim input text for cleanliness
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.review || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.teamLeaderReview || ""; // Initialize review text
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]; 
//     if (!reviewText || !id) return;

//     // Prepare payload with the id and the review entered by the Team Leader
//     const payload = {
//       id,
//       review: reviewText // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.review || "N/A"}
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]; 
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th> {/* This now refers to the evaluation field */}
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th> 
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]; 
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 {designation === "Sr. Technical Head" && (
//                   <th className="border px-4 py-2">Team Leader Review</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                       <button onClick={() => handleReviewUpdate(id)} className="ml-2 text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Team Leader Review Input Field */}
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={teamLeaderReviews[id] || ""}
//                                       onChange={(e) => handleInputChange(id, e.target.value)}
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Save Button in Separate Column */}
//                                   <td className="border px-6 py-4">
//                                     <button onClick={() => handleReviewUpdate(id)} className="text-blue-500">
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Team Leader Review Input Field */}
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={teamLeaderReviews[id] || ""}
//                                       onChange={(e) => handleInputChange(id, e.target.value)}
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Save Button in Separate Column */}
//                                   <td className="border px-6 py-4">
//                                     <button onClick={() => handleReviewUpdate(id)} className="text-blue-500">
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Team Leader Review Input Field */}
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     ) : (
//                                       <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                     )}
//                                   </td>
//                                   {/* Save Button in Separate Column */}
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <button onClick={() => handleReviewUpdate(id)} className="text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           // Initialize teamLeaderReviews based on API data
//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id]?.trim(); // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 {designation === "Sr. Technical Head" && <th className="border px-4 py-2">Action</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                     {detailItem.projectName || "N/A"}
//                                   </td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     <input
//                                       type="text"
//                                       value={reportItem.evaluation || "N/A"} 
//                                       readOnly
//                                       className="border border-gray-300 rounded-lg p-2 w-full"
//                                     />
//                                   </td>
//                                   {/* Team Leader Review Input Field */}
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     ) : (
//                                       <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                     )}
//                                   </td>
//                                   {/* Save Button in Separate Column */}
//                                   {designation === "Sr. Technical Head" && (
//                                     <td className="border px-6 py-4">
//                                       <button onClick={() => handleReviewUpdate(id)} className="text-blue-500">
//                                         Save
//                                       </button>
//                                     </td>
//                                   )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//             {reportData.map((dateItem, dateIndex) => {
//   const reports = dateItem.reports || [];
//   return (
//     <React.Fragment key={dateIndex}>
//       {reports
//         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//         .map((reportItem, reportIndex) => {
//           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//           const employeeName = reportItem.name || "N/A";
//           const id = reportItem.id || "N/A";
//           const reportDetails = reportItem.reportDetails || [];

//           return reportDetails.map((detailItem, detailIndex) => {
//             const subcategories = detailItem.subCategory || [];
//             const hasData = subcategories.length > 0; // Check if subcategories have data

//             return (
//               <React.Fragment key={detailIndex}>
//                 {hasData ? (
//                   subcategories.map((subCategoryItem, subCatIndex) => (
//                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                       {subCatIndex === 0 && reportIndex === 0 && (
//                         <>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                           </td>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {reportDate}
//                           </td>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {employeeName}
//                           </td>
//                         </>
//                       )}
//                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                         {detailItem.projectName || "N/A"}
//                       </td>
//                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                       <td className="border px-6 py-4">
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={teamLeaderReviews[id] || ""}
//                             onChange={(e) => handleInputChange(id, e.target.value)}
//                             className="border border-gray-300 rounded-lg p-2 w-full"
//                           />
//                         ) : (
//                           <span>{teamLeaderReviews[id] || "No review available."}</span>
//                         )}
//                       </td>
//                       <td className="border px-6 py-4">
//                         <input
//                           type="text"
//                           value={reportItem.evaluation || "N/A"} 
//                           onChange={(e) => {}}
//                           readOnly={true}
//                           className="border border-gray-300 rounded-lg p-2 w-full"
//                         />
//                         {designation === "Sr. Technical Head" && (
//                           <button
//                             onClick={() => handleReviewUpdate(id)}
//                             className="mt-2 text-blue-500"
//                           >
//                             Save
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   // When there's no data in Project Name, Subcategory, or Report
//                   <tr className="bg-white border-b hover:bg-gray-50">
//                     <td colSpan={7} className="border px-6 py-4 text-center">
//                       No Data Found
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           });
//         })}
//     </React.Fragment>
//   );
// })}

//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500">No reports found for the selected date range.</p>
//       )}

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);
  
//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 {/* <th className="border px-4 py-2">Admin Review</th> */}
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//             {reportData.map((dateItem, dateIndex) => {
//   const reports = dateItem.reports || [];
//   return (
//     <React.Fragment key={dateIndex}>
//       {reports
//         .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//         .map((reportItem, reportIndex) => {
//           const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//           const employeeName = reportItem.name || "N/A";
//           const id = reportItem.id || "N/A";
//           const reportDetails = reportItem.reportDetails || [];

//           return reportDetails.map((detailItem, detailIndex) => {
//             const subcategories = detailItem.subCategory || [];
//             const hasData = subcategories.length > 0; // Check if subcategories have data

//             return (
//               <React.Fragment key={detailIndex}>
//                 {hasData ? (
//                   subcategories.map((subCategoryItem, subCatIndex) => (
//                     <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                       {subCatIndex === 0 && reportIndex === 0 && (
//                         <>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
//                           </td>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {reportDate}
//                           </td>
//                           <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                             {employeeName}
//                           </td>
//                         </>
//                       )}
//                       <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                         {detailItem.projectName || "N/A"}
//                       </td>
//                       <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                       <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                       <td className="border px-6 py-4">
//                         {designation === "Sr. Technical Head" ? (
//                           <input
//                             type="text"
//                             value={teamLeaderReviews[id] || ""}
//                             onChange={(e) => handleInputChange(id, e.target.value)}
//                             className="border border-gray-300 rounded-lg p-2 w-full"
//                           />
//                         ) : (
//                           <span>{teamLeaderReviews[id] || "No review available."}</span>
//                         )}
//                       </td>
//                       <td className="border px-6 py-4">
//                         <input
//                           type="text"
//                           value={reportItem.evaluation || "N/A"} 
//                           onChange={(e) => {}}
//                           readOnly={true}
//                           className="border border-gray-300 rounded-lg p-2 w-full"
//                         />
//                         {designation === "Sr. Technical Head" && (
//                           <button
//                             onClick={() => handleReviewUpdate(id)}
//                             className="mt-2 text-blue-500"
//                           >
//                             Save
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   // When there's no data in Project Name, Subcategory, or Report
//                   <tr className="bg-white border-b hover:bg-gray-50">
//                     <td colSpan={7} className="border px-6 py-4 text-center">
//                       No Data Found
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           });
//         })}
//     </React.Fragment>
//   );
// })}

//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-gray-500">No reports found for the selected date range.</p>
//       )}

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; // Trim the text and handle null or undefined cases
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, // This is for the Team Leader Review
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     // Ensure to trim the string to prevent leading/trailing whitespace
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           const hasData = subcategories.length > 0; // Check if subcategories have data

//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {hasData ? (
//                                 subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {((page - 1) * maxDisplayCount) + (dateIndex * reports.length + (reportIndex + 1))}
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
//                                     <td className="border px-6 py-4">
//                                       {designation === "Sr. Technical Head" ? (
//                                         <input
//                                           type="text"
//                                           value={teamLeaderReviews[id] || ""}
//                                           onChange={(e) => handleInputChange(id, e.target.value)}
//                                           className="border border-gray-300 rounded-lg p-2 w-full"
//                                         />
//                                       ) : (
//                                         <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                       )}
//                                     </td>
//                                     <td className="border px-6 py-4">
//                                       {designation === "Sr. Technical Head" && (
//                                         <button
//                                           onClick={() => handleReviewUpdate(id)}
//                                           className="mt-2 text-blue-500"
//                                         >
//                                           Save
//                                         </button>
//                                       )}
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 // When there's no data in Project Name, Subcategory, or Report
//                                 <tr className="bg-white border-b hover:bg-gray-50">
//                                   <td colSpan={7} className="border px-6 py-4 text-center">
//                                     No Data Found
//                                   </td>
//                                 </tr>
//                               )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : ''; 
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText, 
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews(prev => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       {/* Date Range Selectors */}
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {/* Report Data Table */}
//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" /> {/* Empty header for Save button column */}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {reports
//                       .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                       .map((reportItem, reportIndex) => {
//                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                         const employeeName = reportItem.name || "N/A";
//                         const id = reportItem.id || "N/A";
//                         const reportDetails = reportItem.reportDetails || [];

//                         return reportDetails.map((detailItem, detailIndex) => {
//                           const subcategories = detailItem.subCategory || [];
//                           const hasData = subcategories.length > 0; // Check if subcategories have data

//                           return (
//                             <React.Fragment key={detailIndex}>
//                               {hasData ? (
//                                 subcategories.map((subCategoryItem, subCatIndex) => (
//                                   <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                       <>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {reportDate}
//                                         </td>
//                                         <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                           {employeeName}
//                                         </td>
//                                       </>
//                                     )}
//                                     <td className="border px-6 py-4">{detailItem.projectName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                     <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                     <td className="border px-6 py-4">
//                                       {designation === "Sr. Technical Head" ? (
//                                         <input
//                                           type="text"
//                                           value={teamLeaderReviews[id] || ""}
//                                           onChange={(e) => handleInputChange(id, e.target.value)}
//                                           className="border border-gray-300 rounded-lg p-2 w-full"
//                                         />
//                                       ) : (
//                                         <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                       )}
//                                     </td>
//                                     <td className="border px-6 py-4">
//                                       {designation === "Sr. Technical Head" && (
//                                         <button
//                                           onClick={() => handleReviewUpdate(id)}
//                                           className="mt-2 text-blue-500"
//                                         >
//                                           Save
//                                         </button>
//                                       )}
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr className="bg-white border-b hover:bg-gray-50">
//                                   <td colSpan={7} className="border px-6 py-4 text-center">
//                                     No Data Found
//                                   </td>
//                                 </tr>
//                               )}
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

//       {/* Pagination Controls */}
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : '';
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post("http://192.168.2.133:4001/post_emp_report", payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews((prev) => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

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
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" />
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 const filteredReports = reports.filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee);
                
//                 // Calculate total subcategories for each report
//                 const reportSubcategoryCounts = filteredReports.map(reportItem => 
//                   reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                 );

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {filteredReports.map((reportItem, reportIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const employeeName = reportItem.name || "N/A";
//                       const id = reportItem.id || "N/A";
//                       const reportDetails = reportItem.reportDetails || [];
                      
//                       return reportDetails.map((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];
//                         const hasData = subcategories.length > 0;

//                         // Use the count of subcategories to determine how rows should be spanned
//                         const subcategoryCount = subcategories.length;

//                         return (
//                           <React.Fragment key={detailIndex}>
//                             {hasData ? (
//                               subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4">{detailItem.projectName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     ) : (
//                                       <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                     )}
//                                   </td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" && (
//                                       <button
//                                         onClick={() => handleReviewUpdate(id)}
//                                         className="mt-2 text-blue-500"
//                                       >
//                                         Save
//                                       </button>
//                                     )}
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr className="bg-white border-b hover:bg-gray-50">
//                                 <td colSpan={7} className="border px-6 py-4 text-center">
//                                   No Data Found
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         );
//                       });
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : '';
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews((prev) => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

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
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" />
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 const filteredReports = reports.filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee);
                
//                 // Calculate total subcategories for each report
//                 const reportSubcategoryCounts = filteredReports.map(reportItem => 
//                   reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                 );

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {filteredReports.map((reportItem, reportIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const employeeName = reportItem.name || "N/A";
//                       const id = reportItem.id || "N/A";
//                       const reportDetails = reportItem.reportDetails || [];
                      
//                       return reportDetails.map((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];
//                         const hasData = subcategories.length > 0;

//                         // Use the count of subcategories to determine how rows should be spanned
//                         const subcategoryCount = subcategories.length;

//                         return (
//                           <React.Fragment key={detailIndex}>
//                             {hasData ? (
//                               subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4">{detailItem.projectName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     ) : (
//                                       <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                     )}
//                                   </td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" && (
//                                       <button
//                                         onClick={() => handleReviewUpdate(id)}
//                                         className="mt-2 text-blue-500"
//                                       >
//                                         Save
//                                       </button>
//                                     )}
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr className="bg-white border-b hover:bg-gray-50">
//                                 <td colSpan={7} className="border px-6 py-4 text-center">
//                                   No Data Found
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         );
//                       });
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || ""; // Initialize review text for Team Leader Review
//             });
//           });
//           setTeamLeaderReviews(initialReviews);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : '';
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews((prev) => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

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
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Time</th> {/* New Time Column */}
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" />
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 const filteredReports = reports.filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee);

//                 // Calculate total subcategories for each report
//                 const reportSubcategoryCounts = filteredReports.map(reportItem =>
//                   reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                 );

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {filteredReports.map((reportItem, reportIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const employeeName = reportItem.name || "N/A";
//                       const id = reportItem.id || "N/A";
//                       const reportDetails = reportItem.reportDetails || [];
//                       const reportTime = moment(reportItem.created_at).format("HH:mm A"); // Extract and format the time

//                       return reportDetails.map((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];
//                         const hasData = subcategories.length > 0;

//                         // Use the count of subcategories to determine how rows should be spanned
//                         const subcategoryCount = subcategories.length;

//                         return (
//                           <React.Fragment key={detailIndex}>
//                             {hasData ? (
//                               subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportTime}
//                                       </td> {/* Display the time */}
//                                       <td className="border px-6 py-4" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-4">{detailItem.projectName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" ? (
//                                       <input
//                                         type="text"
//                                         value={teamLeaderReviews[id] || ""}
//                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     ) : (
//                                       <span>{teamLeaderReviews[id] || "No review available."}</span>
//                                     )}
//                                   </td>
//                                   <td className="border px-6 py-4">
//                                     {designation === "Sr. Technical Head" && (
//                                       <button
//                                         onClick={() => handleReviewUpdate(id)}
//                                         className="mt-2 text-blue-500"
//                                       >
//                                         Save
//                                       </button>
//                                     )}
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr className="bg-white border-b hover:bg-gray-50">
//                                 <td colSpan={7} className="border px-6 py-4 text-center">
//                                   No Data Found
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         );
//                       });
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

// const EmployeeReportList = () => {
//   const { employeeId, designation } = useSelector((state) => state.login.userData);

//   const [reportData, setReportData] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All");
//   const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//   const [adminReviews, setAdminReviews] = useState({}); // Store admin reviews in a separate state

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
//           designation === "Sr. Technical Head"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecords(totalRecords);
//           setReportData(data || []);

//           const initialReviews = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviews[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setTeamLeaderReviews(initialReviews);

//           const initialReviewsFromServer = {};
//           data.forEach((dateItem) => {
//             dateItem.reports.forEach((reportItem) => {
//               initialReviewsFromServer[reportItem.id] = reportItem.review || "";
//             });
//           });
//           setAdminReviews(initialReviewsFromServer);
//         } else {
//           setReportData([]);
//         }

//         if (designation === "Sr. Technical Head" && data) {
//           const employeeNames = [
//             ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//           ];
//           setEmployees(["All", ...employeeNames]);
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//         setReportData([]);
//       }
//     };

//     if (fromDate && toDate) {
//       fetchReportData();
//     }
//   }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//   const handleReviewUpdate = async (id) => {
//     const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : "";
//     if (!reviewText || !id) return;

//     const payload = {
//       id,
//       review: reviewText,
//     };

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//       if (response.data.status === "Success") {
//         alert("Team Leader review submitted successfully!");
//       } else {
//         alert("Error submitting Team Leader review");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review");
//     }
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else if (e.target.name === "toDate") {
//       setToDate(e.target.value);
//     }
//   };

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleInputChange = (id, value) => {
//     setTeamLeaderReviews((prev) => ({
//       ...prev,
//       [id]: value.trim(),
//     }));
//   };

//   const handleAdminReviewChange = (id, value) => {
//     setAdminReviews((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//           />
//           {designation === "Sr. Technical Head" && (
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
//                 <option value="All">All</option>
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

//       {reportData.length > 0 ? (
//         <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//               <tr>
//                 <th className="border px-4 py-2">S/No</th>
//                 <th className="border px-4 py-2">Date</th>
//                 <th className="border px-4 py-2">Time</th>
//                 <th className="border px-4 py-2">Employee Name</th>
//                 <th className="border px-4 py-2">Project Name</th>
//                 <th className="border px-4 py-2">Subcategory</th>
//                 <th className="border px-4 py-2">Report</th>
//                 <th className="border px-4 py-2">Admin Review</th>
//                 <th className="border px-4 py-2">Team Leader Review</th>
//                 <th className="border px-4 py-2" />
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((dateItem, dateIndex) => {
//                 const reports = dateItem.reports || [];
//                 const filteredReports = reports.filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee);

//                 // Calculate total subcategories for each report
//                 const reportSubcategoryCounts = filteredReports.map(reportItem =>
//                   reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                 );

//                 return (
//                   <React.Fragment key={dateIndex}>
//                     {filteredReports.map((reportItem, reportIndex) => {
//                       const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                       const employeeName = reportItem.name || "N/A";
//                       const id = reportItem.id || "N/A";
//                       const reportDetails = reportItem.reportDetails || [];
//                       const reportTime = moment(reportItem.created_at).format("HH:mm A"); // Extract and format the time

//                       return reportDetails.map((detailItem, detailIndex) => {
//                         const subcategories = detailItem.subCategory || [];
//                         const hasData = subcategories.length > 0;

//                         // Use the count of subcategories to determine how rows should be spanned
//                         const subcategoryCount = subcategories.length;

//                         return (
//                           <React.Fragment key={detailIndex}>
//                             {hasData ? (
//                               subcategories.map((subCategoryItem, subCatIndex) => (
//                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                   {subCatIndex === 0 && reportIndex === 0 && (
//                                     <>
//                                       <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                       </td>
//                                       <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportDate}
//                                       </td>
//                                       <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {reportTime}
//                                       </td>
//                                       <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                         {employeeName}
//                                       </td>
//                                     </>
//                                   )}
//                                   <td className="border px-6 py-2">{detailItem.projectName || "N/A"}</td>
//                                   <td className="border px-6 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                   <td className="border px-6 py-2">{subCategoryItem.report || "No report available."}</td>
//                                   <td className="border px-6 py-2">
//                                     {(designation === "Manager" || designation === "Lead") ? (
//                                       <span>
//                                         {adminReviews[id] || "No review available."}
//                                       </span>
//                                     ) : (
//                                       <input
//                                         type="text"
//                                         value={adminReviews[id] || ""}
//                                         onChange={(e) => handleAdminReviewChange(id, e.target.value)}
//                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                       />
//                                     )}
//                                   </td>
//                                   <td className="border px-6 py-2">
//                                     {(designation === "Sr. Technical Head") && (
//                                       <div className="flex justify-between">
//                                         <span>
//                                           <input
//                                             type="text"
//                                             value={teamLeaderReviews[id] || ""}
//                                             onChange={(e) => handleInputChange(id, e.target.value)}
//                                             className="border border-gray-300 rounded-lg p-2 w-full"
//                                           />
//                                         </span>
//                                         <button
//                                           onClick={() => handleReviewUpdate(id)}
//                                           className="mt-2 text-blue-500"
//                                         >
//                                           Save
//                                         </button>
//                                       </div>
//                                     )}
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr className="bg-white border-b hover:bg-gray-50">
//                                 <td colSpan={7} className="border px-6 py-2 text-center">
//                                   No Data Found
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         );
//                       });
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

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);

//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({}); // Store admin reviews in a separate state

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialReviews = {};
//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialReviews[reportItem.id] = reportItem.review || "";
//                         });
//                     });
//                     setTeamLeaderReviews(initialReviews);

//                     const initialReviewsFromServer = {};
//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialReviewsFromServer[reportItem.id] = reportItem.review || "";
//                         });
//                     });
//                     setAdminReviews(initialReviewsFromServer);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleReviewUpdate = async (id) => {
//         const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : "";
//         if (!reviewText || !id) return;

//         const payload = {
//             id,
//             review: reviewText,
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Team Leader review submitted successfully!");
//             } else {
//                 alert("Error submitting Team Leader review");
//             }
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             alert("Error submitting review");
//         }
//     };

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else if (e.target.name === "toDate") {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handleInputChange = (id, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [id]: value.trim(),
//         }));
//     };

//     const handleAdminReviewChange = (id, value) => {
//         setAdminReviews((prev) => ({
//             ...prev,
//             [id]: value,
//         }));
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                             <tr>
//                                 <th className="border px-4 py-2">S/No</th>
//                                 <th className="border px-4 py-2">Date</th>
//                                 <th className="border px-4 py-2">Time</th>
//                                 <th className="border px-4 py-2">Employee Name</th>
//                                 <th className="border px-4 py-2">Project Name</th>
//                                 <th className="border px-4 py-2">Subcategory</th>
//                                 <th className="border px-4 py-2">Report</th>
//                                 <th className="border px-4 py-2">Admin Review</th>
//                                 <th className="border px-4 py-2">Team Leader Review</th>
//                                 <th className="border px-4 py-2" />
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 const filteredReports = reports.filter(
//                                     (reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee
//                                 );

//                                 // Calculate total subcategories for each report
//                                 const reportSubcategoryCounts = filteredReports.map((reportItem) =>
//                                     reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                                 );

//                                 return (
//                                     <React.Fragment key={dateIndex}>
//                                         {filteredReports.map((reportItem, reportIndex) => {
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                             const employeeName = reportItem.name || "N/A";
//                                             const id = reportItem.id || "N/A";
//                                             const reportDetails = reportItem.reportDetails || [];
//                                             const reportTime = moment(reportItem.created_at).format("HH:mm A"); // Extract and format the time

//                                             return reportDetails.map((detailItem, detailIndex) => {
//                                                 const subcategories = detailItem.subCategory || [];
//                                                 const hasData = subcategories.length > 0;

//                                                 // Use the count of subcategories to determine how rows should be spanned
//                                                 const subcategoryCount = subcategories.length;

//                                                 return (
//                                                     <React.Fragment key={detailIndex}>
//                                                         {hasData ? (
//                                                             subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportDate}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportTime}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {employeeName}
//                                                                             </td>
//                                                                         </>
//                                                                     )}
//                                                                     <td className="border px-6 py-2">{detailItem.projectName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.report || "No report available."}</td>
//                                                                     <td className="border px-6 py-2">
//                                                                         <span>{adminReviews[id] || "No review available."}</span>
//                                                                     </td>
//                                                                     <td className="border px-6 py-2">
//                                                                         <div className="flex justify-between">
//                                                                             <input
//                                                                                 type="text"
//                                                                                 value={teamLeaderReviews[id] || ""}
//                                                                                 onChange={(e) => handleInputChange(id, e.target.value)}
//                                                                                 className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                             />
//                                                                             <button
//                                                                                 onClick={() => handleReviewUpdate(id)}
//                                                                                 className="mt-2 text-blue-500"
//                                                                             >
//                                                                                 Save
//                                                                             </button>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>
//                                                             ))
//                                                         ) : (
//                                                             <tr className="bg-white border-b hover:bg-gray-50">
//                                                                 <td colSpan={7} className="border px-6 py-2 text-center">
//                                                                     No Data Found
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </React.Fragment>
//                                                 );
//                                             });
//                                         })}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
//             )}

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

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);

//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     // Initialize teamLeaderReviews and adminReviews from fetched data
//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || ""; // Assuming adminReview exists in response
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews); // Update adminReviews state
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleReviewUpdate = async (id) => {
//         const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : "";
//         if (!reviewText || !id) return;

//         const payload = {
//             id,
//             review: reviewText,
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Team Leader review submitted successfully!");
//                 // Optionally, refresh the data or update the teamLeaderReviews state immediately
//             } else {
//                 alert("Error submitting Team Leader review");
//             }
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             alert("Error submitting review");
//         }
//     };

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else if (e.target.name === "toDate") {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handleInputChange = (id, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [id]: value.trim(),
//         }));
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     return (
//         <div className="container mx-auto">
//             {/* Date and Employee Selection */}
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {/* Report Table */}
//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                             <tr>
//                                 <th className="border px-4 py-2">S/No</th>
//                                 <th className="border px-4 py-2">Date</th>
//                                 <th className="border px-4 py-2">Time</th>
//                                 <th className="border px-4 py-2">Employee Name</th>
//                                 <th className="border px-4 py-2">Project Name</th>
//                                 <th className="border px-4 py-2">Subcategory</th>
//                                 <th className="border px-4 py-2">Report</th>
//                                 <th className="border px-4 py-2">Admin Review</th>
//                                 <th className="border px-4 py-2">Team Leader Review</th>
//                                 <th className="border px-4 py-2"></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 const filteredReports = reports.filter(
//                                     (reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee
//                                 );

//                                 // Calculate total subcategories for each report
//                                 const reportSubcategoryCounts = filteredReports.map((reportItem) =>
//                                     reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                                 );

//                                 return (
//                                     <React.Fragment key={dateIndex}>
//                                         {filteredReports.map((reportItem, reportIndex) => {
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                             const employeeName = reportItem.name || "N/A";
//                                             const id = reportItem.id || "N/A";
//                                             const reportDetails = reportItem.reportDetails || [];
//                                             const reportTime = moment(reportItem.created_at).format("HH:mm A"); // Extract and format the time

//                                             return reportDetails.map((detailItem, detailIndex) => {
//                                                 const subcategories = detailItem.subCategory || [];
//                                                 const hasData = subcategories.length > 0;

//                                                 // Use the count of subcategories to determine how rows should be spanned
//                                                 const subcategoryCount = subcategories.length;

//                                                 return (
//                                                     <React.Fragment key={detailIndex}>
//                                                         {hasData ? (
//                                                             subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportDate}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportTime}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {employeeName}
//                                                                             </td>
//                                                                         </>
//                                                                     )}
//                                                                     <td className="border px-6 py-2">{detailItem.projectName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.report || "No report available."}</td>
//                                                                     <td className="border px-6 py-2">
//                                                                         {adminReviews[id] || "No review available."}
//                                                                     </td>
//                                                                     <td className="border px-6 py-2">
//                                                                         <input
//                                                                             type="text"
//                                                                             value={teamLeaderReviews[id] || ""}
//                                                                             onChange={(e) => handleInputChange(id, e.target.value)}
//                                                                             className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                         />
//                                                                     </td>
//                                                                     {/* Separate column for the Save button */}
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <td className="border px-4 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                             <button
//                                                                                 onClick={() => handleReviewUpdate(id)}
//                                                                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
//                                                                             >
//                                                                                 Save
//                                                                             </button>
//                                                                         </td>
//                                                                     )}
//                                                                 </tr>
//                                                             ))
//                                                         ) : (
//                                                             <tr className="bg-white border-b hover:bg-gray-50">
//                                                                 <td colSpan={7} className="border px-6 py-2 text-center">
//                                                                     No Data Found
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </React.Fragment>
//                                                 );
//                                             });
//                                         })}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);

//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     // Initialize teamLeaderReviews and adminReviews from fetched data
//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || ""; // Assuming adminReview exists in response
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews); // Update adminReviews state
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleReviewUpdate = async (id) => {
//         const reviewText = teamLeaderReviews[id] ? teamLeaderReviews[id].trim() : "";
//         if (!reviewText || !id) return;

//         const payload = {
//             id,
//             review: reviewText,
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Team Leader review submitted successfully!");
//                 // Optionally, refresh the data or update the teamLeaderReviews state immediately
//             } else {
//                 alert("Error submitting Team Leader review");
//             }
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             alert("Error submitting review");
//         }
//     };

//     const handleDateChange = (e) => {
//         if (e.target.name === "fromDate") {
//             setFromDate(e.target.value);
//         } else if (e.target.name === "toDate") {
//             setToDate(e.target.value);
//         }
//     };

//     const handleEmployeeChange = (e) => {
//         setSelectedEmployee(e.target.value);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handleInputChange = (id, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [id]: value.trim(),
//         }));
//     };

//     const totalPages = Math.ceil(totalRecords / maxDisplayCount);
//     const today = new Date().toISOString().split("T")[0];

//     return (
//         <div className="container mx-auto">
//             {/* Date and Employee Selection */}
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {/* Report Table */}
//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300">
//                             <tr>
//                                 <th className="border px-4 py-2">S/No</th>
//                                 <th className="border px-4 py-2">Date</th>
//                                 <th className="border px-4 py-2">Time</th>
//                                 <th className="border px-4 py-2">Employee Name</th>
//                                 <th className="border px-4 py-2">Project Name</th>
//                                 <th className="border px-4 py-2">Subcategory</th>
//                                 <th className="border px-4 py-2">Report</th>
//                                 <th className="border px-4 py-2">Admin Review</th>
//                                 <th className="border px-4 py-2">Team Leader Review</th>
//                                 <th className="border px-4 py-2"></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 const filteredReports = reports.filter(
//                                     (reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee
//                                 );

//                                 // Calculate total subcategories for each report
//                                 const reportSubcategoryCounts = filteredReports.map((reportItem) =>
//                                     reportItem.reportDetails.reduce((sum, detail) => sum + (detail.subCategory?.length || 0), 0)
//                                 );

//                                 return (
//                                     <React.Fragment key={dateIndex}>
//                                         {filteredReports.map((reportItem, reportIndex) => {
//                                             const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                             const employeeName = reportItem.name || "N/A";
//                                             const id = reportItem.id || "N/A";
//                                             const reportDetails = reportItem.reportDetails || [];
//                                             const reportTime = moment(reportItem.created_at).format("HH:mm A"); // Extract and format the time
//                                             const teamLeaderReviewValue = teamLeaderReviews[id] || "N/A"; // Get review or default to "N/A"

//                                             return reportDetails.map((detailItem, detailIndex) => {
//                                                 const subcategories = detailItem.subCategory || [];
//                                                 const hasData = subcategories.length > 0;

//                                                 // Use the count of subcategories to determine how rows should be spanned
//                                                 const subcategoryCount = subcategories.length;

//                                                 return (
//                                                     <React.Fragment key={detailIndex}>
//                                                         {hasData ? (
//                                                             subcategories.map((subCategoryItem, subCatIndex) => (
//                                                                 <tr key={subCatIndex} className="bg-white border-b hover:bg-gray-50">
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {((page - 1) * maxDisplayCount) + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportDate}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {reportTime}
//                                                                             </td>
//                                                                             <td className="border px-6 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                                 {employeeName}
//                                                                             </td>
//                                                                         </>
//                                                                     )}
//                                                                     <td className="border px-6 py-2">{detailItem.projectName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                                     <td className="border px-6 py-2">{subCategoryItem.report || "No report available."}</td>
//                                                                     <td className="border px-6 py-2">
//                                                                         {adminReviews[id] || "No review available."}
//                                                                     </td>
//                                                                     <td className="border px-6 py-2">
//                                                                         {/* Team Leader Review Input with "N/A" Default */}
//                                                                         <input
//                                                                             type="text"
//                                                                             value={teamLeaderReviewValue !== "N/A" ? teamLeaderReviewValue : ""}
//                                                                             onChange={(e) => handleInputChange(id, e.target.value)}
//                                                                             className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                             placeholder="Enter Review"
//                                                                         />
//                                                                     </td>
//                                                                     {/* Separate column for the Save button */}
//                                                                     {subCatIndex === 0 && reportIndex === 0 && (
//                                                                         <td className="border px-4 py-2" rowSpan={reportSubcategoryCounts[reportIndex]}>
//                                                                             <button
//                                                                                 onClick={() => handleReviewUpdate(id)}
//                                                                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
//                                                                             >
//                                                                                 Save
//                                                                             </button>
//                                                                         </td>
//                                                                     )}
//                                                                 </tr>
//                                                             ))
//                                                         ) : (
//                                                             <tr className="bg-white border-b hover:bg-gray-50">
//                                                                 <td colSpan={7} className="border px-6 py-2 text-center">
//                                                                     No Data Found
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </React.Fragment>
//                                                 );
//                                             });
//                                         })}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const reviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         if (!reviewText || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: reviewText,
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Team Leader review submitted successfully!");
//             } else {
//                 alert("Error submitting Team Leader review");
//             }
//         } catch (error) {
//             console.error("Error submitting review:", error);
//             alert("Error submitting review");
//         }
//     };

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

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "50px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "80px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "500px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "100px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Admin Review (Editable for Admin) */}
//                                                             {designation === "Sr. Technical Head" && (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={adminReviews[id] || ""}
//                                                                     onChange={(e) =>
//                                                                         setAdminReviews((prev) => ({ ...prev, [id]: e.target.value })
//                                                                         )
//                                                                     }
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Admin Review"
//                                                                 />
//                                                             )}
//                                                             {designation !== "Sr. Technical Head" && (adminReviews[id] || "No review available.")}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {designation === "Sr. Technical Head" ? (
//                                                                 <>
//                                                                     <input
//                                                                         type="text"
//                                                                         value={teamLeaderReviews[id] || ""}
//                                                                         onChange={(e) => handleInputChange(id, e.target.value)}
//                                                                         className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                         placeholder="Enter Team Leader Review"
//                                                                     />
//                                                                     <button
//                                                                         onClick={() => handleReviewUpdate(id)}
//                                                                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
//                                                                     >
//                                                                         Save
//                                                                     </button>
//                                                                 </>
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleTeamLeaderInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleAdminInputChange = (reportId, value) => {
//         setAdminReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";

//         if ((!teamLeaderReviewText && !adminReviewText) || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: teamLeaderReviewText,
//             adminReview: adminReviewText,
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Reviews submitted successfully!");
//             } else {
//                 alert("Error submitting reviews");
//             }
//         } catch (error) {
//             console.error("Error submitting reviews:", error);
//             alert("Error submitting reviews");
//         }
//     };

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

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "50px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "80px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "500px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "250px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "250px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "100px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Admin Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={adminReviews[id] || ""}
//                                                                     onChange={(e) =>
//                                                                         handleAdminInputChange(id, e.target.value)
//                                                                     }
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Admin Review"
//                                                                 />
//                                                             )}
//                                                             {designation !== "Sr. Technical Head" && (adminReviews[id] || "No review available.")}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") ? (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={teamLeaderReviews[id] || ""}
//                                                                     onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Team Leader Review"
//                                                                 />
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Save Button (Separate Column) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <button
//                                                                     onClick={() => handleReviewUpdate(id)}
//                                                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleTeamLeaderInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleAdminInputChange = (reportId, value) => {
//         // Admin reviews are now read-only
//         // You can remove this function completely if no other logic is needed.
//         // setAdminReviews((prev) => ({
//         //     ...prev,
//         //     [reportId]: value,
//         // }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         // No need to send adminReview since it's not editable.
//         // const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";
//         const adminReviewText = ""; //  Admin review is not edited

//         if (!teamLeaderReviewText && !adminReviewText || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: teamLeaderReviewText,
//             adminReview: adminReviewText, // Send the admin review (even if empty or unchanged)
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Reviews submitted successfully!");
//             } else {
//                 alert("Error submitting reviews");
//             }
//         } catch (error) {
//             console.error("Error submitting reviews:", error);
//             alert("Error submitting reviews");
//         }
//     };

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

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "70px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "100px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "600px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "400px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "400px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "120px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4" style={{ width: "400px" }}>
//                                                             {/* Admin Review (Non-Editable) */}
//                                                             {adminReviews[id] || "No review available."}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") ? (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={teamLeaderReviews[id] || ""}
//                                                                     onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Team Leader Review"
//                                                                 />
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Save Button (Separate Column) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <button
//                                                                     onClick={() => handleReviewUpdate(id)}
//                                                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     const employeeNames = [
//                         ...new Set(data.flatMap((report) => report.reports.map((employeeReport) => employeeReport.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleTeamLeaderInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleAdminInputChange = (reportId, value) => {
//         // Admin reviews are now read-only
//         // You can remove this function completely if no other logic is needed.
//         // setAdminReviews((prev) => ({
//         //     ...prev,
//         //     [reportId]: value,
//         // }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         // No need to send adminReview since it's not editable.
//         // const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";
//         const adminReviewText = ""; //  Admin review is not edited

//         if (!teamLeaderReviewText && !adminReviewText || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: teamLeaderReviewText,
//             adminReview: adminReviewText, // Send the admin review (even if empty or unchanged)
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Reviews submitted successfully!");
//             } else {
//                 alert("Error submitting reviews");
//             }
//         } catch (error) {
//             console.error("Error submitting reviews:", error);
//             alert("Error submitting reviews");
//         }
//     };

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

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "70px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "600px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "120px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4" style={{ width: "400px" }}>
//                                                             {/* Admin Review (Non-Editable) */}
//                                                             {adminReviews[id] || "No review available."}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") ? (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={teamLeaderReviews[id] || ""}
//                                                                     onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Team Leader Review"
//                                                                     style={{ width: "100%" }} // Increased width of input field
//                                                                 />
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Save Button (Separate Column) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <button
//                                                                     onClick={() => handleReviewUpdate(id)}
//                                                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }

//                 if (designation === "Sr. Technical Head" && data) {
//                     // Extract unique employee names from all reports.  Crucial for "All" functionality.
//                     const employeeNames = [
//                         ...new Set(data.flatMap((dateItem) => dateItem.reports.map((reportItem) => reportItem.name))),
//                     ];
//                     setEmployees(["All", ...employeeNames]);
//                 }
//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation]);

//     const handleTeamLeaderInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleAdminInputChange = (reportId, value) => {
//         // Admin reviews are now read-only
//         // You can remove this function completely if no other logic is needed.
//         // setAdminReviews((prev) => ({
//         //     ...prev,
//         //     [reportId]: value,
//         // }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         // No need to send adminReview since it's not editable.
//         // const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";
//         const adminReviewText = ""; //  Admin review is not edited

//         if (!teamLeaderReviewText && !adminReviewText || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: teamLeaderReviewText,
//             adminReview: adminReviewText, // Send the admin review (even if empty or unchanged)
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Reviews submitted successfully!");
//             } else {
//                 alert("Error submitting reviews");
//             }
//         } catch (error) {
//             console.error("Error submitting reviews:", error);
//             alert("Error submitting reviews");
//         }
//     };

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

//     return (
//         <div className="container mx-auto">
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                             <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                                 Select Employee:
//                             </label>
//                             <select
//                                 id="employee"
//                                 value={selectedEmployee}
//                                 onChange={handleEmployeeChange}
//                                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
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

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "70px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "600px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "120px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4" style={{ width: "400px" }}>
//                                                             {/* Admin Review (Non-Editable) */}
//                                                             {adminReviews[id] || "No review available."}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") ? (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={teamLeaderReviews[id] || ""}
//                                                                     onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Team Leader Review"
//                                                                     style={{ width: "100%" }} // Increased width of input field
//                                                                 />
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Save Button (Separate Column) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <button
//                                                                     onClick={() => handleReviewUpdate(id)}
//                                                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
// import { useNavigate } from "react-router-dom";

// const EmployeeReportList = () => {
//     const { employeeId, designation } = useSelector((state) => state.login.userData);
//     const [reportData, setReportData] = useState([]);
//     const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//     const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [page, setPage] = useState(1);
//     const [maxDisplayCount, setMaxDisplayCount] = useState(25);
//     const navigate = useNavigate();
//     const [employees, setEmployees] = useState([]);  // Now holds all employee names.
//     const [selectedEmployee, setSelectedEmployee] = useState("All");
//     const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
//     const [adminReviews, setAdminReviews] = useState({});
//     const [allEmployees, setAllEmployees] = useState([]); //  Store all employees from separate API call.
//     const [employeeList, setEmployeeList] = useState([]);
//     const styles = {
//         column: {
//             display: 'flex',
//             flexDirection: 'column',
//             marginRight: '10px',
//         },
//         label: {
//             marginBottom: '5px',
//             fontWeight: 'bold',
//         },
//         input: {
//             padding: '8px',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             fontSize: '14px',
//         },
//     };


//     useEffect(() => {
//         // Fetch all employee names
//         const fetchAllEmployees = async () => {
//             if (designation === "Sr. Technical Head") {  // Only fetch if admin
//                 try {
//                     const response = await axios.get(`${process.env.REACT_APP_API_URL}/all_employees`); // Replace with your API endpoint
//                     if (response.data.status === "Success") {
//                         const employeeNames = response.data.data.map(emp => emp.name); // Adjust based on your API response.
//                         setAllEmployees(employeeNames);
//                         setEmployees(["All", ...employeeNames]);  // initialize the employees state variable
//                     } else {
//                         console.error("Failed to fetch all employees");
//                         setAllEmployees([]); // handle errors.
//                         setEmployees(["All"]);  // fallback
//                     }
//                 } catch (error) {
//                     console.error("Error fetching all employees:", error);
//                     setAllEmployees([]);
//                     setEmployees(["All"]); // fallback
//                 }
//             } else {
//                  setEmployees(["All"]); // Default for non-admin.  No need to fetch.
//             }
//         };

//         fetchAllEmployees();

//     }, [designation]);  // Run only on mount/designation change

//      useEffect(() => {
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

//     useEffect(() => {
//         const fetchReportData = async () => {
//             if (designation !== "Sr. Technical Head" && !employeeId) {
//                 setReportData([]); // Prevent errors for non-admin when no employeeId
//                 return;
//             }
//             try {
//                 const payload = {
//                     domain: "Development",
//                     page: page.toString(),
//                     limit: maxDisplayCount,
//                     fromDate,
//                     toDate,
//                 };

//                 const apiEndpoint =
//                     designation === "Sr. Technical Head"
//                         ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//                         : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//                 const response = await axios.post(apiEndpoint, payload);
//                 const { status, data, totalRecords } = response.data;

//                 if (status === "Success") {
//                     setTotalRecords(totalRecords);
//                     setReportData(data || []);

//                     const initialTeamLeaderReviews = {};
//                     const initialAdminReviews = {};

//                     data.forEach((dateItem) => {
//                         dateItem.reports.forEach((reportItem) => {
//                             initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
//                             initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
//                         });
//                     });

//                     setTeamLeaderReviews(initialTeamLeaderReviews);
//                     setAdminReviews(initialAdminReviews);
//                 } else {
//                     setReportData([]);
//                 }


//             } catch (error) {
//                 console.error("Error occurred:", error);
//                 setReportData([]);
//             }
//         };

//         if (fromDate && toDate) {
//             fetchReportData();
//         }
//     }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

//     const handleTeamLeaderInputChange = (reportId, value) => {
//         setTeamLeaderReviews((prev) => ({
//             ...prev,
//             [reportId]: value,
//         }));
//     };

//     const handleAdminInputChange = (reportId, value) => {
//         // Admin reviews are now read-only
//         // You can remove this function completely if no other logic is needed.
//         // setAdminReviews((prev) => ({
//         //     ...prev,
//         //     [reportId]: value,
//         // }));
//     };

//     const handleReviewUpdate = async (reportId) => {
//         const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
//         // No need to send adminReview since it's not editable.
//         // const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";
//         const adminReviewText = ""; //  Admin review is not edited

//         if (!teamLeaderReviewText && !adminReviewText || !reportId) return;

//         const payload = {
//             id: reportId,
//             review: teamLeaderReviewText,
//             evaluation: adminReviewText, // Send the admin review (even if empty or unchanged)
//         };

//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
//             if (response.data.status === "Success") {
//                 alert("Reviews submitted successfully!");
//             } else {
//                 alert("Error submitting reviews");
//             }
//         } catch (error) {
//             console.error("Error submitting reviews:", error);
//             alert("Error submitting reviews");
//         }
//     };

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


//     return (
//         <div className="container mx-auto">
//              <h5>Employee Report</h5>
//             <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//                 <div className="flex flex-col sm:flex-row">
//                     <input
//                         type="date"
//                         name="fromDate"
//                         value={fromDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     <input
//                         type="date"
//                         name="toDate"
//                         value={toDate}
//                         onChange={handleDateChange}
//                         max={today}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mr-2"
//                         style={{ width: "200px" }}
//                     />
//                     {designation === "Sr. Technical Head" && (
//                         <div className="flex items-center">
//                            <div style={styles.column}>
//                                 <label style={styles.label}>Employee Name:</label>
//                                 <select
//                                     style={styles.input}
//                                     value={selectedEmployee}
//                                     onChange={handleEmployeeChange}
//                                 >
//                                     <option value="All">All</option>
//                                     {employeeList.map((emp) => (
//                                         <option key={emp.employeeId} value={emp.name}>
//                                             {emp.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {reportData.length > 0 ? (
//                 <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
//                     <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
//                         <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
//                             <tr>
//                                 <th className="border px-4 py-2" style={{ width: "70px" }}>
//                                     S/No
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Date
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "150px" }}>
//                                     Time
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "180px" }}>
//                                     Employee Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Project Name
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "200px" }}>
//                                     Subcategory
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "600px" }}>
//                                     Report
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Admin Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "350px" }}>
//                                     Team Leader Review
//                                 </th>
//                                 <th className="border px-4 py-2" style={{ width: "120px" }}></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportData.map((dateItem, dateIndex) => {
//                                 const reports = dateItem.reports || [];
//                                 return reports
//                                     .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
//                                     .map((reportItem, reportIndex) => {
//                                         const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
//                                         const reportTime = moment(reportItem.created_at).format("HH:mm A");
//                                         const employeeName = reportItem.name || "N/A";
//                                         const id = reportItem.id || "N/A";
//                                         const reportDetails = reportItem.reportDetails || [];

//                                         return reportDetails.map((detailItem, detailIndex) => {
//                                             const subcategories = detailItem.subCategory || [];
//                                             return subcategories.map((subCategoryItem, subCatIndex) => {
//                                                 return (
//                                                     <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
//                                                         {(subCatIndex === 0 && detailIndex === 0) && (
//                                                             <>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportDate}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {reportTime}
//                                                                 </td>
//                                                                 <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
//                                                                     {employeeName}
//                                                                 </td>
//                                                             </>
//                                                         )}
//                                                         {subCatIndex === 0 && (
//                                                             <td className="border px-6 py-4" rowSpan={subcategories.length}>
//                                                                 {detailItem.projectName || "N/A"}
//                                                             </td>
//                                                         )}
//                                                         <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
//                                                         <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
//                                                         <td className="border px-6 py-4" style={{ width: "400px" }}>
//                                                             {/* Admin Review (Non-Editable) */}
//                                                             {adminReviews[id] || "No review available."}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Team Leader Review (Editable for Sr. Technical Head) */}
//                                                             {(designation === "Sr. Technical Head") ? (
//                                                                 <input
//                                                                     type="text"
//                                                                     value={teamLeaderReviews[id] || ""}
//                                                                     onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
//                                                                     className="border border-gray-300 rounded-lg p-2 w-full"
//                                                                     placeholder="Enter Team Leader Review"
//                                                                     style={{ width: "100%" }} // Increased width of input field
//                                                                 />
//                                                             ) : (
//                                                                 teamLeaderReviews[id] || "No review available."
//                                                             )}
//                                                         </td>
//                                                         <td className="border px-6 py-4">
//                                                             {/* Save Button (Separate Column) */}
//                                                             {(designation === "Sr. Technical Head") && (
//                                                                 <button
//                                                                     onClick={() => handleReviewUpdate(id)}
//                                                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             });
//                                         });
//                                     });
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No reports found for the selected date range.</p>
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
import { useNavigate } from "react-router-dom";

const EmployeeReportList = () => {
    const { employeeId, designation } = useSelector((state) => state.login.userData);
    const [reportData, setReportData] = useState([]);
    const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [maxDisplayCount, setMaxDisplayCount] = useState(25);
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);  // Now holds all employee names.
    const [selectedEmployee, setSelectedEmployee] = useState("All");
    const [teamLeaderReviews, setTeamLeaderReviews] = useState({});
    const [adminReviews, setAdminReviews] = useState({});
    const [allEmployees, setAllEmployees] = useState([]); //  Store all employees from separate API call.
    const [employeeList, setEmployeeList] = useState([]);
    const styles = {
        column: {
            display: 'flex',
            flexDirection: 'column',
            marginRight: '10px',
        },
        label: {
            marginBottom: '5px',
            fontWeight: 'bold',
        },
        input: {
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
        },
    };


    useEffect(() => {
        // Fetch all employee names
        const fetchAllEmployees = async () => {
            if (designation === "Sr. Technical Head") {  // Only fetch if admin
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/all_employees`); // Replace with your API endpoint
                    if (response.data.status === "Success") {
                        const employeeNames = response.data.data.map(emp => emp.name); // Adjust based on your API response.
                        setAllEmployees(employeeNames);
                        setEmployees(["All", ...employeeNames]);  // initialize the employees state variable
                    } else {
                        console.error("Failed to fetch all employees");
                        setAllEmployees([]); // handle errors.
                        setEmployees(["All"]);  // fallback
                    }
                } catch (error) {
                    console.error("Error fetching all employees:", error);
                    setAllEmployees([]);
                    setEmployees(["All"]); // fallback
                }
            } else {
                 setEmployees(["All"]); // Default for non-admin.  No need to fetch.
            }
        };

        fetchAllEmployees();

    }, [designation]);  // Run only on mount/designation change

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
        const fetchReportData = async () => {
            if (designation !== "Sr. Technical Head" && !employeeId) {
                setReportData([]); // Prevent errors for non-admin when no employeeId
                return;
            }
            try {
                const payload = {
                    domain: "Development",
                    page: page.toString(),
                    limit: maxDisplayCount,
                    fromDate,
                    toDate,
                };

                const apiEndpoint =
                    designation === "Sr. Technical Head"
                        ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
                        : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

                const response = await axios.post(apiEndpoint, payload);
                const { status, data, totalRecords } = response.data;

                if (status === "Success") {
                    setTotalRecords(totalRecords);
                    setReportData(data || []);

                    const initialTeamLeaderReviews = {};
                    const initialAdminReviews = {};

                    data.forEach((dateItem) => {
                        dateItem.reports.forEach((reportItem) => {
                            initialTeamLeaderReviews[reportItem.id] = reportItem.review || "";
                            initialAdminReviews[reportItem.id] = reportItem.adminReview || "";
                        });
                    });

                    setTeamLeaderReviews(initialTeamLeaderReviews);
                    setAdminReviews(initialAdminReviews);
                } else {
                    setReportData([]);
                }


            } catch (error) {
                console.error("Error occurred:", error);
                setReportData([]);
            }
        };

        if (fromDate && toDate) {
            fetchReportData();
        }
    }, [fromDate, toDate, page, maxDisplayCount, employeeId, designation, selectedEmployee]);

    const handleTeamLeaderInputChange = (reportId, value) => {
        setTeamLeaderReviews((prev) => ({
            ...prev,
            [reportId]: value,
        }));
    };

    const handleAdminInputChange = (reportId, value) => {
        // Admin reviews are now read-only
        // You can remove this function completely if no other logic is needed.
        // setAdminReviews((prev) => ({
        //     ...prev,
        //     [reportId]: value,
        // }));
    };

    const handleReviewUpdate = async (reportId) => {
        const teamLeaderReviewText = teamLeaderReviews[reportId] ? teamLeaderReviews[reportId].trim() : "";
        // No need to send adminReview since it's not editable.
        // const adminReviewText = adminReviews[reportId] ? adminReviews[reportId].trim() : "";
        const adminReviewText = ""; //  Admin review is not edited

        if (!teamLeaderReviewText && !adminReviewText || !reportId) return;

        const payload = {
            id: reportId,
            review: teamLeaderReviewText,
            evaluation: adminReviewText, // Send the admin review (even if empty or unchanged)
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/post_emp_report`, payload);
            if (response.data.status === "Success") {
                alert("Reviews submitted successfully!");
            } else {
                alert("Error submitting reviews");
            }
        } catch (error) {
            console.error("Error submitting reviews:", error);
            alert("Error submitting reviews");
        }
    };

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


    return (
        <div className="container mx-auto">
             <h5 className="text-lg font-semibold mb-2 text-center text-blue-900">Employee Report</h5>
            <div data-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
                <div className="flex flex-col sm:flex-row">
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
                  <div className="flex items-center">
                       <label htmlFor="employee" className="mr-2 text-sm text-gray-700">Select Employee:</label>
                      <select
                          id="employee"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                          style={{ width: "240px" }}
                          value={selectedEmployee}
                          onChange={handleEmployeeChange}
                      >
                          <option value="All">All</option>
                          {employeeList.map((emp) => (
                              <option key={emp.employeeId} value={emp.name}>
                                  {emp.name}
                              </option>
                          ))}
                      </select>
                  </div>
                </div>
            </div>

            {reportData.length > 0 ? (
                <div className="my-5 overflow-auto" style={{ maxHeight: "470px" }}>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500" style={{ minWidth: "2000px" }}>
                        <thead className="text-xs text-gray-700 uppercase bg-slate-200 border-b border-gray-300" style={{ position: "sticky", top: 0, zIndex: 1, height: "55px" }}>
                            <tr>
                                <th className="border px-4 py-2" style={{ width: "70px" }}>
                                    S/No
                                </th>
                                <th className="border px-4 py-2" style={{ width: "150px" }}>
                                    Date
                                </th>
                                <th className="border px-4 py-2" style={{ width: "150px" }}>
                                    Time
                                </th>
                                <th className="border px-4 py-2" style={{ width: "180px" }}>
                                    Employee Name
                                </th>
                                <th className="border px-4 py-2" style={{ width: "200px" }}>
                                    Project Name
                                </th>
                                <th className="border px-4 py-2" style={{ width: "200px" }}>
                                    Product
                                </th>
                                <th className="border px-4 py-2" style={{ width: "600px" }}>
                                    Report
                                </th>
                                <th className="border px-4 py-2" style={{ width: "350px" }}>
                                    Admin Review
                                </th>
                                <th className="border px-4 py-2" style={{ width: "350px" }}>
                                    Team Leader Review
                                </th>
                                <th className="border px-4 py-2" style={{ width: "120px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((dateItem, dateIndex) => {
                                const reports = dateItem.reports || [];
                                return reports
                                    .filter((reportItem) => selectedEmployee === "All" || reportItem.name === selectedEmployee)
                                    .map((reportItem, reportIndex) => {
                                        const reportDate = moment(dateItem.reportDate, "DD-MMM-YYYY").format("DD-MM-YYYY");
                                        const reportTime = moment(reportItem.created_at).format("HH:mm A");
                                        const employeeName = reportItem.name || "N/A";
                                        const id = reportItem.id || "N/A";
                                        const reportDetails = reportItem.reportDetails || [];

                                        return reportDetails.map((detailItem, detailIndex) => {
                                            const subcategories = detailItem.subCategory || [];
                                            return subcategories.map((subCategoryItem, subCatIndex) => {
                                                return (
                                                    <tr key={`${id}-${detailIndex}-${subCatIndex}`} className="bg-white border-b hover:bg-gray-50">
                                                        {(subCatIndex === 0 && detailIndex === 0) && (
                                                            <>
                                                                <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                                                    {(page - 1) * maxDisplayCount + (dateIndex * reports.length) + (reportIndex + 1)}
                                                                </td>
                                                                <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                                                    {reportDate}
                                                                </td>
                                                                <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                                                    {reportTime}
                                                                </td>
                                                                <td className="border px-6 py-4" rowSpan={reportDetails.reduce((acc, curr) => acc + curr.subCategory.length, 0)}>
                                                                    {employeeName}
                                                                </td>
                                                            </>
                                                        )}
                                                        {subCatIndex === 0 && (
                                                            <td className="border px-6 py-4" rowSpan={subcategories.length}>
                                                                {detailItem.projectName || "N/A"}
                                                            </td>
                                                        )}
                                                        <td className="border px-6 py-4">{subCategoryItem.subCategoryName || "N/A"}</td>
                                                        <td className="border px-6 py-4">{subCategoryItem.report || "No report available."}</td>
                                                        <td className="border px-6 py-4" style={{ width: "400px" }}>
                                                            {/* Admin Review (Non-Editable) */}
                                                            {adminReviews[id] || "No review available."}
                                                        </td>
                                                        <td className="border px-6 py-4">
                                                            {/* Team Leader Review (Editable for Sr. Technical Head) */}
                                                            {(designation === "Sr. Technical Head") ? (
                                                                <input
                                                                    type="text"
                                                                    value={teamLeaderReviews[id] || ""}
                                                                    onChange={(e) => handleTeamLeaderInputChange(id, e.target.value)}
                                                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                                                    placeholder="Enter Team Leader Review"
                                                                    style={{ width: "100%" }} // Increased width of input field
                                                                />
                                                            ) : (
                                                                teamLeaderReviews[id] || "No review available."
                                                            )}
                                                        </td>
                                                        <td className="border px-6 py-4">
                                                            {/* Save Button (Separate Column) */}
                                                            {(designation === "Sr. Technical Head") && (
                                                                <button
                                                                    onClick={() => handleReviewUpdate(id)}
                                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                                >
                                                                    Save
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        });
                                    });
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No reports found for the selected date range.</p>
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
                    onClick={() => handlePageChange(page < totalPages ? page + 1 : totalPages)}
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