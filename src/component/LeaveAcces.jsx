// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   const leaveListStyle = {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//     marginTop: windowWidth < 600 ? "200px" : "100px", // Adjust margin-top based on screen size
//     overflowY: "auto", // Enables scrolling if the list gets too long
//     maxHeight: "70vh", // Limit the height to 70% of the viewport
//     padding: "0 16px", // Add some horizontal padding for better spacing on all screens
//     boxSizing: "border-box", // Ensures padding doesn't affect overall width
//   };
//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           // Check if the leave's start date is on or after the selected start date
//           // and if the leave's end date is on or before the selected end date
//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks ,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };
//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//  {/* Fixed Date Picker Section */}
//  <div style={filterContainerStyle}>
//         <div style={filterItemStyle}>
//           <label htmlFor="fromDate">From Date:</label>
//           <input
//             type="date"
//             id="fromDate"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             style={inputStyle}
//           />
//         </div>

//         <div style={filterItemStyle}>
//           <label htmlFor="toDate">To Date:</label>
//           <input
//             type="date"
//             id="toDate"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             style={inputStyle}
//           />
//         </div>

//         <div style={filterItemStyle}>
//         <label htmlFor="employee" style={{ marginRight: "0px" }}> All :</label>
//         <select
//             id="employee"
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//             style={dropdownStyle}
//           >
//             <option value="">All Employees</option>
//             {employees.map((employee, index) => (
//               <option key={index} value={employee}>
//                 {employee}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div style={filterItemStyle}>
//   <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//   <select
//     id="status"
//     value={selectedStatus}
//     onChange={(e) => setSelectedStatus(e.target.value)}
//     style={dropdownStyle1}  // You can reuse your existing dropdownStyle here
//   >
//     <option value="Pending">Pending</option>
//     <option value="Accepted">Accepted</option>
//     <option value="Rejected">Rejected</option>
//   </select>
// </div>

//       </div>

//       {/* Status Filter Buttons */}

//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div>{leave.employeeName}</div>
//                 <span style={getStatusStyle(leave.status)}>{leave.status}</span>
//               </div>
//               <div style={dateStyle}>
//                 <div><strong>From:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}</div>
//                 <div><strong>To:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}</div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>Leave Type:</strong> {leave.leaveTypes}</div>
//                 <div><strong>Leave Time:</strong> {leave.leaveTimes}</div>
//                 <div><strong>No. of Days:</strong> {leave.noOfDays}</div>
//               </div>
//               <div><strong>Reason:</strong> {leave.reason}</div>
//               <textarea
//       style={textareaStyle}
//       placeholder="Add Remarks"
//       id={`remarks-${leave.lid}`}
//       value={remarks[leave.lid] || leave.rejectReason || ""}
//       onChange={(e) => handleRemarksChange(leave.lid, e)}
//     />
//               {/*  <textarea
//                   placeholder="Add Remarks"
//                   style={{
//                     width: "100%",
//                     padding: "6px",
//                     marginBottom: "6px",
//                     borderRadius: "4px",
//                     border: "1px solid #ccc",
//                     resize: "vertical",
//                   }}
//                   id={`remarks-${leave.lid}`}
//                 /> */}
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",    // Added top spacing for the filter container
//   left: "55%",    // Center the container horizontally
//   transform: "translateX(-50%)",
//   width: "90%",   // Take up most of the screen width
//   backgroundColor: "#fff",  // White background for clarity
//   borderRadius: "10px", // Rounded corners
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
//   padding: "20px",  // Add padding inside the container
//   zIndex: 10,     // Ensure it's on top of other elements
//   display: "flex",
//   flexWrap: "wrap", // Wrap items on smaller screens
//   justifyContent: "center", // Center the items inside the container
// };

// const filterItemStyle = {
//   margin: "3px",  // Space between filter items
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start", // Align items to the left
//   width: "auto",  // Flexible width for responsiveness
// };
// const filterItemStyle1 = {
//   margin: "5px",  // Space between filter items
//   display: "flex",
//   flexDirection: "row",
//   alignItems: "flex-start", // Align items to the left
//   width: "auto",  // Flexible width for responsiveness
// };
// const dropdownStyle1 = {
//   width: "200px", // Adjust the width as needed
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const statusButtonStyle = {
//   padding: "10px 20px",
//   margin: "5px",
//   fontSize: "14px",
//   cursor: "pointer",
//   borderRadius: "5px",
//   border: "none",
//   transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for hover effect
// };

// const selectedButtonStyle = {
//   backgroundColor: "#007bff",  // Blue color for selected state
//   color: "#fff",  // White text
// };

// const defaultButtonStyle = {
//   backgroundColor: "#f8f9fa",  // Light grey for unselected state
//   color: "#333",  // Dark text color
// };

// // Media query for responsiveness
// const mobileStyles = {
//   "@media (max-width: 768px)": {
//     filterContainerStyle: {
//       width: "100%", // Full width on mobile
//       left: "0",  // Align to the left side on mobile
//       transform: "none",  // Remove the translate effect
//       top: "10px", // Keep some spacing from the top
//     },
//     inputStyle: {
//       width: "100%",  // Full width for inputs on mobile
//     },
//     dropdownStyle: {
//       width: "100%",  // Full width for select on mobile
//     },
//     statusButtonStyle: {
//       width: "100%",  // Full width for buttons on mobile
//       marginBottom: "10px",  // Add margin between buttons
//     },
//   },
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// /* const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: windowWidth < 600 ? "200px" : "100px", // Adjust margin-top based on screen size
//   overflowY: "auto", // Enables scrolling if the list gets too long
//   maxHeight: "70vh", // Limit the height to 70% of the viewport
//   padding: "0 16px", // Add some horizontal padding for better spacing on all screens
//   boxSizing: "border-box", // Ensures padding doesn't affect overall width
// }; */

// const cardStyle = {
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   color: "#007BFF",
// };

// const dateStyle = {
//   display: "flex",
//   marginTop: "6px",
//   color: "#555",
//   gap: "16px",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const statusFilterContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "20px",
//   padding: "10px",
//   position: "fixed",
//   top: "60px", // Adjust top to make space for filters
//   left: "60%",
//   transform: "translateX(-50%)",
//   width: "50%",
//   zIndex: 5,
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">To Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}> All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong>Employee Name:</strong>  {leave.employeeName}</div>
//                 <span style={getStatusStyle(leave.status)}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{flex: 1, textAlign: 'left'}}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{flex: 1, textAlign: 'right'}}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>Leave Type:</strong> {leave.leaveTypes}</div>
//                 <div><strong>Leave Time:</strong> {leave.leaveTimes}</div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>No. of Days:</strong> {leave.noOfDays}</div>
//                 <div><strong>Reason:</strong> {leave.reason}</div>
//               </div>
//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">To Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}> All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black" }}>Employee Name:</strong>  {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{flex: 1, textAlign: 'left'}}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{flex: 1, textAlign: 'right'}}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>Leave Type:</strong> {leave.leaveTypes}</div>
//                 <div><strong>Leave Time:</strong> {leave.leaveTimes}</div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>No. of Days:</strong> {leave.noOfDays}</div>
//                 <div><strong>Reason:</strong> {leave.reason}</div>
//               </div>
//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">To Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}> All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong>  {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{flex: 1, textAlign: 'left'}}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{flex: 1, textAlign: 'right'}}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>Leave Type:</strong> {leave.leaveTypes}</div>
//                 <div><strong>Leave Time:</strong> {leave.leaveTimes}</div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div><strong>No. of Days:</strong> {leave.noOfDays}</div>
//                 <div><strong>Reason:</strong> {leave.reason}</div>
//               </div>
//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   // backgroundColor: "transparent", // Ensured transparent background
//   // borderRadius: "10px",
//   // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   // Removed white background
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight:"bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">To Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}> All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong>  {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{flex: 1, textAlign: 'left'}}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{flex: 1, textAlign: 'right'}}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>

//               {/* Group Leave Time and Reason in the same line after End Date */}
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'right' }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'right' }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">To Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}> All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong>  {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{flex: 1, textAlign: 'left'}}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{flex: 1, textAlign: 'right'}}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>

//               {/* Group Leave Type, Leave Time, No. of Days and Reason vertically aligned */}
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Fixed Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}>All:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong> {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>

//               {/* Group Leave Type, Leave Time, No. of Days and Reason vertically aligned */}
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
// };

// const filterItemStyle = {
//   margin: "3px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);  // Default to current date
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); // Track selected status for filtering
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Centered Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}>Employee:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong> {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>

//               {/* Group Leave Type, Leave Time, No. of Days and Reason vertically aligned */}
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "center" // Center items vertically
// };

// const filterItemStyle = {
//   margin: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",  // Center items horizontally
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [remarks, setRemarks] = useState({});

//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // Update window width when the window is resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchLeaveApplications = (startDate, endDate, employeeName = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         const employeeNames = [...new Set(filteredData.map((leave) => leave.employeeName))];
//         setEmployees(employeeNames);

//         if (employeeName) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeName === employeeName
//           );
//         }

//         // Filter by startDate and endDate range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           return (
//             leaveStartDate.isSameOrAfter(startDate) &&
//             leaveEndDate.isSameOrBefore(endDate)
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//   }, [fromDate, toDate, selectedEmployee, selectedStatus]);

//   const handleAccept = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, reason, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployee);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Centered Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}>Employee:</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee, index) => (
//                 <option key={index} value={employee}>
//                   {employee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div><strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong> {leave.employeeName}</div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//                 {/* New Time Display */}
//                 <div style={{ marginTop: '8px', textAlign: 'left' }}>
//                     <strong>Time Applied:</strong> {leave.createdAt ? moment(leave.createdAt).format("MMMM D, YYYY h:mm A") : "Time not available"}
//                 </div>

//               {/* Group Leave Type, Leave Time, No. of Days and Reason vertically aligned */}
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         leave.reason,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "center" // Center items vertically
// };

// const filterItemStyle = {
//   margin: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",  // Center items horizontally
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [remarks, setRemarks] = useState({});
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");

//   // Fetch employee list on component mount
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

//   const fetchLeaveApplications = (startDate, endDate, employeeId = "") => {
//     axios
//       .post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       })
//       .then((response) => {
//         let filteredData = response.data.data || [];

//         // Filter based on selected employee ID
//         if (employeeId) {
//           filteredData = filteredData.filter(
//             (leave) => leave.employeeId === employeeId
//           );
//         }

//         // Filter leave applications based on selected date range
//         filteredData = filteredData.filter((leave) => {
//           const leaveStartDate = moment(leave.startDate);
//           const leaveEndDate = moment(leave.endDate);

//           // Check if the leave period overlaps with the selected date range
//           return (
//             (leaveStartDate.isSameOrAfter(startDate) && leaveStartDate.isSameOrBefore(endDate)) ||
//             (leaveEndDate.isSameOrAfter(startDate) && leaveEndDate.isSameOrBefore(endDate)) ||
//             (leaveStartDate.isBefore(startDate) && leaveEndDate.isAfter(endDate))
//           );
//         });

//         // Filter by status if selected
//         if (selectedStatus) {
//           filteredData = filteredData.filter(
//             (leave) => leave.status === selectedStatus
//           );
//         }

//         setLeaveApplications(filteredData);
//       })
//       .catch((error) => {
//         console.error("Error fetching leave applications:", error);
//       });
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//   }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

//   const handleAccept = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         {/* Centered Date Picker Section */}
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}>Employee:</label>
//             <select
//               id="employee"
//               value={selectedEmployeeId}
//               onChange={(e) => setSelectedEmployeeId(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="">All</option>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div>
//                   <strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong> {leave.employeeName}
//                 </div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={{ marginTop: '8px', textAlign: 'left' }}>
//                 <strong>Time Applied:</strong> {leave.createdAt ? moment(leave.createdAt).format("MMMM D, YYYY h:mm A") : "Time not available"}
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "center" // Center items vertically
// };

// const filterItemStyle = {
//   margin: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",  // Center items horizontally
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [remarks, setRemarks] = useState({});
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");

//   // Fetch employee list on component mount
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

//   const fetchLeaveApplications = async (startDate, endDate, employeeId = "") => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       });

//       let filteredData = response.data.data || [];

//       // Filter based on selected employee ID
//       if (employeeId) {
//         filteredData = filteredData.filter(
//           (leave) => leave.employeeId === employeeId
//         );
//       }

//       // Filter leave applications based on selected date range
//       filteredData = filteredData.filter((leave) => {
//         const leaveStartDate = moment(leave.startDate);
//         const leaveEndDate = moment(leave.endDate);

//         return (
//           (leaveStartDate.isSameOrAfter(startDate) && leaveStartDate.isSameOrBefore(endDate)) ||
//           (leaveEndDate.isSameOrAfter(startDate) && leaveEndDate.isSameOrBefore(endDate)) ||
//           (leaveStartDate.isBefore(startDate) && leaveEndDate.isAfter(endDate))
//         );
//       });

//       // Filter by status if selected
//       if (selectedStatus) {
//         filteredData = filteredData.filter(
//           (leave) => leave.status === selectedStatus
//         );
//       }

//       setLeaveApplications(filteredData);
//     } catch (error) {
//       console.error("Error fetching leave applications:", error);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//   }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

//   const handleAccept = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee" style={{ marginRight: "0px" }}>Employee:</label>
//             <select
//               id="employee"
//               value={selectedEmployeeId}
//               onChange={(e) => setSelectedEmployeeId(e.target.value)}
//               style={dropdownStyle}
//             >
//               <option value="">All Employees</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status" style={{ marginRight: "0px" }}>Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={dropdownStyle1}
//             >
//               <option value="">All</option>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div>
//                   <strong style={{ color: "black", fontSize: "16px" }}>Employee Name:</strong> {leave.employeeName}
//                 </div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: 'transparent' }}>{leave.status}</span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>Start Date:</strong> {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: 'left' }}>
//                   <strong>End Date:</strong> {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={{ marginTop: '8px', textAlign: 'left' }}>
//                 <strong>Time Applied:</strong> {leave.createdAt ? moment(leave.createdAt).format("MMMM D, YYYY h:mm A") : "Time not available"}
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Style definitions
// const filterContainerStyle = {
//   position: "fixed",
//   top: "10px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "90%",
//   padding: "20px",
//   zIndex: 10,
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "center" // Center items vertically
// };

// const filterItemStyle = {
//   margin: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",  // Center items horizontally
//   width: "auto",
// };

// const inputStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const dropdownStyle1 = {
//   width: "200px",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between", // Left and Right alignment
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "yellow" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";

// const LeaveApplications = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [remarks, setRemarks] = useState({});
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");

//   // Fetch employee list on component mount
//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//         if (response.data.status === "Success") {
//           setEmployeeList(response.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching employee list:", err);
//       }
//     };
//     fetchEmployeeList();
//   }, []);

//   const fetchLeaveApplications = async (startDate, endDate, employeeId = "") => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`, {
//         startDate: startDate,
//         endDate: endDate,
//       });

//       let filteredData = response.data.data || [];

//       // Filter based on selected employee ID
//       if (employeeId) {
//         filteredData = filteredData.filter((leave) => leave.employeeId === employeeId);
//       }

//       // Filter leave applications based on selected date range
//       filteredData = filteredData.filter((leave) => {
//         const leaveStartDate = moment(leave.startDate);
//         const leaveEndDate = moment(leave.endDate);

//         return (
//           (leaveStartDate.isSameOrAfter(startDate) && leaveStartDate.isSameOrBefore(endDate)) ||
//           (leaveEndDate.isSameOrAfter(startDate) && leaveEndDate.isSameOrBefore(endDate)) ||
//           (leaveStartDate.isBefore(startDate) && leaveEndDate.isAfter(endDate))
//         );
//       });

//       // Filter by status if selected
//       if (selectedStatus) {
//         filteredData = filteredData.filter((leave) => leave.status === selectedStatus);
//       }

//       setLeaveApplications(filteredData);
//     } catch (error) {
//       console.error("Error fetching leave applications:", error);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

//   const handleAccept = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Accepted",
//       })
//       .then((response) => {
//         console.log("Leave accepted:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error accepting leave:", error);
//       });
//   };

//   const handleReject = (id, remarks) => {
//     axios
//       .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
//         leaveId: id,
//         remarks,
//         status: "Rejected",
//       })
//       .then((response) => {
//         console.log("Leave rejected:", response.data);
//         fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
//       })
//       .catch((error) => {
//         console.error("Error rejecting leave:", error);
//       });
//   };

//   const handleRemarksChange = (lid, event) => {
//     setRemarks((prevRemarks) => ({
//       ...prevRemarks,
//       [lid]: event.target.value,
//     }));
//   };

//   return (
//     <div style={containerStyle}>
//       <div>
//         <div style={filterContainerStyle}>
//           <div style={filterItemStyle}>
//             <label htmlFor="fromDate">From Date:</label>
//             <input
//               type="date"
//               id="fromDate"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="toDate">End Date:</label>
//             <input
//               type="date"
//               id="toDate"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="employee">Employee:</label>
//             <select
//               id="employee"
//               value={selectedEmployeeId}
//               onChange={(e) => setSelectedEmployeeId(e.target.value)}
//               style={inputStyle}
//             >
//               <option value="">All Employees</option>
//               {employeeList.map((emp) => (
//                 <option key={emp.employeeId} value={emp.employeeId}>
//                   {emp.employeeName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={filterItemStyle}>
//             <label htmlFor="status">Status:</label>
//             <select
//               id="status"
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={inputStyle}
//             >
//               <option value="">All</option>
//               <option value="Pending">Pending</option>
//               <option value="Accepted">Accepted</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leave Applications Display */}
//       <div style={leaveListStyle}>
//         {leaveApplications.length === 0 ? (
//           <p>No leave applications available for the selected filters.</p>
//         ) : (
//           leaveApplications.map((leave) => (
//             <div key={leave.lid} style={cardStyle}>
//               <div style={cardHeaderStyle}>
//                 <div>
//                   <strong style={{ color: "black", fontSize: "16px" }}>
//                     Employee Name:
//                   </strong>{" "}
//                   {leave.employeeName}
//                 </div>
//                 <span style={{ ...getStatusStyle(leave.status), backgroundColor: "transparent" }}>
//                   {leave.status}
//                 </span>
//               </div>
//               <div style={alignDateStyle}>
//                 <div style={{ flex: 1, textAlign: "left" }}>
//                   <strong>Start Date:</strong>{" "}
//                   {moment(leave.startDate).format("MMMM D, YYYY")}
//                 </div>
//                 <div style={{ flex: 1, textAlign: "left" }}>
//                   <strong>End Date:</strong>{" "}
//                   {moment(leave.endDate).format("MMMM D, YYYY")}
//                 </div>
//               </div>
//               <div style={{ marginTop: "8px", textAlign: "left" }}>
//                 <strong>Time Applied:</strong>{" "}
//                 {leave.createdAt ? moment(leave.createdAt).format("MMMM D, YYYY h:mm A") : "Time not available"}
//               </div>
//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Type:</strong> {leave.leaveTypes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>No. of Days:</strong> {leave.noOfDays}
//                 </div>
//               </div>

//               <div style={leaveDetailsStyle}>
//                 <div style={{ flex: 1 }}>
//                   <strong>Leave Time:</strong> {leave.leaveTimes}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <strong>Reason:</strong> {leave.reason}
//                 </div>
//               </div>

//               <textarea
//                 style={textareaStyle}
//                 placeholder="Add Remarks"
//                 id={`remarks-${leave.lid}`}
//                 value={remarks[leave.lid] || leave.rejectReason || ""}
//                 onChange={(e) => handleRemarksChange(leave.lid, e)}
//               />
//               {leave.status === "Pending" && (
//                 <div style={actionButtonContainerStyle}>
//                   <button
//                     onClick={() =>
//                       handleAccept(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={acceptButtonStyle}
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleReject(
//                         leave.lid,
//                         document.getElementById(`remarks-${leave.lid}`).value
//                       )
//                     }
//                     style={rejectButtonStyle}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// // Responsive Filter Container Style
// const filterContainerStyle = {
//   display: "flex",
//   justifyContent: "center", // Centers the filters horizontally
//   alignItems: "center", // Centers items vertically
//   flexWrap: "wrap",
//   gap: "15px",
//   marginBottom: "20px",
// };

// // Updated Filter Item Style for responsiveness
// const filterItemStyle = {
//   margin: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "flex-start",
//   flex: "1 1 150px",
//   minWidth: "150px",
// };

// // Updated input and dropdown styles to use full width
// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   marginTop: "5px",
//   borderRadius: "5px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
//   boxSizing: "border-box",
// };

// const dropdownStyle = { ...inputStyle };
// const dropdownStyle1 = { ...inputStyle };

// const containerStyle = {
//   padding: "16px",
//   maxWidth: "900px",
//   margin: "0 auto",
//   paddingTop: "40px",
// };

// const leaveListStyle = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "16px",
//   marginTop: "150px",
//   overflowY: "auto",
//   maxHeight: "70vh",
//   padding: "0 16px",
//   boxSizing: "border-box",
// };

// const cardStyle = {
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   padding: "14px",
//   marginBottom: "16px",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const cardHeaderStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   fontSize: "16px",
//   fontWeight: "bolder",
//   color: "#007BFF",
// };

// const alignDateStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   margin: "10px 0",
// };

// const leaveDetailsStyle = {
//   marginTop: "8px",
//   display: "flex",
//   justifyContent: "space-between",
//   flexWrap: "wrap",
//   gap: "16px",
// };

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Pending":
//       return { fontSize: "14px", color: "orange" };
//     case "Accepted":
//       return { fontSize: "14px", color: "green" };
//     case "Rejected":
//       return { fontSize: "14px", color: "red" };
//     default:
//       return {};
//   }
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "2px",
//   fontSize: "14px",
//   borderRadius: "6px",
//   border: "1px solid #ccc",
//   marginTop: "12px",
//   boxSizing: "border-box",
// };

// const actionButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "8px",
// };

// const acceptButtonStyle = {
//   backgroundColor: "green",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const rejectButtonStyle = {
//   backgroundColor: "red",
//   padding: "8px 16px",
//   color: "white",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// export default LeaveApplications;

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const LeaveApplications = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

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

  const fetchLeaveApplications = async (
    startDate,
    endDate,
    employeeId = ""
  ) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
        {
          startDate: startDate,
          endDate: endDate,
        }
      );

      let filteredData = response.data.data || [];

      if (employeeId) {
        filteredData = filteredData.filter(
          (leave) => leave.Employee_id === employeeId
        );
      }

      if (selectedStatus) {
        filteredData = filteredData.filter(
          (leave) => leave.status === selectedStatus
        );
      }

      setLeaveApplications(filteredData);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }
  };

  useEffect(() => {
    fetchLeaveApplications(fromDate, toDate, selectedEmployeeId);
  }, [fromDate, toDate, selectedEmployeeId, selectedStatus]);

  const handleAccept = (id, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
        leaveId: id,
        remarks,
        status: "Accepted",
      })
      .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
      .catch((error) => console.error("Error accepting leave:", error));
  };

  const handleReject = (id, remarks) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/updateLeaveStatus`, {
        leaveId: id,
        remarks,
        status: "Rejected",
      })
      .then(() => fetchLeaveApplications(fromDate, toDate, selectedEmployeeId))
      .catch((error) => console.error("Error rejecting leave:", error));
  };

  const handleRemarksChange = (lid, event) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [lid]: event.target.value,
    }));
  };

  const getStatusStyleNew = (status) => {
    let backgroundColor = "";
    let textColor = "";

    switch (status) {
      case "Pending":
        backgroundColor = "#ffe0b2"; // Light orange
        textColor = "#f57c00"; // Dark orange
        break;
      case "Accepted":
        backgroundColor = "#b9f6ca"; // Light green
        textColor = "#00c853"; // Dark green
        break;
      case "Rejected":
        backgroundColor = "#ffcdd2"; // Light red
        textColor = "#e53935"; // Dark red
        break;
      default:
        backgroundColor = "#e0e0e0"; // Light grey
        textColor = "#757575"; // Dark grey
    }

    return {
      backgroundColor,
      color: textColor,
      fontWeight: "bold",
      borderRadius: "20px",
      padding: "4px 8px",
      textAlign: "center",
      display: "inline-block",
      fontSize: "0.875rem",
    };
  };

  return (
    <div style={containerStyle}>
      <div style={filterContainerStyle}>
        <div style={filterItemStyle}>
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={filterItemStyle}>
          <label htmlFor="employee">Employee:</label>
          <select
            id="employee"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Employees</option>
            {employeeList.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        {leaveApplications.length === 0 ? (
          <p>No leave applications available for the selected filters.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Applied On</th>
                <th>Type</th>
                <th>Days</th>
                <th>Leave Time</th>
                <th>Reason</th>
                <th>Remarks</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications.map((leave) => (
                <tr key={leave.lid}>
                  <td>{leave.employeeName}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {moment(leave.startDate).format("YYYY-MM-DD")}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {moment(leave.endDate).format("YYYY-MM-DD")}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {leave.createdAt
                      ? moment(leave.createdAt).format("YYYY-MM-DD HH:mm")
                      : "N/A"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{leave.leaveTypes}</td>
                  <td>{leave.noOfDays}</td>
                  <td>{leave.leaveTimes}</td>
                  <td>
                    <textarea
                      value={leave.reason}
                      readOnly
                      style={textareaStyle}
                    />
                  </td>
                  <td>
                    <textarea
                      id={`remarks-${leave.lid}`}
                      value={remarks[leave.lid] || leave.rejectReason || ""}
                      onChange={(e) => handleRemarksChange(leave.lid, e)}
                      style={textareaStyle}
                    />
                  </td>
                  <td className="px-4 py-2">
                    {leave.status === "Pending" && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() =>
                            handleAccept(
                              leave.lid,
                              document.getElementById(`remarks-${leave.lid}`)
                                .value
                            )
                          }
                          className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-green-200 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleReject(
                              leave.lid,
                              document.getElementById(`remarks-${leave.lid}`)
                                .value
                            )
                          }
                          className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-red-200 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span style={getStatusStyleNew(leave.status)}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ========== STYLES ==========

const containerStyle = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const filterContainerStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "20px",
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #dee2e6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const filterItemStyle = {
  display: "flex",
  flexDirection: "column",
  minWidth: "180px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ced4da",
  fontSize: "14px",
  backgroundColor: "#fff",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.075)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const textareaStyle = {
  width: "100%",
  minHeight: "40px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "5px",
  fontFamily: "inherit",
};

const getStatusStyle = (status) => {
  const base = {
    fontWeight: "bold",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
    textAlign: "center",
  };
  switch (status) {
    case "Pending":
      return { ...base, color: "orange" };
    case "Accepted":
      return { ...base, color: "green" };
    case "Rejected":
      return { ...base, color: "red" };
    default:
      return base;
  }
};

const acceptButtonStyle = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "5px 10px",
  marginBottom: "5px",
  cursor: "pointer",
};

const rejectButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "5px 10px",
  cursor: "pointer",
};

// Global style adjustments for responsiveness
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `table, th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `tbody tr:nth-child(odd) { background-color: #f9f9f9; }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `tbody tr:hover { background-color: #f1f1f1; }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `thead th {
    background-color: #e5e7eb;
    color:#111827;;
    position: sticky;
    top: 0;
    z-index: 2;
  }`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `button:hover {
    opacity: 0.9;
    transform: scale(1.02);
    transition: all 0.2s ease;
  }`,
  styleSheet.cssRules.length
);

// Media queries for responsive design
styleSheet.insertRule(
  `@media (max-width: 768px) {
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
    th, td {
      padding: 10px;
      font-size: 14px;
    }
    .filterContainerStyle {
      flex-direction: column;
    }
    .filterItemStyle {
      width: 100%;
      margin-bottom: 10px;
    }
  }`,
  styleSheet.cssRules.length
);

export default LeaveApplications;
