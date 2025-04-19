// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import moment from "moment";
// // import * as XLSX from "xlsx";
// // import "./AttendanceReport.css";

// // const AttendanceReport = () => {
// //     const [leaveData, setLeaveData] = useState({});
// //     const [punchData, setPunchData] = useState({});
// //     const [employeeList, setEmployeeList] = useState([]);
// //     const [selectedEmployee, setSelectedEmployee] = useState("");
// //     const [month, setMonth] = useState(moment().format("MM"));
// //     const [year, setYear] = useState(moment().format("YYYY"));

// //     useEffect(() => {
// //         fetchEmployeeList();
// //     }, []);

// //     useEffect(() => {
// //         if (year && month) {
// //             fetchLeaveData(year, month);
// //             fetchPunchData(year, month);
// //         }
// //     }, [year, month]);

// //     const fetchEmployeeList = async () => {
// //         try {
// //             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
// //             if (response.data.status === "Success") {
// //                 setEmployeeList(response.data.data);
// //             }
// //         } catch (err) {
// //             console.error("Error fetching employee list:", err);
// //         }
// //     };

// //     const fetchLeaveData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const leaveMap = {};

// //             formattedData.forEach((leave) => {
// //                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
// //                 leaveMap[leave.employeeName].push({
// //                     startDate: leave.startDate,
// //                     endDate: leave.endDate,
// //                     leaveTypes: leave.leaveTypes,
// //                     permissionHours: leave.permissionHours || 0,
// //                 });
// //             });

// //             setLeaveData(leaveMap);
// //         } catch (error) {
// //             console.error("Error fetching leave data:", error);
// //         }
// //     };

// //     const fetchPunchData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/dailypunch`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const punchMap = {};

// //             formattedData.forEach((punch) => {
// //                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
// //                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
// //                 punchMap[punch.employeeName].push(punchDate);
// //             });

// //             setPunchData(punchMap);
// //         } catch (error) {
// //             console.error("Error fetching punch data:", error);
// //         }
// //     };

// //     const getLeaveSymbol = (date, employeeLeaves) => {
// //         const today = moment();
// //         if (moment(date).isAfter(today, "day")) return "";
// //         if (moment(date).day() === 0) return "S"; // Sunday

// //         let leaveSymbol = "P"; // Assume present by default
// //         let totalPermissionHours = 0;

// //         employeeLeaves?.forEach((leave) => {
// //             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
// //                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
// //                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
// //                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
// //                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
// //                 totalPermissionHours += leave.permissionHours;
// //             }
// //         });

// //         if (totalPermissionHours > 2) {
// //             return "H"; // Half-day
// //         } else if (totalPermissionHours > 0) {
// //             return "PE"; // Partial Leave
// //         }

// //         return leaveSymbol; // 'P' for present if no other conditions were met
// //     };

// //     const exportToExcel = () => {
// //         const table = document.querySelector(".attendance-table");
// //         const workbook = XLSX.utils.table_to_book(table);
// //         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
// //     };

// //     // Compute Total Working Days (or Hours) based on the current date if the selected month is current.
// //     const currentYearStr = moment().format("YYYY");
// //     const currentMonthStr = moment().format("MM");
// //     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
// //     const totalWorkingDays =
// //         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

// //     return (
// //         <div className="attendance-container">
// //             <h2>Attendance Report</h2>
// //             <div className="filters">
// //                 {/* Month Dropdown */}
// //                 <label>Month:</label>
// //                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
// //                     {moment.months().map((m, index) => (
// //                         <option key={index} value={String(index + 1).padStart(2, "0")}>
// //                             {m}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 {/* Year Dropdown */}
// //                 <label>Year:</label>
// //                 <select value={year} onChange={(e) => setYear(e.target.value)}>
// //                     {[...Array(10)].map((_, i) => {
// //                         const currentYear = moment().year();
// //                         return (
// //                             <option key={i} value={currentYear - i}>
// //                                 {currentYear - i}
// //                             </option>
// //                         );
// //                     })}
// //                 </select>

// //                 {/* Employee Dropdown */}
// //                 <label>Select Employee:</label>
// //                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
// //                     <option value="">All Employees</option>
// //                     {employeeList.map((emp) => (
// //                         <option key={emp.employeeId} value={emp.employeeName}>
// //                             {emp.employeeName}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <button className="export-btn" onClick={exportToExcel}>
// //                     Export
// //                 </button>
// //             </div>

// //             <div className="table-container">
// //                 <table className="attendance-table">
// //                     <thead>
// //                         <tr>
// //                             <th>Employee Name</th>
// //                             {[...Array(fullMonthDays)].map((_, i) => (
// //                                 <th key={i}>
// //                                     {moment(`${year}-${month}`, "YYYY-MM")
// //                                         .date(i + 1)
// //                                         .format("DD")}
// //                                 </th>
// //                             ))}
// //                             <th>Total Working Days</th>
// //                             <th>Total Present</th>
// //                             <th>Total Absent</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {employeeList
// //                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee) // Filter by Employee
// //                             .map((emp) => {
// //                                 const today = moment();
// //                                 const doj = moment(emp.dateOfJoining);
// //                                 let totalPresent = 0;
// //                                 let totalAbsent = 0;
// //                                 let halfDayCount = 0;

// //                                 return (
// //                                     <tr key={emp.employeeId}>
// //                                         <td className="employee-name">{emp.employeeName}</td>
// //                                         {[...Array(fullMonthDays)].map((_, i) => {
// //                                             const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
// //                                             if (date.isBefore(doj, "day")) return <td key={i}>-</td>;
// //                                             if (date.isAfter(today, "day")) return <td key={i}></td>;

// //                                             // Check for punch data first
// //                                             let status = "P"; // Default to Present
// //                                             if (
// //                                                 punchData[emp.employeeName] &&
// //                                                 punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
// //                                             ) {
// //                                                 status = "P";
// //                                             } else {
// //                                                 // If no punch, check the leave data
// //                                                 if (leaveData[emp.employeeName]) {
// //                                                     status = getLeaveSymbol(date, leaveData[emp.employeeName]);
// //                                                 } else {
// //                                                     // If no leave data, check for Sundays
// //                                                     if (date.day() === 0) {
// //                                                         status = "S"; // Sunday
// //                                                     }
// //                                                 }
// //                                             }

// //                                             // Calculate totals
// //                                             if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
// //                                             if (status === "H") halfDayCount++;
// //                                             if (status === "LOP") totalAbsent++;

// //                                             return (
// //                                                 <td key={i} className={`status ${status.toLowerCase()}`}>
// //                                                     {status}
// //                                                 </td>
// //                                             );
// //                                         })}

// //                                         <td>{totalWorkingDays}</td>
// //                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
// //                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AttendanceReport;









// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import moment from "moment";
// // import * as XLSX from "xlsx";
// // import "./AttendanceReport.css";

// // const AttendanceReport = () => {
// //     const [leaveData, setLeaveData] = useState({});
// //     const [punchData, setPunchData] = useState({});
// //     const [employeeList, setEmployeeList] = useState([]);
// //     const [selectedEmployee, setSelectedEmployee] = useState("");
// //     const [month, setMonth] = useState(moment().format("MM"));
// //     const [year, setYear] = useState(moment().format("YYYY"));
// //     // New state for salary inputs; keys: employeeName, value: salary amount
// //     const [salaryInputs, setSalaryInputs] = useState({});

// //     useEffect(() => {
// //         fetchEmployeeList();
// //     }, []);

// //     useEffect(() => {
// //         if (year && month) {
// //             fetchLeaveData(year, month);
// //             fetchPunchData(year, month);
// //         }
// //     }, [year, month]);

// //     const fetchEmployeeList = async () => {
// //         try {
// //             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
// //             if (response.data.status === "Success") {
// //                 setEmployeeList(response.data.data);
// //             }
// //         } catch (err) {
// //             console.error("Error fetching employee list:", err);
// //         }
// //     };

// //     const fetchLeaveData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const leaveMap = {};

// //             formattedData.forEach((leave) => {
// //                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
// //                 leaveMap[leave.employeeName].push({
// //                     startDate: leave.startDate,
// //                     endDate: leave.endDate,
// //                     leaveTypes: leave.leaveTypes,
// //                     permissionHours: leave.permissionHours || 0,
// //                 });
// //             });

// //             setLeaveData(leaveMap);
// //         } catch (error) {
// //             console.error("Error fetching leave data:", error);
// //         }
// //     };

// //     const fetchPunchData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/dailypunch`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const punchMap = {};

// //             formattedData.forEach((punch) => {
// //                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
// //                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
// //                 punchMap[punch.employeeName].push(punchDate);
// //             });

// //             setPunchData(punchMap);
// //         } catch (error) {
// //             console.error("Error fetching punch data:", error);
// //         }
// //     };

// //     // Returns the leave symbol for a given date based on employee leave data.
// //     const getLeaveSymbol = (date, employeeLeaves) => {
// //         const today = moment();
// //         if (moment(date).isAfter(today, "day")) return "";
// //         if (moment(date).day() === 0) return "S"; // Sunday

// //         let leaveSymbol = "P"; // Default status is Present
// //         let totalPermissionHours = 0;

// //         employeeLeaves?.forEach((leave) => {
// //             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
// //                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
// //                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
// //                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
// //                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
// //                 totalPermissionHours += leave.permissionHours;
// //             }
// //         });

// //         if (totalPermissionHours > 2) {
// //             return "H"; // Half-day deduction (counts as 0.5 day)
// //         } else if (totalPermissionHours > 0) {
// //             return "PE"; // Partial Leave
// //         }

// //         return leaveSymbol; // 'P' if no other conditions met
// //     };

// //     const exportToExcel = () => {
// //         const table = document.querySelector(".attendance-table");
// //         const workbook = XLSX.utils.table_to_book(table);
// //         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
// //     };

// //     // Compute Total Working Days based on current date if the selected month is current.
// //     const currentYearStr = moment().format("YYYY");
// //     const currentMonthStr = moment().format("MM");
// //     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
// //     const totalWorkingDays =
// //         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

// //     // Handle change in salary input
// //     const handleSalaryChange = (employeeName, value) => {
// //         setSalaryInputs((prev) => ({
// //             ...prev,
// //             [employeeName]: value,
// //         }));
// //     };

// //     return (
// //         <div className="attendance-container">
// //             <h2>Attendance Report</h2>
// //             <div className="filters">
// //                 {/* Month Dropdown */}
// //                 <label>Month:</label>
// //                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
// //                     {moment.months().map((m, index) => (
// //                         <option key={index} value={String(index + 1).padStart(2, "0")}>
// //                             {m}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 {/* Year Dropdown */}
// //                 <label>Year:</label>
// //                 <select value={year} onChange={(e) => setYear(e.target.value)}>
// //                     {[...Array(10)].map((_, i) => {
// //                         const currentYear = moment().year();
// //                         return (
// //                             <option key={i} value={currentYear - i}>
// //                                 {currentYear - i}
// //                             </option>
// //                         );
// //                     })}
// //                 </select>

// //                 {/* Employee Dropdown */}
// //                 <label>Select Employee:</label>
// //                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
// //                     <option value="">All Employees</option>
// //                     {employeeList.map((emp) => (
// //                         <option key={emp.employeeId} value={emp.employeeName}>
// //                             {emp.employeeName}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <button className="export-btn" onClick={exportToExcel}>
// //                     Export
// //                 </button>
// //             </div>

// //             <div className="table-container">
// //                 <table className="attendance-table">
// //                     <thead>
// //                         <tr>
// //                             <th>Employee Name</th>
// //                             {[...Array(fullMonthDays)].map((_, i) => (
// //                                 <th key={i}>
// //                                     {moment(`${year}-${month}`, "YYYY-MM")
// //                                         .date(i + 1)
// //                                         .format("DD")}
// //                                 </th>
// //                             ))}
// //                             <th>Total Working Days</th>
// //                             <th>Total Present</th>
// //                             <th>Total Absent</th>
// //                             <th>Salary</th>
// //                             <th>Final Salary</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {employeeList
// //                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
// //                             .map((emp) => {
// //                                 const today = moment();
// //                                 const doj = moment(emp.dateOfJoining);
// //                                 let totalPresent = 0;
// //                                 let totalAbsent = 0;
// //                                 let halfDayCount = 0;

// //                                 // Prepare an array for status for each day (to use for deduction calculation)
// //                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
// //                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
// //                                     if (date.isBefore(doj, "day")) return "-";
// //                                     if (date.isAfter(today, "day")) return "";
                                    
// //                                     let status = "P"; // default is Present

// //                                     // Check punch data first
// //                                     if (
// //                                         punchData[emp.employeeName] &&
// //                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
// //                                     ) {
// //                                         status = "P";
// //                                     } else {
// //                                         // Check leave data
// //                                         if (leaveData[emp.employeeName]) {
// //                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
// //                                         } else {
// //                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
// //                                             if (date.day() === 0) {
// //                                                 status = "S"; // Sunday
// //                                             }
// //                                         }
// //                                     }

// //                                     // Update totals for deduction calculation:
// //                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
// //                                     if (status === "LOP") totalAbsent++;
// //                                     if (status === "H") halfDayCount++;
// //                                     // Also, count present if status is one of these values:
// //                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
// //                                     return status;
// //                                 });

// //                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
// //                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
// //                                 // Get salary for the employee from state (if any)
// //                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
// //                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
// //                                 const finalSalary = enteredSalary
// //                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
// //                                     : "";

// //                                 return (
// //                                     <tr key={emp.employeeId}>
// //                                         <td className="employee-name">{emp.employeeName}</td>
// //                                         {dailyStatuses.map((status, i) => (
// //                                             <td key={i} className={`status ${status.toLowerCase()}`}>
// //                                                 {status}
// //                                             </td>
// //                                         ))}
// //                                         <td>{totalWorkingDays}</td>
// //                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
// //                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
// //                                         <td>
// //                                             <input
// //                                                 type="text"
// //                                                 className="salary-input"
// //                                                 placeholder="Enter Salary"
// //                                                 value={salaryInputs[emp.employeeName] || ""}
// //                                                 onChange={(e) =>
// //                                                     handleSalaryChange(emp.employeeName, e.target.value)
// //                                                 }
// //                                             />
// //                                         </td>
// //                                         <td>{finalSalary}</td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AttendanceReport;


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import moment from "moment";
// // import * as XLSX from "xlsx";
// // import "./AttendanceReport.css";

// // const AttendanceReport = () => {
// //     const [leaveData, setLeaveData] = useState({});
// //     const [punchData, setPunchData] = useState({});
// //     const [employeeList, setEmployeeList] = useState([]);
// //     const [selectedEmployee, setSelectedEmployee] = useState("");
// //     const [month, setMonth] = useState(moment().format("MM"));
// //     const [year, setYear] = useState(moment().format("YYYY"));
// //     // New state for salary inputs; keys: employeeName, value: salary amount
// //     const [salaryInputs, setSalaryInputs] = useState({});

// //     // Load salary inputs from localStorage on component mount
// //     useEffect(() => {
// //         const storedSalary = localStorage.getItem("salaryInputs");
// //         if (storedSalary) {
// //             setSalaryInputs(JSON.parse(storedSalary));
// //         }
// //     }, []);

// //     // Update localStorage whenever salaryInputs changes
// //     useEffect(() => {
// //         localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
// //     }, [salaryInputs]);

// //     useEffect(() => {
// //         fetchEmployeeList();
// //     }, []);

// //     useEffect(() => {
// //         if (year && month) {
// //             fetchLeaveData(year, month);
// //             fetchPunchData(year, month);
// //         }
// //     }, [year, month]);

// //     const fetchEmployeeList = async () => {
// //         try {
// //             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
// //             if (response.data.status === "Success") {
// //                 setEmployeeList(response.data.data);
// //             }
// //         } catch (err) {
// //             console.error("Error fetching employee list:", err);
// //         }
// //     };

// //     const fetchLeaveData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const leaveMap = {};

// //             formattedData.forEach((leave) => {
// //                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
// //                 leaveMap[leave.employeeName].push({
// //                     startDate: leave.startDate,
// //                     endDate: leave.endDate,
// //                     leaveTypes: leave.leaveTypes,
// //                     permissionHours: leave.permissionHours || 0,
// //                 });
// //             });

// //             setLeaveData(leaveMap);
// //         } catch (error) {
// //             console.error("Error fetching leave data:", error);
// //         }
// //     };

// //     const fetchPunchData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/dailypunch`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const punchMap = {};

// //             formattedData.forEach((punch) => {
// //                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
// //                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
// //                 punchMap[punch.employeeName].push(punchDate);
// //             });

// //             setPunchData(punchMap);
// //         } catch (error) {
// //             console.error("Error fetching punch data:", error);
// //         }
// //     };

// //     // Returns the leave symbol for a given date based on employee leave data.
// //     const getLeaveSymbol = (date, employeeLeaves) => {
// //         const today = moment();
// //         if (moment(date).isAfter(today, "day")) return "";
// //         if (moment(date).day() === 0) return "S"; // Sunday

// //         let leaveSymbol = "P"; // Default status is Present
// //         let totalPermissionHours = 0;

// //         employeeLeaves?.forEach((leave) => {
// //             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
// //                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
// //                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
// //                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
// //                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
// //                 totalPermissionHours += leave.permissionHours;
// //             }
// //         });

// //         if (totalPermissionHours > 2) {
// //             return "H"; // Half-day deduction (counts as 0.5 day)
// //         } else if (totalPermissionHours > 0) {
// //             return "PE"; // Partial Leave
// //         }

// //         return leaveSymbol; // 'P' if no other conditions met
// //     };

// //     const exportToExcel = () => {
// //         // Select the attendance table
// //         const table = document.querySelector(".attendance-table");
        
// //         // Convert table to a worksheet
// //         const worksheet = XLSX.utils.table_to_sheet(table);
    
// //         // Add salary column manually to each row
// //         employeeList.forEach((employee, index) => {
// //             const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
// //             worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
// //         });
    
// //         // Append salary column header
// //         worksheet["AJ"] = { v: "Salary" };
    
// //         // Create a workbook and add the worksheet
// //         const workbook = XLSX.utils.book_new();
// //         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
// //         // Save the Excel file
// //         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
// //     };
    
// //     // Compute Total Working Days based on current date if the selected month is current.
// //     const currentYearStr = moment().format("YYYY");
// //     const currentMonthStr = moment().format("MM");
// //     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
// //     const totalWorkingDays =
// //         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

// //     // Handle change in salary input
// //     const handleSalaryChange = (employeeName, value) => {
// //         setSalaryInputs((prev) => ({
// //             ...prev,
// //             [employeeName]: value,
// //         }));
// //     };

// //     return (
// //         <div className="attendance-container">
// //             <h2>Attendance Report</h2>
// //             <div className="filters">
// //                 {/* Month Dropdown */}
// //                 <label>Month:</label>
// //                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
// //                     {moment.months().map((m, index) => (
// //                         <option key={index} value={String(index + 1).padStart(2, "0")}>
// //                             {m}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 {/* Year Dropdown */}
// //                 <label>Year:</label>
// //                 <select value={year} onChange={(e) => setYear(e.target.value)}>
// //                     {[...Array(10)].map((_, i) => {
// //                         const currentYear = moment().year();
// //                         return (
// //                             <option key={i} value={currentYear - i}>
// //                                 {currentYear - i}
// //                             </option>
// //                         );
// //                     })}
// //                 </select>

// //                 {/* Employee Dropdown */}
// //                 <label>Select Employee:</label>
// //                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
// //                     <option value="">All Employees</option>
// //                     {employeeList.map((emp) => (
// //                         <option key={emp.employeeId} value={emp.employeeName}>
// //                             {emp.employeeName}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <button className="export-btn" onClick={exportToExcel}>
// //                     Export
// //                 </button>
// //             </div>

// //             <div className="table-container">
// //                 <table className="attendance-table">
// //                     <thead>
// //                         <tr>
// //                             <th>Employee Name</th>
// //                             {[...Array(fullMonthDays)].map((_, i) => (
// //                                 <th key={i}>
// //                                     {moment(`${year}-${month}`, "YYYY-MM")
// //                                         .date(i + 1)
// //                                         .format("DD")}
// //                                 </th>
// //                             ))}
// //                             <th>Total Working Days</th>
// //                             <th>Total Present</th>
// //                             <th>Total Absent</th>
// //                             <th>Salary</th>
// //                             <th>Final Salary</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {employeeList
// //                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
// //                             .map((emp) => {
// //                                 const today = moment();
// //                                 const doj = moment(emp.dateOfJoining);
// //                                 let totalPresent = 0;
// //                                 let totalAbsent = 0;
// //                                 let halfDayCount = 0;

// //                                 // Prepare an array for status for each day (to use for deduction calculation)
// //                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
// //                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
// //                                     if (date.isBefore(doj, "day")) return "-";
// //                                     if (date.isAfter(today, "day")) return "";
                                    
// //                                     let status = "P"; // default is Present

// //                                     // Check punch data first
// //                                     if (
// //                                         punchData[emp.employeeName] &&
// //                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
// //                                     ) {
// //                                         status = "P";
// //                                     } else {
// //                                         // Check leave data
// //                                         if (leaveData[emp.employeeName]) {
// //                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
// //                                         } else {
// //                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
// //                                             if (date.day() === 0) {
// //                                                 status = "S"; // Sunday
// //                                             }
// //                                         }
// //                                     }

// //                                     // Update totals for deduction calculation:
// //                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
// //                                     if (status === "LOP") totalAbsent++;
// //                                     if (status === "H") halfDayCount++;
// //                                     // Also, count present if status is one of these values:
// //                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
// //                                     return status;
// //                                 });

// //                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
// //                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
// //                                 // Get salary for the employee from state (if any)
// //                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
// //                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
// //                                 const finalSalary = enteredSalary
// //                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
// //                                     : "";

// //                                 return (
                                

// //                                     <tr key={emp.employeeId}>
// //                                         <td className="employee-name">{emp.employeeName}</td>
// //                                         {dailyStatuses.map((status, i) => (
// //                                             <td key={i} className={`status ${status.toLowerCase()}`}>
// //                                                 {status}
// //                                             </td>
// //                                         ))}
// //                                         <td>{totalWorkingDays}</td>
// //                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
// //                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
// //                                         <td>
// //                                             <input
// //                                                 type="text"
// //                                                 className="salary-input"
// //                                                 placeholder="Enter Salary"
// //                                                 value={salaryInputs[emp.employeeName] || ""}
// //                                                 onChange={(e) =>
// //                                                     handleSalaryChange(emp.employeeName, e.target.value)
// //                                                 }
// //                                             />
// //                                         </td>
// //                                         <td>{finalSalary}</td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AttendanceReport;





// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import moment from "moment";
// // import * as XLSX from "xlsx";
// // import "./AttendanceReport.css";

// // const AttendanceReport = () => {
// //     const [leaveData, setLeaveData] = useState({});
// //     const [punchData, setPunchData] = useState({});
// //     const [employeeList, setEmployeeList] = useState([]);
// //     const [selectedEmployee, setSelectedEmployee] = useState("");
// //     const [month, setMonth] = useState(moment().format("MM"));
// //     const [year, setYear] = useState(moment().format("YYYY"));
// //     // New state for salary inputs; keys: employeeName, value: salary amount
// //     const [salaryInputs, setSalaryInputs] = useState({});

// //     // Load salary inputs from localStorage on component mount
// //     useEffect(() => {
// //         const storedSalary = localStorage.getItem("salaryInputs");
// //         if (storedSalary) {
// //             setSalaryInputs(JSON.parse(storedSalary));
// //         }
// //     }, []);

// //     // Update localStorage whenever salaryInputs changes
// //     useEffect(() => {
// //         localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
// //     }, [salaryInputs]);

// //     useEffect(() => {
// //         fetchEmployeeList();
// //     }, []);

// //     useEffect(() => {
// //         if (year && month) {
// //             fetchLeaveData(year, month);
// //             fetchPunchData(year, month);
// //         }
// //     }, [year, month]);

// //     const fetchEmployeeList = async () => {
// //         try {
// //             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
// //             if (response.data.status === "Success") {
// //                 setEmployeeList(response.data.data);
// //             }
// //         } catch (err) {
// //             console.error("Error fetching employee list:", err);
// //         }
// //     };

// //     const fetchLeaveData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const leaveMap = {};

// //             formattedData.forEach((leave) => {
// //                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
// //                 leaveMap[leave.employeeName].push({
// //                     startDate: leave.startDate,
// //                     endDate: leave.endDate,
// //                     leaveTypes: leave.leaveTypes,
// //                     permissionHours: leave.permissionHours || 0,
// //                 });
// //             });

// //             setLeaveData(leaveMap);
// //         } catch (error) {
// //             console.error("Error fetching leave data:", error);
// //         }
// //     };

// //     const fetchPunchData = async (selectedYear, selectedMonth) => {
// //         try {
// //             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .startOf("month")
// //                 .format("YYYY-MM-DD");
// //             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
// //                 .endOf("month")
// //                 .format("YYYY-MM-DD");
// //             const response = await axios.post(
// //                 `${process.env.REACT_APP_API_URL}/dailypunch`,
// //                 { startDate, endDate }
// //             );

// //             const formattedData = response.data.data || [];
// //             const punchMap = {};

// //             formattedData.forEach((punch) => {
// //                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
// //                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
// //                 punchMap[punch.employeeName].push(punchDate);
// //             });

// //             setPunchData(punchMap);
// //         } catch (error) {
// //             console.error("Error fetching punch data:", error);
// //         }
// //     };

// //     // Returns the leave symbol for a given date based on employee leave data.
// //     const getLeaveSymbol = (date, employeeLeaves) => {
// //         const today = moment();
// //         if (moment(date).isAfter(today, "day")) return "";
// //         if (moment(date).day() === 0) return "S"; // Sunday

// //         let leaveSymbol = "P"; // Default status is Present
// //         let totalPermissionHours = 0;

// //         employeeLeaves?.forEach((leave) => {
// //             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
// //                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
// //                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
// //                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
// //                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
// //                 totalPermissionHours += leave.permissionHours;
// //             }
// //         });

// //         if (totalPermissionHours > 2) {
// //             return "H"; // Half-day deduction (counts as 0.5 day)
// //         } else if (totalPermissionHours > 0) {
// //             return "PE"; // Partial Leave
// //         }

// //         return leaveSymbol; // 'P' if no other conditions met
// //     };

// //     const exportToExcel = () => {
// //         // Select the attendance table
// //         const table = document.querySelector(".attendance-table");
        
// //         // Convert table to a worksheet
// //         const worksheet = XLSX.utils.table_to_sheet(table);
    
// //         // Add salary column manually to each row
// //         employeeList.forEach((employee, index) => {
// //             const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
// //             worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
// //         });
    
// //         // Append salary column header
// //         worksheet["AJ"] = { v: "Salary" };
    
// //         // Create a workbook and add the worksheet
// //         const workbook = XLSX.utils.book_new();
// //         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
// //         // Save the Excel file
// //         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
// //     };
    
// //     // Compute Total Working Days based on current date if the selected month is current.
// //     const currentYearStr = moment().format("YYYY");
// //     const currentMonthStr = moment().format("MM");
// //     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
// //     const totalWorkingDays =
// //         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

// //     // Handle change in salary input
// //     const handleSalaryChange = (employeeName, value) => {
// //         setSalaryInputs((prev) => ({
// //             ...prev,
// //             [employeeName]: value,
// //         }));
// //     };

// //     return (
// //         <div className="attendance-container">
// //             <h2>Attendance Report</h2>
// //             <div className="filters">
// //                 {/* Month Dropdown */}
// //                 <label>Month:</label>
// //                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
// //                     {moment.months().map((m, index) => (
// //                         <option key={index} value={String(index + 1).padStart(2, "0")}>
// //                             {m}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 {/* Year Dropdown */}
// //                 <label>Year:</label>
// //                 <select value={year} onChange={(e) => setYear(e.target.value)}>
// //                     {[...Array(10)].map((_, i) => {
// //                         const currentYear = moment().year();
// //                         return (
// //                             <option key={i} value={currentYear - i}>
// //                                 {currentYear - i}
// //                             </option>
// //                         );
// //                     })}
// //                 </select>

// //                 {/* Employee Dropdown */}
// //                 <label>Select Employee:</label>
// //                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
// //                     <option value="">All Employees</option>
// //                     {employeeList.map((emp) => (
// //                         <option key={emp.employeeId} value={emp.employeeName}>
// //                             {emp.employeeName}
// //                         </option>
// //                     ))}
// //                 </select>

// //                 <button className="export-btn" onClick={exportToExcel}>
// //                     Export
// //                 </button>
// //             </div>

// //             <div className="table-container">
// //                 <table className="attendance-table">
// //                     <thead>
// //                         <tr>
// //                             {/* New Serial Number Column */}
// //                             <th>S.No</th>
// //                             <th>Employee Name</th>
// //                             {[...Array(fullMonthDays)].map((_, i) => (
// //                                 <th key={i}>
// //                                     {moment(`${year}-${month}`, "YYYY-MM")
// //                                         .date(i + 1)
// //                                         .format("DD")}
// //                                 </th>
// //                             ))}
// //                             <th>Total Working Days</th>
// //                             <th>Total Present</th>
// //                             <th>Total Absent</th>
// //                             <th>Salary</th>
// //                             <th>Final Salary</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {employeeList
// //                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
// //                             .map((emp, index) => {
// //                                 const today = moment();
// //                                 const doj = moment(emp.dateOfJoining);
// //                                 let totalPresent = 0;
// //                                 let totalAbsent = 0;
// //                                 let halfDayCount = 0;

// //                                 // Prepare an array for status for each day (to use for deduction calculation)
// //                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
// //                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
// //                                     if (date.isBefore(doj, "day")) return "-";
// //                                     if (date.isAfter(today, "day")) return "";
                                    
// //                                     let status = "P"; // default is Present

// //                                     // Check punch data first
// //                                     if (
// //                                         punchData[emp.employeeName] &&
// //                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
// //                                     ) {
// //                                         status = "P";
// //                                     } else {
// //                                         // Check leave data
// //                                         if (leaveData[emp.employeeName]) {
// //                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
// //                                         } else {
// //                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
// //                                             if (date.day() === 0) {
// //                                                 status = "S"; // Sunday
// //                                             }
// //                                         }
// //                                     }

// //                                     // Update totals for deduction calculation:
// //                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
// //                                     if (status === "LOP") totalAbsent++;
// //                                     if (status === "H") halfDayCount++;
// //                                     // Also, count present if status is one of these values:
// //                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
// //                                     return status;
// //                                 });

// //                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
// //                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
// //                                 // Get salary for the employee from state (if any)
// //                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
// //                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
// //                                 const finalSalary = enteredSalary
// //                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
// //                                     : "";

// //                                 return (
// //                                     <tr key={emp.employeeId}>
// //                                         {/* Serial Number */}
// //                                         <td>{index + 1}</td>
// //                                         <td className="employee-name">{emp.employeeName}</td>
// //                                         {dailyStatuses.map((status, i) => (
// //                                             <td key={i} className={`status ${status.toLowerCase()}`}>
// //                                                 {status}
// //                                             </td>
// //                                         ))}
// //                                         <td>{totalWorkingDays}</td>
// //                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
// //                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
// //                                         <td>
// //                                             <input
// //                                                 type="text"
// //                                                 className="salary-input"
// //                                                 placeholder="Enter Salary"
// //                                                 value={salaryInputs[emp.employeeName] || ""}
// //                                                 onChange={(e) =>
// //                                                     handleSalaryChange(emp.employeeName, e.target.value)
// //                                                 }
// //                                             />
// //                                         </td>
// //                                         <td>{finalSalary}</td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AttendanceReport;








// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import "./AttendanceReport.css";

// const AttendanceReport = () => {
//     const [leaveData, setLeaveData] = useState({});
//     const [punchData, setPunchData] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [month, setMonth] = useState(moment().format("MM"));
//     const [year, setYear] = useState(moment().format("YYYY"));
//     // New state for salary inputs; keys: employeeName, value: salary amount
//     const [salaryInputs, setSalaryInputs] = useState({});

//     // Load salary inputs from localStorage on component mount
//     useEffect(() => {
//         const storedSalary = localStorage.getItem("salaryInputs");
//         if (storedSalary) {
//             setSalaryInputs(JSON.parse(storedSalary));
//         }
//     }, []);

//     // Update localStorage whenever salaryInputs changes
//     useEffect(() => {
//         localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
//     }, [salaryInputs]);

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     useEffect(() => {
//         if (year && month) {
//             fetchLeaveData(year, month);
//             fetchPunchData(year, month);
//         }
//     }, [year, month]);

//     const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === "Success") {
//                 setEmployeeList(response.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching employee list:", err);
//         }
//     };

//     const fetchLeaveData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const leaveMap = {};

//             formattedData.forEach((leave) => {
//                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
//                 leaveMap[leave.employeeName].push({
//                     startDate: leave.startDate,
//                     endDate: leave.endDate,
//                     leaveTypes: leave.leaveTypes,
//                     permissionHours: leave.permissionHours || 0,
//                 });
//             });

//             setLeaveData(leaveMap);
//         } catch (error) {
//             console.error("Error fetching leave data:", error);
//         }
//     };

//     const fetchPunchData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/dailypunch`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const punchMap = {};

//             formattedData.forEach((punch) => {
//                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
//                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
//                 punchMap[punch.employeeName].push(punchDate);
//             });

//             setPunchData(punchMap);
//         } catch (error) {
//             console.error("Error fetching punch data:", error);
//         }
//     };

//     // Returns the leave symbol for a given date based on employee leave data.
//     const getLeaveSymbol = (date, employeeLeaves) => {
//         const today = moment();
//         if (moment(date).isAfter(today, "day")) return "";
//         if (moment(date).day() === 0) return "S"; // Sunday

//         let leaveSymbol = "P"; // Default status is Present
//         let totalPermissionHours = 0;

//         employeeLeaves?.forEach((leave) => {
//             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
//                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
//                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
//                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
//                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
//                 totalPermissionHours += leave.permissionHours;
//             }
//         });

//         if (totalPermissionHours > 2) {
//             return "H"; // Half-day deduction (counts as 0.5 day)
//         } else if (totalPermissionHours > 0) {
//             return "PE"; // Partial Leave
//         }

//         return leaveSymbol; // 'P' if no other conditions met
//     };

//     const exportToExcel = () => {
//         // Select the attendance table
//         const table = document.querySelector(".attendance-table");
        
//         // Convert table to a worksheet
//         const worksheet = XLSX.utils.table_to_sheet(table);
    
//         // Add salary column manually to each row
//         employeeList.forEach((employee, index) => {
//             const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
//             worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
//         });
    
//         // Append salary column header
//         worksheet["AJ"] = { v: "Salary" };
    
//         // Create a workbook and add the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
//         // Save the Excel file
//         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
//     };
    
//     // Compute Total Working Days based on current date if the selected month is current.
//     const currentYearStr = moment().format("YYYY");
//     const currentMonthStr = moment().format("MM");
//     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
//     const totalWorkingDays =
//         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

//     // Handle change in salary input
//     const handleSalaryChange = (employeeName, value) => {
//         setSalaryInputs((prev) => ({
//             ...prev,
//             [employeeName]: value,
//         }));
//     };

//     return (
//         <div className="attendance-container">
//             <h2>Attendance Report</h2>
//             <div className="filters">
//                 {/* Month Dropdown */}
//                 <label>Month:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                     {moment.months().map((m, index) => (
//                         <option key={index} value={String(index + 1).padStart(2, "0")}>
//                             {m}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Year Dropdown */}
//                 <label>Year:</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                     {[...Array(10)].map((_, i) => {
//                         const currentYear = moment().year();
//                         return (
//                             <option key={i} value={currentYear - i}>
//                                 {currentYear - i}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 {/* Employee Dropdown */}
//                 <label>Select Employee:</label>
//                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//                     <option value="">All Employees</option>
//                     {employeeList.map((emp) => (
//                         <option key={emp.employeeId} value={emp.employeeName}>
//                             {emp.employeeName}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="export-btn" onClick={exportToExcel}>
//                     Export
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table className="attendance-table">
//                     <thead>
//                         <tr>
//                             {/* New Serial Number Column */}
//                             <th>S.No</th>
//                             <th>Employee Name</th>
//                             {[...Array(fullMonthDays)].map((_, i) => (
//                                 <th key={i}>
//                                     {moment(`${year}-${month}`, "YYYY-MM")
//                                         .date(i + 1)
//                                         .format("DD")}
//                                 </th>
//                             ))}
//                             <th>Total Working Days</th>
//                             <th>Total Present</th>
//                             <th>Total Absent</th>
//                             <th>Salary</th>
//                             <th>Final Salary</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employeeList
//                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
//                             .map((emp, index) => {
//                                 const today = moment();
//                                 const doj = moment(emp.dateOfJoining);
//                                 let totalPresent = 0;
//                                 let totalAbsent = 0;
//                                 let halfDayCount = 0;

//                                 // Prepare an array for status for each day (to use for deduction calculation)
//                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
//                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
                                    
//                                     // If the date is before the joining date, mark as LOP and count as absent.
//                                     if (date.isBefore(doj, "day")) {
//                                         totalAbsent++;
//                                         return "-";
//                                     }
                                    
//                                     if (date.isAfter(today, "day")) return "";
                                    
//                                     let status = "P"; // default is Present

//                                     // Check punch data first
//                                     if (
//                                         punchData[emp.employeeName] &&
//                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
//                                     ) {
//                                         status = "P";
//                                     } else {
//                                         // Check leave data
//                                         if (leaveData[emp.employeeName]) {
//                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
//                                         } else {
//                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
//                                             if (date.day() === 0) {
//                                                 status = "S"; // Sunday
//                                             }
//                                         }
//                                     }

//                                     // Update totals for deduction calculation:
//                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
//                                     if (status === "LOP") totalAbsent++;
//                                     if (status === "H") halfDayCount++;
//                                     // Also, count present if status is one of these values:
//                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
//                                     return status;
//                                 });

//                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
//                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
//                                 // Get salary for the employee from state (if any)
//                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
//                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
//                                 const finalSalary = enteredSalary
//                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
//                                     : "";

//                                 return (
//                                     <tr key={emp.employeeId}>
//                                         {/* Serial Number */}
//                                         <td>{index + 1}</td>
//                                         <td className="employee-name">{emp.employeeName}</td>
//                                         {dailyStatuses.map((status, i) => (
//                                             <td key={i} className={`status ${status.toLowerCase()}`}>
//                                                 {status}
//                                             </td>
//                                         ))}
//                                         <td>{totalWorkingDays}</td>
//                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
//                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="salary-input"
//                                                 placeholder="Enter Salary"
//                                                 value={salaryInputs[emp.employeeName] || ""}
//                                                 onChange={(e) =>
//                                                     handleSalaryChange(emp.employeeName, e.target.value)
//                                                 }
//                                             />
//                                         </td>
//                                         <td>{finalSalary}</td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AttendanceReport;







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import "./AttendanceReport.css";

// const AttendanceReport = () => {
//     const [leaveData, setLeaveData] = useState({});
//     const [punchData, setPunchData] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [month, setMonth] = useState(moment().format("MM"));
//     const [year, setYear] = useState(moment().format("YYYY"));

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     useEffect(() => {
//         if (year && month) {
//             fetchLeaveData(year, month);
//             fetchPunchData(year, month);
//         }
//     }, [year, month]);

//     const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === "Success") {
//                 setEmployeeList(response.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching employee list:", err);
//         }
//     };

//     const fetchLeaveData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const leaveMap = {};

//             formattedData.forEach((leave) => {
//                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
//                 leaveMap[leave.employeeName].push({
//                     startDate: leave.startDate,
//                     endDate: leave.endDate,
//                     leaveTypes: leave.leaveTypes,
//                     permissionHours: leave.permissionHours || 0,
//                 });
//             });

//             setLeaveData(leaveMap);
//         } catch (error) {
//             console.error("Error fetching leave data:", error);
//         }
//     };

//     const fetchPunchData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/dailypunch`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const punchMap = {};

//             formattedData.forEach((punch) => {
//                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
//                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
//                 punchMap[punch.employeeName].push(punchDate);
//             });

//             setPunchData(punchMap);
//         } catch (error) {
//             console.error("Error fetching punch data:", error);
//         }
//     };

//     const getLeaveSymbol = (date, employeeLeaves) => {
//         const today = moment();
//         if (moment(date).isAfter(today, "day")) return "";
//         if (moment(date).day() === 0) return "S"; // Sunday

//         let leaveSymbol = "P"; // Assume present by default
//         let totalPermissionHours = 0;

//         employeeLeaves?.forEach((leave) => {
//             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
//                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
//                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
//                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
//                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
//                 totalPermissionHours += leave.permissionHours;
//             }
//         });

//         if (totalPermissionHours > 2) {
//             return "H"; // Half-day
//         } else if (totalPermissionHours > 0) {
//             return "PE"; // Partial Leave
//         }

//         return leaveSymbol; // 'P' for present if no other conditions were met
//     };

//     const exportToExcel = () => {
//         const table = document.querySelector(".attendance-table");
//         const workbook = XLSX.utils.table_to_book(table);
//         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
//     };

//     // Compute Total Working Days (or Hours) based on the current date if the selected month is current.
//     const currentYearStr = moment().format("YYYY");
//     const currentMonthStr = moment().format("MM");
//     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
//     const totalWorkingDays =
//         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

//     return (
//         <div className="attendance-container">
//             <h2>Attendance Report</h2>
//             <div className="filters">
//                 {/* Month Dropdown */}
//                 <label>Month:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                     {moment.months().map((m, index) => (
//                         <option key={index} value={String(index + 1).padStart(2, "0")}>
//                             {m}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Year Dropdown */}
//                 <label>Year:</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                     {[...Array(10)].map((_, i) => {
//                         const currentYear = moment().year();
//                         return (
//                             <option key={i} value={currentYear - i}>
//                                 {currentYear - i}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 {/* Employee Dropdown */}
//                 <label>Select Employee:</label>
//                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//                     <option value="">All Employees</option>
//                     {employeeList.map((emp) => (
//                         <option key={emp.employeeId} value={emp.employeeName}>
//                             {emp.employeeName}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="export-btn" onClick={exportToExcel}>
//                     Export
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table className="attendance-table">
//                     <thead>
//                         <tr>
//                             <th>Employee Name</th>
//                             {[...Array(fullMonthDays)].map((_, i) => (
//                                 <th key={i}>
//                                     {moment(`${year}-${month}`, "YYYY-MM")
//                                         .date(i + 1)
//                                         .format("DD")}
//                                 </th>
//                             ))}
//                             <th>Total Working Days</th>
//                             <th>Total Present</th>
//                             <th>Total Absent</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employeeList
//                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee) // Filter by Employee
//                             .map((emp) => {
//                                 const today = moment();
//                                 const doj = moment(emp.dateOfJoining);
//                                 let totalPresent = 0;
//                                 let totalAbsent = 0;
//                                 let halfDayCount = 0;

//                                 return (
//                                     <tr key={emp.employeeId}>
//                                         <td className="employee-name">{emp.employeeName}</td>
//                                         {[...Array(fullMonthDays)].map((_, i) => {
//                                             const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
//                                             if (date.isBefore(doj, "day")) return <td key={i}>-</td>;
//                                             if (date.isAfter(today, "day")) return <td key={i}></td>;

//                                             // Check for punch data first
//                                             let status = "P"; // Default to Present
//                                             if (
//                                                 punchData[emp.employeeName] &&
//                                                 punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
//                                             ) {
//                                                 status = "P";
//                                             } else {
//                                                 // If no punch, check the leave data
//                                                 if (leaveData[emp.employeeName]) {
//                                                     status = getLeaveSymbol(date, leaveData[emp.employeeName]);
//                                                 } else {
//                                                     // If no leave data, check for Sundays
//                                                     if (date.day() === 0) {
//                                                         status = "S"; // Sunday
//                                                     }
//                                                 }
//                                             }

//                                             // Calculate totals
//                                             if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
//                                             if (status === "H") halfDayCount++;
//                                             if (status === "LOP") totalAbsent++;

//                                             return (
//                                                 <td key={i} className={`status ${status.toLowerCase()}`}>
//                                                     {status}
//                                                 </td>
//                                             );
//                                         })}

//                                         <td>{totalWorkingDays}</td>
//                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
//                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AttendanceReport;









// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import "./AttendanceReport.css";

// const AttendanceReport = () => {
//     const [leaveData, setLeaveData] = useState({});
//     const [punchData, setPunchData] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [month, setMonth] = useState(moment().format("MM"));
//     const [year, setYear] = useState(moment().format("YYYY"));
//     // New state for salary inputs; keys: employeeName, value: salary amount
//     const [salaryInputs, setSalaryInputs] = useState({});

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     useEffect(() => {
//         if (year && month) {
//             fetchLeaveData(year, month);
//             fetchPunchData(year, month);
//         }
//     }, [year, month]);

//     const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === "Success") {
//                 setEmployeeList(response.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching employee list:", err);
//         }
//     };

//     const fetchLeaveData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const leaveMap = {};

//             formattedData.forEach((leave) => {
//                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
//                 leaveMap[leave.employeeName].push({
//                     startDate: leave.startDate,
//                     endDate: leave.endDate,
//                     leaveTypes: leave.leaveTypes,
//                     permissionHours: leave.permissionHours || 0,
//                 });
//             });

//             setLeaveData(leaveMap);
//         } catch (error) {
//             console.error("Error fetching leave data:", error);
//         }
//     };

//     const fetchPunchData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/dailypunch`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const punchMap = {};

//             formattedData.forEach((punch) => {
//                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
//                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
//                 punchMap[punch.employeeName].push(punchDate);
//             });

//             setPunchData(punchMap);
//         } catch (error) {
//             console.error("Error fetching punch data:", error);
//         }
//     };

//     // Returns the leave symbol for a given date based on employee leave data.
//     const getLeaveSymbol = (date, employeeLeaves) => {
//         const today = moment();
//         if (moment(date).isAfter(today, "day")) return "";
//         if (moment(date).day() === 0) return "S"; // Sunday

//         let leaveSymbol = "P"; // Default status is Present
//         let totalPermissionHours = 0;

//         employeeLeaves?.forEach((leave) => {
//             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
//                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
//                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
//                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
//                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
//                 totalPermissionHours += leave.permissionHours;
//             }
//         });

//         if (totalPermissionHours > 2) {
//             return "H"; // Half-day deduction (counts as 0.5 day)
//         } else if (totalPermissionHours > 0) {
//             return "PE"; // Partial Leave
//         }

//         return leaveSymbol; // 'P' if no other conditions met
//     };

//     const exportToExcel = () => {
//         const table = document.querySelector(".attendance-table");
//         const workbook = XLSX.utils.table_to_book(table);
//         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
//     };

//     // Compute Total Working Days based on current date if the selected month is current.
//     const currentYearStr = moment().format("YYYY");
//     const currentMonthStr = moment().format("MM");
//     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
//     const totalWorkingDays =
//         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

//     // Handle change in salary input
//     const handleSalaryChange = (employeeName, value) => {
//         setSalaryInputs((prev) => ({
//             ...prev,
//             [employeeName]: value,
//         }));
//     };

//     return (
//         <div className="attendance-container">
//             <h2>Attendance Report</h2>
//             <div className="filters">
//                 {/* Month Dropdown */}
//                 <label>Month:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                     {moment.months().map((m, index) => (
//                         <option key={index} value={String(index + 1).padStart(2, "0")}>
//                             {m}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Year Dropdown */}
//                 <label>Year:</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                     {[...Array(10)].map((_, i) => {
//                         const currentYear = moment().year();
//                         return (
//                             <option key={i} value={currentYear - i}>
//                                 {currentYear - i}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 {/* Employee Dropdown */}
//                 <label>Select Employee:</label>
//                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//                     <option value="">All Employees</option>
//                     {employeeList.map((emp) => (
//                         <option key={emp.employeeId} value={emp.employeeName}>
//                             {emp.employeeName}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="export-btn" onClick={exportToExcel}>
//                     Export
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table className="attendance-table">
//                     <thead>
//                         <tr>
//                             <th>Employee Name</th>
//                             {[...Array(fullMonthDays)].map((_, i) => (
//                                 <th key={i}>
//                                     {moment(`${year}-${month}`, "YYYY-MM")
//                                         .date(i + 1)
//                                         .format("DD")}
//                                 </th>
//                             ))}
//                             <th>Total Working Days</th>
//                             <th>Total Present</th>
//                             <th>Total Absent</th>
//                             <th>Salary</th>
//                             <th>Final Salary</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employeeList
//                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
//                             .map((emp) => {
//                                 const today = moment();
//                                 const doj = moment(emp.dateOfJoining);
//                                 let totalPresent = 0;
//                                 let totalAbsent = 0;
//                                 let halfDayCount = 0;

//                                 // Prepare an array for status for each day (to use for deduction calculation)
//                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
//                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
//                                     if (date.isBefore(doj, "day")) return "-";
//                                     if (date.isAfter(today, "day")) return "";
                                    
//                                     let status = "P"; // default is Present

//                                     // Check punch data first
//                                     if (
//                                         punchData[emp.employeeName] &&
//                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
//                                     ) {
//                                         status = "P";
//                                     } else {
//                                         // Check leave data
//                                         if (leaveData[emp.employeeName]) {
//                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
//                                         } else {
//                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
//                                             if (date.day() === 0) {
//                                                 status = "S"; // Sunday
//                                             }
//                                         }
//                                     }

//                                     // Update totals for deduction calculation:
//                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
//                                     if (status === "LOP") totalAbsent++;
//                                     if (status === "H") halfDayCount++;
//                                     // Also, count present if status is one of these values:
//                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
//                                     return status;
//                                 });

//                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
//                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
//                                 // Get salary for the employee from state (if any)
//                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
//                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
//                                 const finalSalary = enteredSalary
//                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
//                                     : "";

//                                 return (
//                                     <tr key={emp.employeeId}>
//                                         <td className="employee-name">{emp.employeeName}</td>
//                                         {dailyStatuses.map((status, i) => (
//                                             <td key={i} className={`status ${status.toLowerCase()}`}>
//                                                 {status}
//                                             </td>
//                                         ))}
//                                         <td>{totalWorkingDays}</td>
//                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
//                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="salary-input"
//                                                 placeholder="Enter Salary"
//                                                 value={salaryInputs[emp.employeeName] || ""}
//                                                 onChange={(e) =>
//                                                     handleSalaryChange(emp.employeeName, e.target.value)
//                                                 }
//                                             />
//                                         </td>
//                                         <td>{finalSalary}</td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AttendanceReport;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import "./AttendanceReport.css";

// const AttendanceReport = () => {
//     const [leaveData, setLeaveData] = useState({});
//     const [punchData, setPunchData] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [month, setMonth] = useState(moment().format("MM"));
//     const [year, setYear] = useState(moment().format("YYYY"));
//     // New state for salary inputs; keys: employeeName, value: salary amount
//     const [salaryInputs, setSalaryInputs] = useState({});

//     // Load salary inputs from localStorage on component mount
//     useEffect(() => {
//         const storedSalary = localStorage.getItem("salaryInputs");
//         if (storedSalary) {
//             setSalaryInputs(JSON.parse(storedSalary));
//         }
//     }, []);

//     // Update localStorage whenever salaryInputs changes
//     useEffect(() => {
//         localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
//     }, [salaryInputs]);

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     useEffect(() => {
//         if (year && month) {
//             fetchLeaveData(year, month);
//             fetchPunchData(year, month);
//         }
//     }, [year, month]);

//     const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === "Success") {
//                 setEmployeeList(response.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching employee list:", err);
//         }
//     };

//     const fetchLeaveData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const leaveMap = {};

//             formattedData.forEach((leave) => {
//                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
//                 leaveMap[leave.employeeName].push({
//                     startDate: leave.startDate,
//                     endDate: leave.endDate,
//                     leaveTypes: leave.leaveTypes,
//                     permissionHours: leave.permissionHours || 0,
//                 });
//             });

//             setLeaveData(leaveMap);
//         } catch (error) {
//             console.error("Error fetching leave data:", error);
//         }
//     };

//     const fetchPunchData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/dailypunch`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const punchMap = {};

//             formattedData.forEach((punch) => {
//                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
//                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
//                 punchMap[punch.employeeName].push(punchDate);
//             });

//             setPunchData(punchMap);
//         } catch (error) {
//             console.error("Error fetching punch data:", error);
//         }
//     };

//     // Returns the leave symbol for a given date based on employee leave data.
//     const getLeaveSymbol = (date, employeeLeaves) => {
//         const today = moment();
//         if (moment(date).isAfter(today, "day")) return "";
//         if (moment(date).day() === 0) return "S"; // Sunday

//         let leaveSymbol = "P"; // Default status is Present
//         let totalPermissionHours = 0;

//         employeeLeaves?.forEach((leave) => {
//             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
//                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
//                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
//                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
//                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
//                 totalPermissionHours += leave.permissionHours;
//             }
//         });

//         if (totalPermissionHours > 2) {
//             return "H"; // Half-day deduction (counts as 0.5 day)
//         } else if (totalPermissionHours > 0) {
//             return "PE"; // Partial Leave
//         }

//         return leaveSymbol; // 'P' if no other conditions met
//     };

//     const exportToExcel = () => {
//         // Select the attendance table
//         const table = document.querySelector(".attendance-table");
        
//         // Convert table to a worksheet
//         const worksheet = XLSX.utils.table_to_sheet(table);
    
//         // Add salary column manually to each row
//         employeeList.forEach((employee, index) => {
//             const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
//             worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
//         });
    
//         // Append salary column header
//         worksheet["AJ"] = { v: "Salary" };
    
//         // Create a workbook and add the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
//         // Save the Excel file
//         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
//     };
    
//     // Compute Total Working Days based on current date if the selected month is current.
//     const currentYearStr = moment().format("YYYY");
//     const currentMonthStr = moment().format("MM");
//     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
//     const totalWorkingDays =
//         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

//     // Handle change in salary input
//     const handleSalaryChange = (employeeName, value) => {
//         setSalaryInputs((prev) => ({
//             ...prev,
//             [employeeName]: value,
//         }));
//     };

//     return (
//         <div className="attendance-container">
//             <h2>Attendance Report</h2>
//             <div className="filters">
//                 {/* Month Dropdown */}
//                 <label>Month:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                     {moment.months().map((m, index) => (
//                         <option key={index} value={String(index + 1).padStart(2, "0")}>
//                             {m}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Year Dropdown */}
//                 <label>Year:</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                     {[...Array(10)].map((_, i) => {
//                         const currentYear = moment().year();
//                         return (
//                             <option key={i} value={currentYear - i}>
//                                 {currentYear - i}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 {/* Employee Dropdown */}
//                 <label>Select Employee:</label>
//                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//                     <option value="">All Employees</option>
//                     {employeeList.map((emp) => (
//                         <option key={emp.employeeId} value={emp.employeeName}>
//                             {emp.employeeName}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="export-btn" onClick={exportToExcel}>
//                     Export
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table className="attendance-table">
//                     <thead>
//                         <tr>
//                             <th>Employee Name</th>
//                             {[...Array(fullMonthDays)].map((_, i) => (
//                                 <th key={i}>
//                                     {moment(`${year}-${month}`, "YYYY-MM")
//                                         .date(i + 1)
//                                         .format("DD")}
//                                 </th>
//                             ))}
//                             <th>Total Working Days</th>
//                             <th>Total Present</th>
//                             <th>Total Absent</th>
//                             <th>Salary</th>
//                             <th>Final Salary</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employeeList
//                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
//                             .map((emp) => {
//                                 const today = moment();
//                                 const doj = moment(emp.dateOfJoining);
//                                 let totalPresent = 0;
//                                 let totalAbsent = 0;
//                                 let halfDayCount = 0;

//                                 // Prepare an array for status for each day (to use for deduction calculation)
//                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
//                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
//                                     if (date.isBefore(doj, "day")) return "-";
//                                     if (date.isAfter(today, "day")) return "";
                                    
//                                     let status = "P"; // default is Present

//                                     // Check punch data first
//                                     if (
//                                         punchData[emp.employeeName] &&
//                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
//                                     ) {
//                                         status = "P";
//                                     } else {
//                                         // Check leave data
//                                         if (leaveData[emp.employeeName]) {
//                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
//                                         } else {
//                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
//                                             if (date.day() === 0) {
//                                                 status = "S"; // Sunday
//                                             }
//                                         }
//                                     }

//                                     // Update totals for deduction calculation:
//                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
//                                     if (status === "LOP") totalAbsent++;
//                                     if (status === "H") halfDayCount++;
//                                     // Also, count present if status is one of these values:
//                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
//                                     return status;
//                                 });

//                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
//                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
//                                 // Get salary for the employee from state (if any)
//                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
//                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
//                                 const finalSalary = enteredSalary
//                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
//                                     : "";

//                                 return (
                                

//                                     <tr key={emp.employeeId}>
//                                         <td className="employee-name">{emp.employeeName}</td>
//                                         {dailyStatuses.map((status, i) => (
//                                             <td key={i} className={`status ${status.toLowerCase()}`}>
//                                                 {status}
//                                             </td>
//                                         ))}
//                                         <td>{totalWorkingDays}</td>
//                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
//                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="salary-input"
//                                                 placeholder="Enter Salary"
//                                                 value={salaryInputs[emp.employeeName] || ""}
//                                                 onChange={(e) =>
//                                                     handleSalaryChange(emp.employeeName, e.target.value)
//                                                 }
//                                             />
//                                         </td>
//                                         <td>{finalSalary}</td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AttendanceReport;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import "./AttendanceReport.css";

// const AttendanceReport = () => {
//     const [leaveData, setLeaveData] = useState({});
//     const [punchData, setPunchData] = useState({});
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("");
//     const [month, setMonth] = useState(moment().format("MM"));
//     const [year, setYear] = useState(moment().format("YYYY"));
//     // New state for salary inputs; keys: employeeName, value: salary amount
//     const [salaryInputs, setSalaryInputs] = useState({});

//     // Load salary inputs from localStorage on component mount
//     useEffect(() => {
//         const storedSalary = localStorage.getItem("salaryInputs");
//         if (storedSalary) {
//             setSalaryInputs(JSON.parse(storedSalary));
//         }
//     }, []);

//     // Update localStorage whenever salaryInputs changes
//     useEffect(() => {
//         localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
//     }, [salaryInputs]);

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     useEffect(() => {
//         if (year && month) {
//             fetchLeaveData(year, month);
//             fetchPunchData(year, month);
//         }
//     }, [year, month]);

//     const fetchEmployeeList = async () => {
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
//             if (response.data.status === "Success") {
//                 setEmployeeList(response.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching employee list:", err);
//         }
//     };

//     const fetchLeaveData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const leaveMap = {};

//             formattedData.forEach((leave) => {
//                 leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
//                 leaveMap[leave.employeeName].push({
//                     startDate: leave.startDate,
//                     endDate: leave.endDate,
//                     leaveTypes: leave.leaveTypes,
//                     permissionHours: leave.permissionHours || 0,
//                 });
//             });

//             setLeaveData(leaveMap);
//         } catch (error) {
//             console.error("Error fetching leave data:", error);
//         }
//     };

//     const fetchPunchData = async (selectedYear, selectedMonth) => {
//         try {
//             const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .startOf("month")
//                 .format("YYYY-MM-DD");
//             const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
//                 .endOf("month")
//                 .format("YYYY-MM-DD");
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/dailypunch`,
//                 { startDate, endDate }
//             );

//             const formattedData = response.data.data || [];
//             const punchMap = {};

//             formattedData.forEach((punch) => {
//                 const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
//                 punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
//                 punchMap[punch.employeeName].push(punchDate);
//             });

//             setPunchData(punchMap);
//         } catch (error) {
//             console.error("Error fetching punch data:", error);
//         }
//     };

//     // Returns the leave symbol for a given date based on employee leave data.
//     const getLeaveSymbol = (date, employeeLeaves) => {
//         const today = moment();
//         if (moment(date).isAfter(today, "day")) return "";
//         if (moment(date).day() === 0) return "S"; // Sunday

//         let leaveSymbol = "P"; // Default status is Present
//         let totalPermissionHours = 0;

//         employeeLeaves?.forEach((leave) => {
//             if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
//                 if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
//                 if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
//                 if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
//                 if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
//                 totalPermissionHours += leave.permissionHours;
//             }
//         });

//         if (totalPermissionHours > 2) {
//             return "H"; // Half-day deduction (counts as 0.5 day)
//         } else if (totalPermissionHours > 0) {
//             return "PE"; // Partial Leave
//         }

//         return leaveSymbol; // 'P' if no other conditions met
//     };

//     const exportToExcel = () => {
//         // Select the attendance table
//         const table = document.querySelector(".attendance-table");
        
//         // Convert table to a worksheet
//         const worksheet = XLSX.utils.table_to_sheet(table);
    
//         // Add salary column manually to each row
//         employeeList.forEach((employee, index) => {
//             const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
//             worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
//         });
    
//         // Append salary column header
//         worksheet["AJ"] = { v: "Salary" };
    
//         // Create a workbook and add the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
//         // Save the Excel file
//         XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
//     };
    
//     // Compute Total Working Days based on current date if the selected month is current.
//     const currentYearStr = moment().format("YYYY");
//     const currentMonthStr = moment().format("MM");
//     const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
//     const totalWorkingDays =
//         year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

//     // Handle change in salary input
//     const handleSalaryChange = (employeeName, value) => {
//         setSalaryInputs((prev) => ({
//             ...prev,
//             [employeeName]: value,
//         }));
//     };

//     return (
//         <div className="attendance-container">
//             <h2>Attendance Report</h2>
//             <div className="filters">
//                 {/* Month Dropdown */}
//                 <label>Month:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                     {moment.months().map((m, index) => (
//                         <option key={index} value={String(index + 1).padStart(2, "0")}>
//                             {m}
//                         </option>
//                     ))}
//                 </select>

//                 {/* Year Dropdown */}
//                 <label>Year:</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                     {[...Array(10)].map((_, i) => {
//                         const currentYear = moment().year();
//                         return (
//                             <option key={i} value={currentYear - i}>
//                                 {currentYear - i}
//                             </option>
//                         );
//                     })}
//                 </select>

//                 {/* Employee Dropdown */}
//                 <label>Select Employee:</label>
//                 <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
//                     <option value="">All Employees</option>
//                     {employeeList.map((emp) => (
//                         <option key={emp.employeeId} value={emp.employeeName}>
//                             {emp.employeeName}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="export-btn" onClick={exportToExcel}>
//                     Export
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table className="attendance-table">
//                     <thead>
//                         <tr>
//                             {/* New Serial Number Column */}
//                             <th>S.No</th>
//                             <th>Employee Name</th>
//                             {[...Array(fullMonthDays)].map((_, i) => (
//                                 <th key={i}>
//                                     {moment(`${year}-${month}`, "YYYY-MM")
//                                         .date(i + 1)
//                                         .format("DD")}
//                                 </th>
//                             ))}
//                             <th>Total Working Days</th>
//                             <th>Total Present</th>
//                             <th>Total Absent</th>
//                             <th>Salary</th>
//                             <th>Final Salary</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employeeList
//                             .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
//                             .map((emp, index) => {
//                                 const today = moment();
//                                 const doj = moment(emp.dateOfJoining);
//                                 let totalPresent = 0;
//                                 let totalAbsent = 0;
//                                 let halfDayCount = 0;

//                                 // Prepare an array for status for each day (to use for deduction calculation)
//                                 const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
//                                     const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
//                                     if (date.isBefore(doj, "day")) return "-";
//                                     if (date.isAfter(today, "day")) return "";
                                    
//                                     let status = "P"; // default is Present

//                                     // Check punch data first
//                                     if (
//                                         punchData[emp.employeeName] &&
//                                         punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
//                                     ) {
//                                         status = "P";
//                                     } else {
//                                         // Check leave data
//                                         if (leaveData[emp.employeeName]) {
//                                             status = getLeaveSymbol(date, leaveData[emp.employeeName]);
//                                         } else {
//                                             // If no leave data and not punched, if it's Sunday then mark as Sunday off
//                                             if (date.day() === 0) {
//                                                 status = "S"; // Sunday
//                                             }
//                                         }
//                                     }

//                                     // Update totals for deduction calculation:
//                                     // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
//                                     if (status === "LOP") totalAbsent++;
//                                     if (status === "H") halfDayCount++;
//                                     // Also, count present if status is one of these values:
//                                     if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
//                                     return status;
//                                 });

//                                 // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
//                                 const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
//                                 // Get salary for the employee from state (if any)
//                                 const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
//                                 const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
//                                 const finalSalary = enteredSalary
//                                     ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
//                                     : "";

//                                 return (
//                                     <tr key={emp.employeeId}>
//                                         {/* Serial Number */}
//                                         <td>{index + 1}</td>
//                                         <td className="employee-name">{emp.employeeName}</td>
//                                         {dailyStatuses.map((status, i) => (
//                                             <td key={i} className={`status ${status.toLowerCase()}`}>
//                                                 {status}
//                                             </td>
//                                         ))}
//                                         <td>{totalWorkingDays}</td>
//                                         <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
//                                         <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 className="salary-input"
//                                                 placeholder="Enter Salary"
//                                                 value={salaryInputs[emp.employeeName] || ""}
//                                                 onChange={(e) =>
//                                                     handleSalaryChange(emp.employeeName, e.target.value)
//                                                 }
//                                             />
//                                         </td>
//                                         <td>{finalSalary}</td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AttendanceReport;








import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import "./AttendanceReport.css";

const AttendanceReport = () => {
    const [leaveData, setLeaveData] = useState({});
    const [punchData, setPunchData] = useState({});
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [month, setMonth] = useState(moment().format("MM"));
    const [year, setYear] = useState(moment().format("YYYY"));
    // New state for salary inputs; keys: employeeName, value: salary amount
    const [salaryInputs, setSalaryInputs] = useState({});

    // Load salary inputs from localStorage on component mount
    useEffect(() => {
        const storedSalary = localStorage.getItem("salaryInputs");
        if (storedSalary) {
            setSalaryInputs(JSON.parse(storedSalary));
        }
    }, []);

    // Update localStorage whenever salaryInputs changes
    useEffect(() => {
        localStorage.setItem("salaryInputs", JSON.stringify(salaryInputs));
    }, [salaryInputs]);

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    useEffect(() => {
        if (year && month) {
            fetchLeaveData(year, month);
            fetchPunchData(year, month);
        }
    }, [year, month]);

    const fetchEmployeeList = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/employee_list/`);
            if (response.data.status === "Success") {
                setEmployeeList(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching employee list:", err);
        }
    };

    const fetchLeaveData = async (selectedYear, selectedMonth) => {
        try {
            const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
                .startOf("month")
                .format("YYYY-MM-DD");
            const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
                .endOf("month")
                .format("YYYY-MM-DD");
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
                { startDate, endDate }
            );

            const formattedData = response.data.data || [];
            const leaveMap = {};

            formattedData.forEach((leave) => {
                leaveMap[leave.employeeName] = leaveMap[leave.employeeName] || [];
                leaveMap[leave.employeeName].push({
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    leaveTypes: leave.leaveTypes,
                    permissionHours: leave.permissionHours || 0,
                });
            });

            setLeaveData(leaveMap);
        } catch (error) {
            console.error("Error fetching leave data:", error);
        }
    };

    const fetchPunchData = async (selectedYear, selectedMonth) => {
        try {
            const startDate = moment(`${selectedYear}-${selectedMonth}-01`)
                .startOf("month")
                .format("YYYY-MM-DD");
            const endDate = moment(`${selectedYear}-${selectedMonth}-01`)
                .endOf("month")
                .format("YYYY-MM-DD");
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/dailypunch`,
                { startDate, endDate }
            );

            const formattedData = response.data.data || [];
            const punchMap = {};

            formattedData.forEach((punch) => {
                const punchDate = moment(punch.punchTime).format("YYYY-MM-DD");
                punchMap[punch.employeeName] = punchMap[punch.employeeName] || [];
                punchMap[punch.employeeName].push(punchDate);
            });

            setPunchData(punchMap);
        } catch (error) {
            console.error("Error fetching punch data:", error);
        }
    };

    // Returns the leave symbol for a given date based on employee leave data.
    const getLeaveSymbol = (date, employeeLeaves) => {
        const today = moment();
        if (moment(date).isAfter(today, "day")) return "";
        if (moment(date).day() === 0) return "S"; // Sunday

        let leaveSymbol = "P"; // Default status is Present
        let totalPermissionHours = 0;

        employeeLeaves?.forEach((leave) => {
            if (moment(date).isBetween(leave.startDate, leave.endDate, "day", "[]")) {
                if (leave.leaveTypes.includes("Casual Leave")) leaveSymbol = "C";
                if (leave.leaveTypes.includes("Saturday Off")) leaveSymbol = "SO";
                if (leave.leaveTypes.includes("LossofPay Leave")) leaveSymbol = "LOP";
                if (leave.leaveTypes.includes("Work From Home")) leaveSymbol = "WFH";
                totalPermissionHours += leave.permissionHours;
            }
        });

        if (totalPermissionHours > 2) {
            return "H"; // Half-day deduction (counts as 0.5 day)
        } else if (totalPermissionHours > 0) {
            return "PE"; // Partial Leave
        }

        return leaveSymbol; // 'P' if no other conditions met
    };

    const exportToExcel = () => {
        // Select the attendance table
        const table = document.querySelector(".attendance-table");
        
        // Convert table to a worksheet
        const worksheet = XLSX.utils.table_to_sheet(table);
    
        // Add salary column manually to each row
        employeeList.forEach((employee, index) => {
            const rowNumber = index + 2; // Row starts from 2 (Excel index is 1-based)
            worksheet[`AJ${rowNumber}`] = { v: salaryInputs[employee.employeeName] || "-" };
        });
    
        // Append salary column header
        worksheet["AJ"] = { v: "Salary" };
    
        // Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
        // Save the Excel file
        XLSX.writeFile(workbook, `Attendance_Report_${year}_${month}.xlsx`);
    };
    
    // Compute Total Working Days based on current date if the selected month is current.
    const currentYearStr = moment().format("YYYY");
    const currentMonthStr = moment().format("MM");
    const fullMonthDays = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    const totalWorkingDays =
        year === currentYearStr && month === currentMonthStr ? moment().date() : fullMonthDays;

    // Handle change in salary input
    const handleSalaryChange = (employeeName, value) => {
        setSalaryInputs((prev) => ({
            ...prev,
            [employeeName]: value,
        }));
    };

    return (
        <div className="attendance-container">
            <h2>Attendance Report</h2>
            <div className="filters">
                {/* Month Dropdown */}
                <label>Month:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {moment.months().map((m, index) => (
                        <option key={index} value={String(index + 1).padStart(2, "0")}>
                            {m}
                        </option>
                    ))}
                </select>

                {/* Year Dropdown */}
                <label>Year:</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    {[...Array(10)].map((_, i) => {
                        const currentYear = moment().year();
                        return (
                            <option key={i} value={currentYear - i}>
                                {currentYear - i}
                            </option>
                        );
                    })}
                </select>

                {/* Employee Dropdown */}
                <label>Select Employee:</label>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                    <option value="">All Employees</option>
                    {employeeList.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeName}>
                            {emp.employeeName}
                        </option>
                    ))}
                </select>

                <button className="export-btn" onClick={exportToExcel}>
                    Export
                </button>
            </div>

            <div className="table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            {/* New Serial Number Column */}
                            <th>S.No</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            {[...Array(fullMonthDays)].map((_, i) => (
                                <th key={i}>
                                    {moment(`${year}-${month}`, "YYYY-MM")
                                        .date(i + 1)
                                        .format("DD")}
                                </th>
                            ))}
                            <th>Total Working Days</th>
                            <th>Total Present</th>
                            <th>Total Absent</th>
                            {/* <th>Salary</th>
                            <th>Final Salary</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList
                            .filter((emp) => !selectedEmployee || emp.employeeName === selectedEmployee)
                            .map((emp, index) => {
                                const today = moment();
                                const doj = moment(emp.dateOfJoining);
                                let totalPresent = 0;
                                let totalAbsent = 0;
                                let halfDayCount = 0;

                                // Prepare an array for status for each day (to use for deduction calculation)
                                const dailyStatuses = [...Array(fullMonthDays)].map((_, i) => {
                                    const date = moment(`${year}-${month}`, "YYYY-MM").date(i + 1);
                                    
                                    // If the date is before the joining date, mark as LOP and count as absent.
                                    if (date.isBefore(doj, "day")) {
                                        totalAbsent++;
                                        return "-";
                                    }
                                    
                                    if (date.isAfter(today, "day")) return "";
                                    
                                    let status = "P"; // default is Present

                                    // Check punch data first
                                    if (
                                        punchData[emp.employeeName] &&
                                        punchData[emp.employeeName].includes(date.format("YYYY-MM-DD"))
                                    ) {
                                        status = "P";
                                    } else {
                                        // Check leave data
                                        if (leaveData[emp.employeeName]) {
                                            status = getLeaveSymbol(date, leaveData[emp.employeeName]);
                                        } else {
                                            // If no leave data and not punched, if it's Sunday then mark as Sunday off
                                            if (date.day() === 0) {
                                                status = "S"; // Sunday
                                            }
                                        }
                                    }

                                    // Update totals for deduction calculation:
                                    // For deduction, we count LOP as 1 day and half-day ("H") as 0.5 day.
                                    if (status === "LOP") totalAbsent++;
                                    if (status === "H") halfDayCount++;
                                    // Also, count present if status is one of these values:
                                    if (["P", "SO", "C", "PE", "S", "WFH"].includes(status)) totalPresent++;
                                    
                                    return status;
                                });

                                // Effective deduction days = full-day deductions + half-day deductions (each half day counts as 0.5)
                                const effectiveDeductionDays = totalAbsent + (halfDayCount / 2);
                                // Get salary for the employee from state (if any)
                                const enteredSalary = parseFloat(salaryInputs[emp.employeeName]) || 0;
                                const perDaySalary = enteredSalary ? enteredSalary / fullMonthDays : 0;
                                const finalSalary = enteredSalary
                                    ? (enteredSalary - (effectiveDeductionDays * perDaySalary)).toFixed(2)
                                    : "";

                                return (
                                    <tr key={emp.employeeId}>
                                        {/* Serial Number */}
                                        <td>{index + 1}</td>
                                        <td>{emp.employeeId}</td>
                                        <td className="employee-name">{emp.employeeName}</td>
                                        {dailyStatuses.map((status, i) => (
                                            <td key={i} className={`status ${status.toLowerCase()}`}>
                                                {status}
                                            </td>
                                        ))}
                                        <td>{totalWorkingDays}</td>
                                        <td>{totalPresent + Math.floor(halfDayCount / 2)}</td>
                                        <td>{totalAbsent + (halfDayCount % 2 ? 0.5 : 0)}</td>
                                        {/* <td>
                                            <input
                                                type="text"
                                                className="salary-input"
                                                placeholder="Enter Salary"
                                                value={salaryInputs[emp.employeeName] || ""}
                                                onChange={(e) =>
                                                    handleSalaryChange(emp.employeeName, e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>{finalSalary}</td> */}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceReport;
