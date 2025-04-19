

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // New Late Punch filter
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = filteredData.reduce((acc, item) => {
//         const date = new Date(item.logTime).toLocaleDateString();
//         const key = `${item.employeeId}-${date}`;

//         if (!acc[key]) {
//             acc[key] = {
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: date,
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             };
//         }

//         if (item.logType === 'In') {
//             acc[key].punchIn.push(new Date(item.logTime));
//         } else if (item.logType === 'Out') {
//             acc[key].punchOut.push(new Date(item.logTime));
//         }

//         return acc;
//     }, {});

//     const calculateTimes = (item) => {
//         const { punchIn, punchOut } = item;

//         let totalSystemIn = 0; // Total time from punch in to previous punch out
//         let totalSystemOut = 0; // Total time from earliest punch in to latest punch out

//         // Calculate System Away: Time from the earliest punch in to the latest punch out
//         if (punchIn.length > 0 && punchOut.length > 0) {
//             const earliestIn = punchIn[0];
//             const latestOut = punchOut[punchOut.length - 1];
//             totalSystemOut = (latestOut - earliestIn) / (1000 * 60 * 60); // Convert to hours
//         }

//         // Calculate System In: time between the current punch in and the previous punch out
//         if (punchIn.length > 0 && punchOut.length > 0) {
//             for (let i = 0; i < punchIn.length; i++) {
//                 if (i === 0) {
//                     // For the first punch in, there's no previous punch out.
//                     totalSystemIn += 0; // not counted
//                 } else {
//                     totalSystemIn += (punchIn[i] - punchOut[i - 1]) / (1000 * 60 * 60); // Convert to hours
//                 }
//             }
//         }

//         return {
//             totalSystemIn: `${totalSystemIn.toFixed(2)} hrs`,
//             totalSystemOut: `${totalSystemOut.toFixed(2)} hrs`,
//         };
//     };

//     const groupedDataArray = Object.values(groupedData).map(item => {
//         const { totalSystemIn, totalSystemOut } = calculateTimes(item);
//         return {
//             ...item,
//             totalSystemIn,
//             totalSystemOut,
//         };
//     });

//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => time.toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => time.toLocaleTimeString()).join(', '),
//             SystemIn: item.totalSystemIn,
//             SystemOut: item.totalSystemOut,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         heading: {
//             textAlign: 'center',
//             marginBottom: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         button: {
//             width: '100%',
//             padding: '10px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 {/* <th style={styles.th}>System IN</th>
//                                 <th style={styles.th}>System Away</th> */}
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
                        
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} {/* Automatically incrementing serial number */}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => time.toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => time.toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         {/* <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalSystemIn}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalSystemOut}
//                                         </td> */}
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0; // Store total working hours
//         const inTimes = item.punchIn.map((time) => new Date(time)); // Convert punch-in times to Date
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null)); // Convert punch-out times to Date, null if missing
    
//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);
    
//         // Handle even number of punch-ins and punch-outs: Calculate working hours for each pair
//         if (inTimes.length % 2 === 0 && outTimes.length % 2 === 0) {
//             for (let i = 0; i < pairsCount; i++) {
//                 if (outTimes[i] !== null) {
//                     const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
//                     totalWorkingHours += difference;
//                 }
//             }
//         } else {
//             // Handle odd number of punch-ins and punch-outs (existing logic)
//             for (let i = 0; i < pairsCount; i++) {
//                 if (outTimes[i] !== null) {
//                     const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
//                     totalWorkingHours += difference;
//                 }
//             }
    
//             // Handle case: Second punch-in and first punch-out (for specific odd scenario)
//             if (inTimes.length > 1 && outTimes.length > 0 && outTimes[0] !== null) {
//                 const secondPunchIn = inTimes[1]; // Second punch-in
//                 const firstPunchOut = outTimes[0]; // First punch-out
    
//                 if (secondPunchIn && firstPunchOut) {
//                     const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60); // Time difference in hours
//                     totalWorkingHours = difference; // Override with this specific case if it applies
//                 }
//             }
//         }
    
//         // Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//         };
//     });
    
    
    
    
    
//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = filteredData.reduce((acc, item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         let entry = acc.find(group => group.key === key);

//         if (!entry) {
//             entry = {
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             };
//             acc.push(entry);
//         }

//         if (item.logType === 'In') {
//             entry.punchIn.push(new Date(item.logTime));
//         } else if (item.logType === 'Out') {
//             entry.punchOut.push(new Date(item.logTime));
//         }

//         return acc;
//     }, []);

//     groupedDataArray.forEach(item => {
//         let totalWorkingHours = 0;
//         const inTimes = item.punchIn;
//         const outTimes = item.punchOut;
        
//         let pairsCount = Math.min(inTimes.length, outTimes.length);
        
//         if (inTimes.length >= 5 && outTimes.length >= 5) {
//             for (let i = 0; i < pairsCount; i++) {
//                 totalWorkingHours += (outTimes[i] - inTimes[i]) / (1000 * 60 * 60);
//             }
//         } else {
//             for (let i = 0; i < pairsCount; i++) {
//                 totalWorkingHours += (outTimes[i] - inTimes[i]) / (1000 * 60 * 60);
//             }
//         }
        
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         item.totalWorkingHours = `${hours} hr ${minutes} min`;
//     });
    
    
//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;
















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0; // Store total working hours
//         const inTimes = item.punchIn.map((time) => new Date(time)); // Convert punch-in times to Date
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null)); // Convert punch-out times to Date, null if missing
    
//         let pairsCount = Math.min(inTimes.length, outTimes.length); // Use only valid pairs
    
//         // ✅ Loop through ALL punch-in and punch-out pairs to sum up working hours
//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null) {
//                 const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
//                 totalWorkingHours += difference; // Add to total working hours
//             }
//         }
    
//         // ✅ **Keep existing "Handle Case 2" logic unchanged**
//         if (inTimes.length > 1 && outTimes.length > 0 && outTimes[0] !== null) {
//             const secondPunchIn = inTimes[1]; // Second punch-in
//             const firstPunchOut = outTimes[0]; // First punch-out
    
//             if (secondPunchIn && firstPunchOut) {
//                 const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60); // Time difference in hours
//                 totalWorkingHours = difference; // Override with this specific case if it applies
//             }
//         }
    
//         // Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//         };
//     });
    
//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0; // Store total working hours
//         const inTimes = item.punchIn.map((time) => new Date(time)); // Convert punch-in times to Date
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null)); // Convert punch-out times to Date, null if missing
    
//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length); // Get valid pairs count
    
//         // ✅ Loop through ALL punch-in and punch-out pairs and sum up the working hours
//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
//                 totalWorkingHours += difference; // Add to total working hours
//             } else {
//                 // ✅ Handle case: second punch-in and first punch-out scenario for invalid pair
//                 if (inTimes.length > 1 && outTimes.length > 0 && outTimes[0] !== null && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[1]; // Second punch-in
//                     const firstPunchOut = outTimes[0]; // First punch-out
    
//                     if (secondPunchIn && firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60); // Time difference in hours
//                         console.log(`Warning: Calculating time between second punch-in and first punch-out. Time difference: ${difference} hours.`);
//                         totalWorkingHours += difference; // Add this calculated time to total working hours
//                     }
//                 }
//             }
//         }
    
//         // ✅ Handle case where punch-in count is greater than punch-out count (extra punch-ins)
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
    
//         // ✅ Handle case where punch-out count is greater than punch-in count (extra punch-outs)
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }
    
//         // ✅ Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`, // Return the total working hours
//         };
//     });
    
    
    
    
//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;











// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0; // Store total working hours
//         const inTimes = item.punchIn.map((time) => new Date(time)); // Convert punch-in times to Date
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null)); // Convert punch-out times to Date, null if missing
    
//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length); // Get valid pairs count
    
//         // ✅ Loop through ALL punch-in and punch-out pairs and sum up the working hours
//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
//                 totalWorkingHours += difference; // Add to total working hours
//             } else {
//                 // ✅ Handle case: second punch-in and first punch-out scenario for invalid pair
//                 if (inTimes.length > 1 && outTimes.length > 0 && outTimes[0] !== null && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[1]; // Second punch-in
//                     const firstPunchOut = outTimes[0]; // First punch-out
    
//                     if (secondPunchIn && firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60); // Time difference in hours
//                         console.log(`Warning: Calculating time between second punch-in and first punch-out. Time difference: ${difference} hours.`);
//                         totalWorkingHours += difference; // Add this calculated time to total working hours
//                     }
//                 }
//             }
//         }
    
//         // ✅ Handle case where punch-in count is greater than punch-out count (extra punch-ins)
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
    
//         // ✅ Handle case where punch-out count is greater than punch-in count (extra punch-outs)
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }
    
//         // ✅ Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`, // Return the total working hours
//         };
//     });
    
    
    
    
//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Extra Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.extraWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="8" style={styles.noRecords}>
//                                         No records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

    // const groupedDataArray = groupedData.map((item) => {
    //     let totalWorkingHours = 0; // Store total working hours
    //     const inTimes = item.punchIn.map((time) => new Date(time)); // Convert punch-in times to Date
    //     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null)); // Convert punch-out times to Date, null if missing
    
    //     let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length); // Get valid pairs count
    
    //     // Loop through ALL punch-in and punch-out pairs and sum up the working hours
    //     for (let i = 0; i < pairsCount; i++) {
    //         if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
    //             const difference = (outTimes[i] - inTimes[i]) / (1000 * 60 * 60); // Time difference in hours
    //             totalWorkingHours += difference; // Add to total working hours
    //         } else {
    //             // Handle case: second punch-in and first punch-out scenario for invalid pair
    //             if (inTimes.length > 1 && outTimes.length > 0 && outTimes[0] !== null && outTimes[i] !== null) {
    //                 const secondPunchIn = inTimes[1]; // Second punch-in
    //                 const firstPunchOut = outTimes[0]; // First punch-out
    
    //                 if (secondPunchIn && firstPunchOut) {
    //                     const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60); // Time difference in hours
    //                     console.log(`Warning: Calculating time between second punch-in and first punch-out. Time difference: ${difference} hours.`);
    //                     totalWorkingHours += difference; // Add this calculated time to total working hours
    //                 }
    //             }
    //         }
    //     }
    
//         // Handle case where punch-in count is greater than punch-out count (extra punch-ins)
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
    
//         // Handle case where punch-out count is greater than punch-in count (extra punch-outs)
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }
    
//         // Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
    
//         // Calculate extra working hours
//         const extraWorkingHours = totalWorkingHours - 8; // Assuming 8 hours is the standard shift duration
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`, // Return the total working hours
//             extraWorkingHours: extraWorkingHours > 0 ? `${extraWorkingHours} hr` : '0 hr'
//         };
//     });

//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div 
//                     onClick={handleExport} 
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th> 
//                                 <th style={styles.th}>Extra Working Hours</th> 
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1} 
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.extraWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     const standardStartTime = new Date();
//     standardStartTime.setHours(9, 30, 0, 0); // 9:30 AM
//     const standardEndTime = new Date();
//     standardEndTime.setHours(18, 30, 0, 0); // 6:30 PM

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0;
//         let extraWorkingHours = 0;
//         const inTimes = item.punchIn.map((time) => new Date(time));
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));

//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);

//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const punchInTime = inTimes[i];
//                 const punchOutTime = outTimes[i];

//                 // Calculate time within standard working hours (9:30 AM to 6:30 PM)
//                 const startTimeForCalc = new Date(punchInTime);
//                 startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//                 const endTimeForCalc = new Date(punchOutTime);
//                 endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//                 let workingHoursForPair = 0;
//                 let extraHoursForPair = 0;

//                 // Calculate working hours within standard time
//                 if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     // Full working hours within standard time
//                     workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     // Punch-in before 9:30 AM, punch-out within standard time
//                     workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime >= startTimeForCalc && punchInTime < endTimeForCalc && punchOutTime > endTimeForCalc) {
//                     // Punch-in within standard time, punch-out after 6:30 PM
//                     workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                     extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//                     // Punch-in before 9:30 AM, punch-out after 6:30 PM
//                     workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = ((startTimeForCalc - punchInTime) / (1000 * 60 * 60)) + ((punchOutTime - endTimeForCalc) / (1000 * 60 * 60));

//                 }
//                 totalWorkingHours += workingHoursForPair;
//                 extraWorkingHours += extraHoursForPair;
//             }
//         }

//         // Handle unmatched punch-ins/outs (warning messages - you might want to handle these differently)
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }
//         // Convert total working hours to hours and minutes
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         const extraHours = Math.floor(extraWorkingHours);
//         const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//             extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//         };
//     });

//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '18px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div
//                     onClick={handleExport}
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th>
//                                 <th style={styles.th}>Extra Working Hours </th>
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.extraWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0;
//         let extraWorkingHours = 0;
    
//         const inTimes = item.punchIn.map((time) => new Date(time));
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
    
//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);
    
//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const punchInTime = inTimes[i];
//                 const punchOutTime = outTimes[i];
    
//                 // Standard working hours (9:30 AM - 6:30 PM)
//                 const startTimeForCalc = new Date(punchInTime);
//                 startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//                 const endTimeForCalc = new Date(punchOutTime);
//                 endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM
    
//                 let workingHoursForPair = 0;
//                 let extraHoursForPair = 0;
    
//                 if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime >= startTimeForCalc && punchInTime < endTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                     extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = ((startTimeForCalc - punchInTime) / (1000 * 60 * 60)) + ((punchOutTime - endTimeForCalc) / (1000 * 60 * 60));
//                 }
    
//                 totalWorkingHours += workingHoursForPair;
//                 extraWorkingHours += extraHoursForPair;
//             } else {
//                 // Handle scenario: second punch-in before first punch-out
//                 if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[i + 1];
//                     const firstPunchOut = outTimes[i];
    
//                     if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//                         console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//                         totalWorkingHours += difference;
//                     }
//                 }
//             }
//         }
    
//         // Log warnings for unmatched punch-ins and punch-outs
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }
    
//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         const extraHours = Math.floor(extraWorkingHours);
//         const extraMinutes = Math.round((extraWorkingHours % 1) * 60);
    
//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//             extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//         };
//     });
    

//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '20px',
//         },
//         row: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '200px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: 'bold',
//         },
//         input: {
//             width: '100%',
//             padding: '8px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '500px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '10px',
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '16px',
//         },
//         td: {
//             padding: '10px',
//             border: '1px solid #ddd',
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '20px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div
//                     onClick={handleExport}
//                     style={{
//                         display: 'inline-block',
//                         padding: '4px 18px',
//                         backgroundColor: '#4CAF50',
//                         color: '#fff',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '20px',
//                         textAlign: 'center',
//                         marginTop: '36px',
//                     }}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '840px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th>
//                                 <th style={styles.th}>Extra Working Hours </th>
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.extraWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');

//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && punchInTime.getMinutes() > 30; // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0;
//         let extraWorkingHours = 0;

//         const inTimes = item.punchIn.map((time) => new Date(time));
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));

//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);

//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const punchInTime = inTimes[i];
//                 const punchOutTime = outTimes[i];

//                 // Standard working hours (9:30 AM - 6:30 PM)
//                 const startTimeForCalc = new Date(punchInTime);
//                 startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//                 const endTimeForCalc = new Date(punchOutTime);
//                 endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//                 let workingHoursForPair = 0;
//                 let extraHoursForPair = 0;

//                 if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime >= startTimeForCalc && punchInTime < endTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                     extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = ((startTimeForCalc - punchInTime) / (1000 * 60 * 60)) + ((punchOutTime - endTimeForCalc) / (1000 * 60 * 60));
//                 }

//                 totalWorkingHours += workingHoursForPair;
//                 extraWorkingHours += extraHoursForPair;
//             } else {
//                 // Handle scenario: second punch-in before first punch-out
//                 if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[i + 1];
//                     const firstPunchOut = outTimes[i];

//                     if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//                         console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//                         totalWorkingHours += difference;
//                     }
//                 }
//             }
//         }

//         // Log warnings for unmatched punch-ins and punch-outs
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }

//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         const extraHours = Math.floor(extraWorkingHours);
//         const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//             extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//         };
//     });


//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '16px',
//         },
//         row: {
//             display: 'flex',
//             gap: '16px',
//             marginBottom: '16px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '160px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '6px',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         input: {
//             width: '100%',
//             padding: '6px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//             fontSize: '16px',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '700px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '6px',  // Reduced padding
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         td: {
//             padding: '6px',  // Reduced padding
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '16px',
//             fontSize: '16px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         exportButton: {
//             display: 'inline-block',
//             padding: '3px 16px',
//             backgroundColor: '#4CAF50',
//             color: '#fff',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '18px',
//             textAlign: 'center',
//             marginTop: '30px',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div
//                     onClick={handleExport}
//                     style={styles.exportButton}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Table */}
//             {loading ? (
//                 <div style={styles.noRecords}>Loading...</div>
//             ) : error ? (
//                 <div style={styles.noRecords}>{error}</div>
//             ) : (
//                 <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//                     <table style={styles.table}>
//                         <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                             <tr style={{ margin: '0px' }}>
//                                 <th style={styles.th}>S.No</th>
//                                 <th style={styles.th}>Employee Name</th>
//                                 <th style={styles.th}>Place</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th}>Punch Time        In</th>
//                                 <th style={styles.th}>Punch Time Out</th>
//                                 <th style={styles.th}>Total Working Hours</th>
//                                 <th style={styles.th}>Extra Working Hours </th>
//                                 <th style={styles.th}>Device</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {groupedDataArray.length > 0 ? (
//                                 groupedDataArray.map((item, index) => (
//                                     <tr key={index}>
//                                         <td style={styles.td}>
//                                             {index + 1}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.employeeName}
//                                         </td>
//                                         <td style={styles.td}>{item.place}</td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.date}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device2 }}>
//                                             {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.totalWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.extraWorkingHours}
//                                         </td>
//                                         <td style={{ ...styles.td, ...styles.device }}>
//                                             {item.device}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                         No records found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');
//     const [latePunchData, setLatePunchData] = useState([]); // State for late punch data for chart
//     const [chartLoading, setChartLoading] = useState(false); // Loading state for the chart


//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30); // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);


//     useEffect(() => {
//         const fetchLatePunchData = async () => {
//             if (selectedEmployeeId && punchType === "Late Punches") {
//                 setChartLoading(true); // Set loading state

//                 const latePunches = [];
//                 const processedDates = new Set(); // To track dates with late punches
//                 filteredData.forEach(item => {
//                     if (item.employeeId === selectedEmployeeId) {
//                         const punchInTime = new Date(item.logTime);
//                         const itemDate = punchInTime.toLocaleDateString();

//                         if (punchInTime.getHours() >= 9 && (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30) && !processedDates.has(itemDate)) {
//                             latePunches.push({
//                                 date: itemDate,
//                                 hoursLate: (punchInTime.getHours() - 9) + (punchInTime.getMinutes() > 30 ? 0.5 : 0),  // Approximating to nearest half hour
//                             });
//                             processedDates.add(itemDate); // Mark date as processed
//                         }
//                     }
//                 });


//                 // Aggregate hours by date
//                 const aggregatedLatePunches = latePunches.reduce((acc, punch) => {
//                     const existing = acc.find(p => p.date === punch.date);
//                     if (existing) {
//                         existing.hoursLate += punch.hoursLate;
//                     } else {
//                         acc.push(punch);
//                     }
//                     return acc;
//                 }, []);

//                 // Format data for the chart
//                 const chartData = aggregatedLatePunches.map(item => ({
//                     date: item.date,
//                     hoursLate: item.hoursLate,
//                 }));
//                 setLatePunchData(chartData);
//                 setChartLoading(false); // Clear loading state
//             } else {
//                 setLatePunchData([]); // Clear chart data if no employee is selected or not viewing late punches
//             }
//         };
//         fetchLatePunchData(); // Call the function immediately
//     }, [selectedEmployeeId, punchType, filteredData]);


//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0;
//         let extraWorkingHours = 0;

//         const inTimes = item.punchIn.map((time) => new Date(time));
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));

//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);

//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const punchInTime = inTimes[i];
//                 const punchOutTime = outTimes[i];

//                 // Standard working hours (9:30 AM - 6:30 PM)
//                 const startTimeForCalc = new Date(punchInTime);
//                 startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//                 const endTimeForCalc = new Date(punchOutTime);
//                 endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//                 let workingHoursForPair = 0;
//                 let extraHoursForPair = 0;

//                 if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime >= startTimeForCalc && punchInTime < endTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                     extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = ((startTimeForCalc - punchInTime) / (1000 * 60 * 60)) + ((punchOutTime - endTimeForCalc) / (1000 * 60 * 60));
//                 }

//                 totalWorkingHours += workingHoursForPair;
//                 extraWorkingHours += extraHoursForPair;
//             } else {
//                 // Handle scenario: second punch-in before first punch-out
//                 if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[i + 1];
//                     const firstPunchOut = outTimes[i];

//                     if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//                         console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//                         totalWorkingHours += difference;
//                     }
//                 }
//             }
//         }

//         // Log warnings for unmatched punch-ins and punch-outs
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }

//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         const extraHours = Math.floor(extraWorkingHours);
//         const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//             extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//         };
//     });


//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '16px',
//         },
//         row: {
//             display: 'flex',
//             gap: '16px',
//             marginBottom: '16px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '160px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '6px',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         input: {
//             width: '100%',
//             padding: '6px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//             fontSize: '16px',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '700px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '6px',  // Reduced padding
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         td: {
//             padding: '6px',  // Reduced padding
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '16px',
//             fontSize: '16px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         exportButton: {
//             display: 'inline-block',
//             padding: '3px 16px',
//             backgroundColor: '#4CAF50',
//             color: '#fff',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '18px',
//             textAlign: 'center',
//             marginTop: '30px',
//         },
//         chartContainer: {
//             width: '100%',
//             height: 300, // Adjust height as needed
//             marginTop: '20px',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div
//                     onClick={handleExport}
//                     style={styles.exportButton}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Late Punch Chart */}
//             {punchType === "Late Punches" && selectedEmployeeId && (
//                 <div style={styles.chartContainer}>
//                     {chartLoading ? ( // Show loading indicator
//                         <div style={styles.noRecords}>Loading chart data...</div>
//                     ) : latePunchData.length > 0 ? (
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart
//                                 data={latePunchData}
//                                 margin={{
//                                     top: 20,
//                                     right: 30,
//                                     left: 20,
//                                     bottom: 5,
//                                 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="date"  label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                                 <YAxis label={{ value: 'Hours Late', angle: -90, position: 'left', offset: 10 }} />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar dataKey="hoursLate" fill="#8884d8" name="Hours Late" />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//                     )}
//                 </div>
//             )}

//             {/* Table */}
//             {punchType !== "Late Punches" && (
//                 <>
//                     {loading ? (
//                         <div style={styles.noRecords}>Loading...</div>
//                     ) : error ? (
//                         <div style={styles.noRecords}>{error}</div>
//                     ) : (
//                         <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//                             <table style={styles.table}>
//                                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                                     <tr style={{ margin: '0px' }}>
//                                         <th style={styles.th}>S.No</th>
//                                         <th style={styles.th}>Employee Name</th>
//                                         <th style={styles.th}>Place</th>
//                                         <th style={styles.th}>Date</th>
//                                         <th style={styles.th}>Punch Time        In</th>
//                                         <th style={styles.th}>Punch Time Out</th>
//                                         <th style={styles.th}>Total Working Hours</th>
//                                         <th style={styles.th}>Extra Working Hours </th>
//                                         <th style={styles.th}>Device</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {groupedDataArray.length > 0 ? (
//                                         groupedDataArray.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td style={styles.td}>
//                                                     {index + 1}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.employeeName}
//                                                 </td>
//                                                 <td style={styles.td}>{item.place}</td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.date}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device2 }}>
//                                                     {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device2 }}>
//                                                     {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.totalWorkingHours}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.extraWorkingHours}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.device}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                                 No records found
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from 'recharts';

// const PunchLogTable = () => {
//     const [data, setData] = useState([]);
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [filteredData, setFilteredData] = useState([]);
//     const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//     const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [punchType, setPunchType] = useState('');
//     const [latePunchData, setLatePunchData] = useState([]); // State for late punch data for chart
//     const [chartLoading, setChartLoading] = useState(false); // Loading state for the chart
//     const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//         totalDaysLate: 0,
//         totalHoursLate: 0,
//     });


//     const payload = {
//         from_date: fromDate,
//         to_date: toDate
//     };

//     useEffect(() => {
//         const fetchFilteredData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/dailypunch`,
//                     payload
//                 );
//                 setData(response.data);
//                 setFilteredData(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Error fetching data. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredData();
//     }, [fromDate, toDate]);

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

//     useEffect(() => {
//         let filtered = data;

//         // Apply existing filters
//         if (fromDate) {
//             const fromDateObj = new Date(fromDate);
//             fromDateObj.setHours(0, 0, 0, 0);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(0, 0, 0, 0);
//                 return itemDate >= fromDateObj;
//             });
//         }
//         if (toDate) {
//             const toDateObj = new Date(toDate);
//             toDateObj.setHours(23, 59, 59, 999);
//             filtered = filtered.filter((item) => {
//                 const itemDate = new Date(item.logTime);
//                 itemDate.setHours(23, 59, 59, 999);
//                 return itemDate <= toDateObj;
//             });
//         }
//         if (selectedEmployeeId) {
//             filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//         }
//         if (punchType && punchType !== "Late Punches") {
//             filtered = filtered.filter((item) => item.logType === punchType);
//         }

//         // Filtering for Late Punches
//         if (punchType === "Late Punches") {
//             filtered = filtered.filter((item) => {
//                 const punchInTime = new Date(item.logTime);
//                 return punchInTime.getHours() >= 9 && (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30); // Punch in after 9:30 AM
//             });
//         }

//         // Sort filtered data
//         filtered = filtered.sort((a, b) => new Date(b.logTime) - new Date(a.logTime));
//         setFilteredData(filtered);
//     }, [fromDate, toDate, selectedEmployeeId, data, punchType]);



//     useEffect(() => {
//         const fetchLatePunchData = async () => {
//             if (selectedEmployeeId && punchType === "Late Punches") {
//                 setChartLoading(true);

//                 const latePunches = [];
//                 const processedDates = new Set(); // To track dates with late punches
//                 let totalDaysLate = 0;
//                 let totalHoursLate = 0;


//                 filteredData.forEach(item => {
//                     if (item.employeeId === selectedEmployeeId) {
//                         const punchInTime = new Date(item.logTime);
//                         const itemDate = punchInTime.toLocaleDateString();

//                         if (punchInTime.getHours() >= 9 && (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30) && !processedDates.has(itemDate)) {
//                             const hoursLate = (punchInTime.getHours() - 9) + (punchInTime.getMinutes() > 30 ? 0.5 : 0);
//                             latePunches.push({
//                                 date: itemDate,
//                                 hoursLate: hoursLate,
//                             });
//                             processedDates.add(itemDate);
//                             totalDaysLate++;
//                             totalHoursLate += hoursLate;
//                         }
//                     }
//                 });


//                 const chartData = latePunches.map(item => ({
//                     date: item.date,
//                     hoursLate: item.hoursLate,
//                 }));
//                 setLatePunchData(chartData);
//                 setMonthlyLatePunchSummary({
//                     totalDaysLate: totalDaysLate,
//                     totalHoursLate: totalHoursLate,
//                 });

//                 setChartLoading(false);
//             } else {
//                 setLatePunchData([]);
//                 setMonthlyLatePunchSummary({
//                     totalDaysLate: 0,
//                     totalHoursLate: 0,
//                 });
//             }
//         };
//         fetchLatePunchData();
//     }, [selectedEmployeeId, punchType, filteredData]);


//     const groupedData = [];
//     filteredData.forEach((item) => {
//         const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//         const index = groupedData.findIndex((group) => group.key === key);
//         if (index === -1) {
//             groupedData.push({
//                 key,
//                 employeeId: item.employeeId,
//                 employeeName: employeeList.find(emp => emp.employeeId === item.employeeId)?.employeeName || item.employeeId,
//                 place: item.place1,
//                 date: new Date(item.logTime).toLocaleDateString(),
//                 punchIn: [],
//                 punchOut: [],
//                 device: item.device,
//             });
//         }

//         if (item.logType === 'In') {
//             groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//         } else if (item.logType === 'Out') {
//             groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//         }
//     });

//     const groupedDataArray = groupedData.map((item) => {
//         let totalWorkingHours = 0;
//         let extraWorkingHours = 0;

//         const inTimes = item.punchIn.map((time) => new Date(time));
//         const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));

//         let pairsCount = Math.min(inTimes.length, outTimes.filter(time => time !== null).length);

//         for (let i = 0; i < pairsCount; i++) {
//             if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//                 const punchInTime = inTimes[i];
//                 const punchOutTime = outTimes[i];

//                 // Standard working hours (9:30 AM - 6:30 PM)
//                 const startTimeForCalc = new Date(punchInTime);
//                 startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//                 const endTimeForCalc = new Date(punchOutTime);
//                 endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//                 let workingHoursForPair = 0;
//                 let extraHoursForPair = 0;

//                 if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > startTimeForCalc && punchOutTime <= endTimeForCalc) {
//                     workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                 } else if (punchInTime >= startTimeForCalc && punchInTime < endTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//                     extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//                 } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//                     workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//                     extraHoursForPair = ((startTimeForCalc - punchInTime) / (1000 * 60 * 60)) + ((punchOutTime - endTimeForCalc) / (1000 * 60 * 60));
//                 }

//                 totalWorkingHours += workingHoursForPair;
//                 extraWorkingHours += extraHoursForPair;
//             } else {
//                 // Handle scenario: second punch-in before first punch-out
//                 if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//                     const secondPunchIn = inTimes[i + 1];
//                     const firstPunchOut = outTimes[i];

//                     if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//                         const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//                         console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//                         totalWorkingHours += difference;
//                     }
//                 }
//             }
//         }

//         // Log warnings for unmatched punch-ins and punch-outs
//         if (inTimes.length > outTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//         }
//         if (outTimes.length > inTimes.length) {
//             console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//         }

//         const hours = Math.floor(totalWorkingHours);
//         const minutes = Math.round((totalWorkingHours % 1) * 60);
//         const extraHours = Math.floor(extraWorkingHours);
//         const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//         return {
//             ...item,
//             totalWorkingHours: `${hours} hr ${minutes} min`,
//             extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//         };
//     });


//     const handleExport = () => {
//         const exportData = groupedDataArray.map(item => ({
//             EmployeeName: item.employeeName,
//             Place: item.place,
//             Date: item.date,
//             PunchIn: item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             PunchOut: item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', '),
//             TotalWorkingHours: item.totalWorkingHours,
//             ExtraWorkingHours: item.extraWorkingHours,
//             Device: item.device,
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//         XLSX.writeFile(wb, 'PunchLogData.xlsx');
//     };

//     // Define styles
//     const styles = {
//         container: {
//             padding: '16px',
//         },
//         row: {
//             display: 'flex',
//             gap: '16px',
//             marginBottom: '16px',
//             flexWrap: 'wrap',
//         },
//         column: {
//             flex: '1',
//             minWidth: '160px',
//         },
//         label: {
//             display: 'block',
//             marginBottom: '6px',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         input: {
//             width: '100%',
//             padding: '6px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             boxSizing: 'border-box',
//             fontSize: '16px',
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             maxHeight: '700px',
//             overflowY: 'auto',
//             display: 'block',
//         },
//         th: {
//             backgroundColor: '#343a40',
//             color: '#fff',
//             padding: '6px',  // Reduced padding
//             textAlign: 'left',
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         td: {
//             padding: '6px',  // Reduced padding
//             border: '1px solid #ddd',
//             fontSize: '16px', // Reduced font size
//         },
//         noRecords: {
//             textAlign: 'center',
//             padding: '16px',
//             fontSize: '16px',
//         },
//         device: {
//             color: 'blue',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         device2: {
//             color: 'orange',
//             fontWeight: 'bold',
//             fontSize: '16px',
//         },
//         exportButton: {
//             display: 'inline-block',
//             padding: '3px 16px',
//             backgroundColor: '#4CAF50',
//             color: '#fff',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '18px',
//             textAlign: 'center',
//             marginTop: '30px',
//         },
//         chartContainer: {
//             width: '100%',
//             height: 300, // Adjust height as needed
//             marginTop: '20px',
//         },
//         summary: {
//             marginTop: '10px',
//             fontSize: '16px',
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* Filters */}
//             <div style={styles.row}>
//                 <div style={styles.column}>
//                     <label style={styles.label}>From Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </div>
//                 <div style={styles.column}>
//                     <label style={styles.label}>To Date:</label>
//                     <input
//                         type="date"
//                         style={styles.input}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </div>
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
//                 <div style={styles.column}>
//                     <label style={styles.label}>Punch Type:</label>
//                     <select
//                         style={styles.input}
//                         value={punchType}
//                         onChange={(e) => setPunchType(e.target.value)}
//                     >
//                         <option value="">All</option>
//                         <option value="In">In Punches</option>
//                         <option value="Out">Out Punches</option>
//                         <option value="Late Punches">Late Punches</option>
//                     </select>
//                 </div>

//                 {/* Export Button */}
//                 <div
//                     onClick={handleExport}
//                     style={styles.exportButton}
//                 >
//                     Export
//                 </div>
//             </div>

//             {/* Late Punch Chart */}
//             {punchType === "Late Punches" && selectedEmployeeId && (
//                 <div style={styles.chartContainer}>
//                     {chartLoading ? (
//                         <div style={styles.noRecords}>Loading chart data...</div>
//                     ) : latePunchData.length > 0 ? (
//                         <>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <LineChart
//                                     data={latePunchData}
//                                     margin={{
//                                         top: 20,
//                                         right: 30,
//                                         left: 20,
//                                         bottom: 5,
//                                     }}
//                                 >
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                                     <YAxis label={{ value: 'Hours Late', angle: -90, position: 'left', offset: 10 }} />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Line type="monotone" dataKey="hoursLate" stroke="#8884d8" name="Hours Late" />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                             <div style={styles.summary}>
//                                 Late Punches Summary:
//                                 <br />
//                                 No of Days: {monthlyLatePunchSummary.totalDaysLate} days/month,
//                                 <br />
//                                 No of Hours: {monthlyLatePunchSummary.totalHoursLate.toFixed(2)} hours/month
//                             </div>
//                         </>
//                     ) : (
//                         <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//                     )}
//                 </div>
//             )}

//             {/* Table */}
//             {punchType !== "Late Punches" && (
//                 <>
//                     {loading ? (
//                         <div style={styles.noRecords}>Loading...</div>
//                     ) : error ? (
//                         <div style={styles.noRecords}>{error}</div>
//                     ) : (
//                         <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//                             <table style={styles.table}>
//                                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                                     <tr style={{ margin: '0px' }}>
//                                         <th style={styles.th}>S.No</th>
//                                         <th style={styles.th}>Employee Name</th>
//                                         <th style={styles.th}>Place</th>
//                                         <th style={styles.th}>Date</th>
//                                         <th style={styles.th}>Punch Time        In</th>
//                                         <th style={styles.th}>Punch Time Out</th>
//                                         <th style={styles.th}>Total Working Hours</th>
//                                         <th style={styles.th}>Extra Working Hours </th>
//                                         <th style={styles.th}>Device</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {groupedDataArray.length > 0 ? (
//                                         groupedDataArray.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td style={styles.td}>
//                                                     {index + 1}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.employeeName}
//                                                 </td>
//                                                 <td style={styles.td}>{item.place}</td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.date}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device2 }}>
//                                                     {item.punchIn.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device2 }}>
//                                                     {item.punchOut.map(time => new Date(time).toLocaleTimeString()).join(', ')}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.totalWorkingHours}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.extraWorkingHours}
//                                                 </td>
//                                                 <td style={{ ...styles.td, ...styles.device }}>
//                                                     {item.device}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                                                 No records found
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/employee_list/`
//         );
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
//     let filtered = data;

//     // Apply existing filters
//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // Late punch data fetching
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         const latePunches = [];
//         const processedDates = new Set(); // To track dates with late punches
//         let totalDaysLate = 0;
//         let totalMinutesLate = 0; // Changed this to minutes

//         filteredData.forEach((item) => {
//           if (item.employeeId === selectedEmployeeId) {
//             const punchInTime = new Date(item.logTime);
//             const itemDate = punchInTime.toLocaleDateString();

//             // Only record the first punch of the day that is late
//             if (
//               punchInTime.getHours() >= 9 &&
//               (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30) &&
//               !processedDates.has(itemDate)
//             ) {
//               // Calculate late minutes
//               const lateMinutes =
//                 (punchInTime.getHours() - 9) * 60 + (punchInTime.getMinutes() - 30);
//               latePunches.push({
//                 date: itemDate,
//                 lateMinutes: lateMinutes, // Store late minutes
//               });
//               processedDates.add(itemDate);
//               totalDaysLate++;
//               totalMinutesLate += lateMinutes; // Aggregate total minutes late
//             }
//           }
//         });

//         const chartData = latePunches.map((item) => ({
//           date: item.date,
//           lateMinutes: item.lateMinutes,
//         }));

//         // Change the summary state to reflect minutes instead of hours
//         setLatePunchData(chartData);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: totalDaysLate,
//           totalMinutesLate: totalMinutesLate,
//         });

//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0, // changed to minutes
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }

//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         // Standard working hours (9:30 AM - 6:30 PM)
//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         // Handle scenario: second punch-in before first punch-out
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];

//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(
//                 2
//               )} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     // Log warnings for unmatched punch-ins and punch-outs
//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       PunchOut: item.punchOut
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // Define styles
//   const styles = {
//     container: {
//       padding: '16px',
//     },
//     row: {
//       display: 'flex',
//       gap: '16px',
//       marginBottom: '16px',
//       flexWrap: 'wrap',
//     },
//     column: {
//       flex: '1',
//       minWidth: '160px',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '6px',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     input: {
//       width: '100%',
//       padding: '6px',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//       boxSizing: 'border-box',
//       fontSize: '16px',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       maxHeight: '700px',
//       overflowY: 'auto',
//       display: 'block',
//     },
//     th: {
//       backgroundColor: '#343a40',
//       color: '#fff',
//       padding: '6px',
//       textAlign: 'left',
//       border: '1px solid #ddd',
//       fontSize: '16px',
//     },
//     td: {
//       padding: '6px',
//       border: '1px solid #ddd',
//       fontSize: '16px',
//     },
//     noRecords: {
//       textAlign: 'center',
//       padding: '16px',
//       fontSize: '16px',
//     },
//     device: {
//       color: 'blue',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     device2: {
//       color: 'orange',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     exportButton: {
//       display: 'inline-block',
//       padding: '3px 16px',
//       backgroundColor: '#4CAF50',
//       color: '#fff',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '18px',
//       textAlign: 'center',
//       marginTop: '30px',
//     },
//     chartContainer: {
//       width: '100%',
//       height: 300,
//       marginTop: '20px',
//     },
//     summary: {
//       marginTop: '10px',
//       fontSize: '16px',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select
//             style={styles.input}
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//           >
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select
//             style={styles.input}
//             value={punchType}
//             onChange={(e) => setPunchType(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>

//         {/* Export Button */}
//         <div onClick={handleExport} style={styles.exportButton}>
//           Export
//         </div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div>
//           {chartLoading ? (
//             <div>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart
//                   data={latePunchData}
//                   margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="date"
//                     label={{ value: 'Date', position: 'bottom', offset: 0 }}
//                   />
//                   <YAxis
//                     label={{
//                       value: 'Minutes Late',
//                       angle: -90,
//                       position: 'left',
//                       offset: 10,
//                     }}
//                   />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="lateMinutes"
//                     stroke="#8884d8"
//                     name="Minutes Late"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days/month
//                 <br />
//                 No. of Minutes Late: {monthlyLatePunchSummary.totalMinutesLate} minutes/month
//               </div>
//             </>
//           ) : (
//             <div>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.employeeName}
//                         </td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.date}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn
//                             .map((time) => new Date(time).toLocaleTimeString())
//                             .join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut
//                             .map((time) => new Date(time).toLocaleTimeString())
//                             .join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.totalWorkingHours}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.extraWorkingHours}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.device}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                         No records found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/employee_list/`
//         );
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
//     let filtered = data;

//     // Apply existing filters
//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // Late punch data fetching
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         const latePunches = [];
//         const processedDates = new Set(); // To track dates with late punches
//         let totalDaysLate = 0;
//         let totalMinutesLate = 0; // Changed this to minutes

//         filteredData.forEach((item) => {
//           if (item.employeeId === selectedEmployeeId) {
//             const punchInTime = new Date(item.logTime);
//             const itemDate = punchInTime.toLocaleDateString();

//             // Only record the punch of the day that is late
//             if (
//               punchInTime.getHours() >= 9 &&
//               (punchInTime.getHours() > 9 || punchInTime.getMinutes() > 30) &&
//               !processedDates.has(itemDate)
//             ) {
//               // Calculate late minutes
//               const lateMinutes =
//                 (punchInTime.getHours() - 9) * 60 + (punchInTime.getMinutes() - 30);
//               latePunches.push({
//                 date: itemDate,
//                 lateMinutes: lateMinutes, // Store late minutes
//               });
//               processedDates.add(itemDate);
//               totalDaysLate++;
//               totalMinutesLate += lateMinutes; // Aggregate total minutes late
//             }
//           }
//         });

//         const chartData = latePunches.map((item) => ({
//           date: item.date,
//           lateMinutes: item.lateMinutes,
//         }));

//         // Change the summary state to reflect minutes instead of hours
//         setLatePunchData(chartData);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: totalDaysLate,
//           totalMinutesLate: totalMinutesLate,
//         });

//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0, // changed to minutes
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }

//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         // Standard working hours (9:30 AM - 6:30 PM)
//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0); // 9:30 AM
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0); // 6:30 PM

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         // Handle scenario: second punch-in before first punch-out
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];

//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(
//                 2
//               )} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }
    
//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       PunchOut: item.punchOut
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // Define styles
//   const styles = {
//     container: {
//       padding: '16px',
//     },
//     row: {
//       display: 'flex',
//       gap: '16px',
//       marginBottom: '16px',
//       flexWrap: 'wrap',
//     },
//     column: {
//       flex: '1',
//       minWidth: '160px',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '6px',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     input: {
//       width: '100%',
//       padding: '6px',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//       boxSizing: 'border-box',
//       fontSize: '16px',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       maxHeight: '700px',
//       overflowY: 'auto',
//       display: 'block',
//     },
//     th: {
//       backgroundColor: '#343a40',
//       color: '#fff',
//       padding: '6px',
//       textAlign: 'left',
//       border: '1px solid #ddd',
//       fontSize: '16px',
//     },
//     td: {
//       padding: '6px',
//       border: '1px solid #ddd',
//       fontSize: '16px',
//     },
//     noRecords: {
//       textAlign: 'center',
//       padding: '16px',
//       fontSize: '16px',
//     },
//     device: {
//       color: 'blue',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     device2: {
//       color: 'orange',
//       fontWeight: 'bold',
//       fontSize: '16px',
//     },
//     exportButton: {
//       display: 'inline-block',
//       padding: '3px 16px',
//       backgroundColor: '#4CAF50',
//       color: '#fff',
//       borderRadius: '4px',
//       cursor: 'pointer',
//       fontSize: '18px',
//       textAlign: 'center',
//       marginTop: '30px',
//     },
//     chartContainer: {
//       width: '100%',
//       height: 300,
//       marginTop: '20px',
//     },
//     summary: {
//       marginTop: '10px',
//       fontSize: '16px',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select
//             style={styles.input}
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//           >
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select
//             style={styles.input}
//             value={punchType}
//             onChange={(e) => setPunchType(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>

//         {/* Export Button */}
//         <div onClick={handleExport} style={styles.exportButton}>
//           Export
//         </div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div>
//           {chartLoading ? (
//             <div>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart
//                   data={latePunchData}
//                   margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="date"
//                     label={{ value: 'Date', position: 'bottom', offset: 0 }}
//                   />
//                   <YAxis
//                     label={{
//                       value: 'Minutes Late',
//                       angle: -90,
//                       position: 'left',
//                       offset: 10,
//                     }}
//                   />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="lateMinutes"
//                     stroke="#8884d8"
//                     name="Minutes Late"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days
//                 <br />
//                 Total Late Minutes: {monthlyLatePunchSummary.totalMinutesLate} minutes
//                 <br />
//                 Total Days Late: {Math.floor(monthlyLatePunchSummary.totalMinutesLate / 1440)} days
//                 <br />
//               </div>
//             </>
//           ) : (
//             <div>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.employeeName}
//                         </td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.date}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn
//                             .map((time) => new Date(time).toLocaleTimeString())
//                             .join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut
//                             .map((time) => new Date(time).toLocaleTimeString())
//                             .join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.totalWorkingHours}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.extraWorkingHours}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.device}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>
//                         No records found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // Fetch punch data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // Fetch employee list
//   useEffect(() => {
//     const fetchEmployeeList = async () => {
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/employee_list/`
//         );
//         if (response.data.status === 'Success') {
//           setEmployeeList(response.data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching employee list:', err);
//       }
//     };
//     fetchEmployeeList();
//   }, []);

//   // Apply filters: date, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // Late Punch data: Only include a date if the LAST In punch of that day is strictly after 9:30 AM.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalMinutesLate = 0;
//         const latePunches = [];

//         // Filter for selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group by date
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // Process each group (each date)
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr];
//           // Sort by time ascending
//           punches.sort((a, b) => new Date(a.logTime) - new Date(b.logTime));
//           // Get the last In punch for that date
//           const lastInPunch = punches[punches.length - 1];
//           const lastInTime = new Date(lastInPunch.logTime);

//           // Build a threshold at 9:30 AM on that day
//           const threshold = new Date(lastInTime);
//           threshold.setHours(9, 30, 0, 0);

//           // Only include if the last In punch is strictly after 9:30 AM
//           if (lastInTime > threshold) {
//             const diffMs = lastInTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));
//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalMinutesLate += lateMinutes;
//           }
//         });

//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: totalDaysLate,
//           totalMinutesLate: totalMinutesLate,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0,
//         });
//       }
//     };

//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // Group data for the table (unchanged)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                   <YAxis label={{ value: 'Minutes Late', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="#8884d8" name="Minutes Late" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days/month
//                 <br />
//                 No. of Minutes Late: {monthlyLatePunchSummary.totalMinutesLate} minutes/month
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/dailypunch`, payload);
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters for date range, employee, and (if not Late Punches) punch type
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
//   // For each day, consider only the FIRST In punch that occurs strictly after 9:30 AM.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalMinutesLate = 0;
//         const latePunches = [];

//         // Filter only In punches for the selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group these In punches by date
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // For each date, sort by time ascending and pick the first punch that is strictly after 9:30 AM
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           // Find the first In punch that occurs after 9:30 AM
//           const validPunch = punches.find((p) => {
//             const punchTime = new Date(p.logTime);
//             // Create threshold for 9:30 AM on that day
//             const threshold = new Date(punchTime);
//             threshold.setHours(9, 30, 0, 0);
//             return punchTime > threshold;
//           });

//           // If such a punch exists, include this day
//           if (validPunch) {
//             const punchTime = new Date(validPunch.logTime);
//             const threshold = new Date(punchTime);
//             threshold.setHours(9, 30, 0, 0);
//             const diffMs = punchTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalMinutesLate += lateMinutes;
//           }
//         });

//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: totalDaysLate,
//           totalMinutesLate: totalMinutesLate,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for the table (unchanged)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(`Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`);
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                   <YAxis label={{ value: 'Minutes Late', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="#8884d8" name="Minutes Late" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days/month
//                 <br />
//                 No. of Minutes Late: {monthlyLatePunchSummary.totalMinutesLate} minutes/month
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters: Date range, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
//   // For each day, consider only the FIRST In punch. If that punch is strictly after 9:30 AM,
//   // calculate late minutes; otherwise, ignore that day.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalMinutesLate = 0;
//         const latePunches = [];

//         // Filter only In punches for selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group In punches by date (using locale date string)
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // Process each date
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           // Sort the punches for that day by time ascending
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );
//           // Get the FIRST punch of the day
//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Build a threshold for 9:30 AM on that day
//           const threshold = new Date(firstPunchTime);
//           threshold.setHours(9, 30, 0, 0);

//           // Only if the first punch is strictly after 9:30, record the day
//           if (firstPunchTime > threshold) {
//             const diffMs = firstPunchTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalMinutesLate += lateMinutes;
//           }
//         });

//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalMinutesLate,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table (unchanged)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                   <YAxis label={{ value: 'Minutes Late', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="#8884d8" name="Minutes Late" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days/month
//                 <br />
//                 No. of Minutes Late: {monthlyLatePunchSummary.totalMinutesLate} minutes/month
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;











// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalMinutesLate: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters: Date range, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
//   // For each day, consider only the FIRST In punch. If that punch is strictly after 9:30 AM,
//   // calculate late minutes; otherwise, ignore that day.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalMinutesLate = 0;
//         const latePunches = [];

//         // Filter only In punches for selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group In punches by date (using locale date string)
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // Process each date
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           // Sort the punches for that day by time ascending
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );
//           // Get the FIRST punch of the day
//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Build a threshold for 9:30 AM on that day
//           const threshold = new Date(firstPunchTime);
//           threshold.setHours(9, 30, 0, 0);

//           // Only if the first punch is strictly after 9:30, record the day
//           if (firstPunchTime > threshold) {
//             const diffMs = firstPunchTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalMinutesLate += lateMinutes;
//           }
//         });

//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalMinutesLate,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalMinutesLate: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table (unchanged)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom', offset: 0 }} />
//                   <YAxis label={{ value: 'Minutes Late', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   {/* Line now uses red color */}
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Minutes Late" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary:</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days/month
//                 <br />
//                 No. of Minutes Late: {monthlyLatePunchSummary.totalMinutesLate} minutes/month
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters: Date range, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
//   // For each day, consider only the FIRST In punch. If that punch is strictly after 9:30 AM,
//   // calculate late minutes; then convert those minutes into hours.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         // Filter only In punches for selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group In punches by date (using locale date string)
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // Process each date
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           // Sort the punches for that day by time ascending
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );
//           // Get the FIRST punch of the day
//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Build a threshold for 9:30 AM on that day
//           const threshold = new Date(firstPunchTime);
//           threshold.setHours(9, 30, 0, 0);

//           // Only if the first punch is strictly after 9:30, record the day
//           if (firstPunchTime > threshold) {
//             const diffMs = firstPunchTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         // Convert total late minutes into hours (could be fractional)
//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table (unchanged)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Hours', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   {/* Line uses red color */}
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Hours (in Minutes)" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
           
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 

                
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={9} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;











// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters: Date range, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
//   // For each day, consider only the FIRST In punch. If that punch is strictly after 9:30 AM,
//   // calculate late minutes; then convert those minutes into hours.
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         // Filter only In punches for selected employee
//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         // Group In punches by date (using locale date string)
//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         // Process each date
//         Object.keys(groupedByDate).forEach((dateStr) => {
//           // Sort the punches for that day by time ascending
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );
//           // Get the FIRST punch of the day
//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Build a threshold for 9:30 AM on that day
//           const threshold = new Date(firstPunchTime);
//           threshold.setHours(9, 30, 0, 0);

//           // Only if the first punch is strictly after 9:30, record the day
//           if (firstPunchTime > threshold) {
//             const diffMs = firstPunchTime - threshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         // Convert total late minutes into hours (could be fractional)
//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table (unchanged except for added Break Hours & Punch Type)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     // Calculate Total Working Hours and Extra Working Hours in hr/min format
//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     // --- New: Calculate Break Hours ---
//     let breakMinutes = 0;
//     let events = [];
//     item.punchIn.forEach((time) => {
//       events.push({ time: new Date(time), type: 'In' });
//     });
//     item.punchOut.forEach((time) => {
//       if (time) {
//         events.push({ time: new Date(time), type: 'Out' });
//       }
//     });
//     // Sort events by time
//     events.sort((a, b) => a.time - b.time);
//     // Sum up break time (gap from an Out to the next In)
//     for (let i = 0; i < events.length - 1; i++) {
//       if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//         const diff = (events[i + 1].time - events[i].time) / (1000 * 60); // in minutes
//         if (diff > 0) {
//           breakMinutes += diff;
//         }
//       }
//     }
//     const breakHoursValue = breakMinutes / 60;
//     const breakHoursWhole = Math.floor(breakHoursValue);
//     const breakHoursRemaining = Math.round((breakHoursValue - breakHoursWhole) * 60);
//     const breakHoursFormatted = `${breakHoursWhole} hr ${breakHoursRemaining} min`;

//     // --- New: Determine Punch Type based on first Punch In ---
//     let computedPunchType = '';
//     if (inTimes.length > 0) {
//       const sortedInTimes = [...inTimes].sort((a, b) => a - b);
//       const firstPunchIn = sortedInTimes[0];
//       const threshold = new Date(
//         firstPunchIn.getFullYear(),
//         firstPunchIn.getMonth(),
//         firstPunchIn.getDate(),
//         9,
//         30,
//         0,
//         0
//       );
//       computedPunchType = firstPunchIn < threshold ? 'Early' : 'Late';
//     }

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//       breakHours: breakHoursFormatted,
//       computedPunchType: computedPunchType,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       PunchType: item.computedPunchType,
//       BreakHours: item.breakHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Hours', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   {/* Line uses red color */}
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Hours (in Minutes)" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Punch Type</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={styles.td}>{item.breakHours}</td>
//                         <td style={styles.td}>
//                           <span style={item.computedPunchType === 'Early' ? styles.early : styles.late}>
//                             {item.computedPunchType}
//                           </span>
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={11} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters: Date range, employee, and punch type (except Late Punches)
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation:
// useEffect(() => {
//   const fetchLatePunchData = async () => {
//     if (selectedEmployeeId && punchType === 'Late Punches') {
//       setChartLoading(true);

//       let totalDaysLate = 0;
//       let totalLateMinutes = 0;
//       const latePunches = [];

//       // Filter only "In" punches for the selected employee
//       const employeeData = filteredData.filter(
//         (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//       );

//       // Group punches by date
//       const groupedByDate = employeeData.reduce((acc, item) => {
//         const dateStr = new Date(item.logTime).toLocaleDateString();
//         if (!acc[dateStr]) {
//           acc[dateStr] = [];
//         }
//         acc[dateStr].push(item);
//         return acc;
//       }, {});

//       // Process each date
//       Object.keys(groupedByDate).forEach((dateStr) => {
//         // Sort punches by time (ascending order)
//         const punches = groupedByDate[dateStr].sort(
//           (a, b) => new Date(a.logTime) - new Date(b.logTime)
//         );

//         // Get the first punch of the day
//         const firstPunch = punches[0];
//         const firstPunchTime = new Date(firstPunch.logTime);

//         // Set the time thresholds
//         const earlyPunchEnd = new Date(firstPunchTime);
//         earlyPunchEnd.setHours(9, 31, 59, 999); // 9:31:59 AM (milliseconds included)

//         const latePunchStart = new Date(firstPunchTime);
//         latePunchStart.setHours(9, 32, 0, 0); // 9:32:00 AM (start of late punch)

//         // Check if it's a Late Punch
//         if (firstPunchTime >= latePunchStart) {
//           const diffMs = firstPunchTime - latePunchStart;
//           const lateMinutes = Math.round(diffMs / (1000 * 60));

//           latePunches.push({
//             date: dateStr,
//             lateMinutes: lateMinutes,
//           });

//           totalDaysLate++;
//           totalLateMinutes += lateMinutes;
//         }
//       });

//       // Convert total late minutes into hours
//       const totalLateHours = totalLateMinutes / 60;
//       setLatePunchData(latePunches);
//       setMonthlyLatePunchSummary({
//         totalDaysLate,
//         totalLateHours,
//       });
//       setChartLoading(false);
//     } else {
//       setLatePunchData([]);
//       setMonthlyLatePunchSummary({
//         totalDaysLate: 0,
//         totalLateHours: 0,
//       });
//     }
//   };
//   fetchLatePunchData();
// }, [selectedEmployeeId, punchType, filteredData]);



//   // 5. Group data for table (unchanged except for added Break Hours & Punch Type)
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 32, 0, 0);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     // Calculate Total Working Hours and Extra Working Hours in hr/min format
//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     // --- New: Calculate Break Hours ---
//     let breakMinutes = 0;
//     let events = [];
//     item.punchIn.forEach((time) => {
//       events.push({ time: new Date(time), type: 'In' });
//     });
//     item.punchOut.forEach((time) => {
//       if (time) {
//         events.push({ time: new Date(time), type: 'Out' });
//       }
//     });
//     // Sort events by time
//     events.sort((a, b) => a.time - b.time);
//     // Sum up break time (gap from an Out to the next In)
//     for (let i = 0; i < events.length - 1; i++) {
//       if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//         const diff = (events[i + 1].time - events[i].time) / (1000 * 60); // in minutes
//         if (diff > 0) {
//           breakMinutes += diff;
//         }
//       }
//     }
//     const breakHoursValue = breakMinutes / 60;
//     const breakHoursWhole = Math.floor(breakHoursValue);
//     const breakHoursRemaining = Math.round((breakHoursValue - breakHoursWhole) * 60);
//     const breakHoursFormatted = `${breakHoursWhole} hr ${breakHoursRemaining} min`;

//     // --- New: Determine Punch Type based on first Punch In ---
//     let computedPunchType = '';
//     if (inTimes.length > 0) {
//       const sortedInTimes = [...inTimes].sort((a, b) => a - b);
//       const firstPunchIn = sortedInTimes[0];
//       const threshold = new Date(
//         firstPunchIn.getFullYear(),
//         firstPunchIn.getMonth(),
//         firstPunchIn.getDate(),
//         9,
//         30,
//         0,
//         0
//       );
//       // Use <= so that exactly 9:30 AM is considered Early.
//       computedPunchType = firstPunchIn <= threshold ? 'Early' : 'Late';
//     }

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//       breakHours: breakHoursFormatted,
//       computedPunchType: computedPunchType,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       PunchType: item.computedPunchType,
//       BreakHours: item.breakHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Hours', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   {/* Line uses red color */}
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Hours (in Minutes)" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Punch Type</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={styles.td}>{item.breakHours}</td>
//                         <td style={styles.td}>
//                           <span style={item.computedPunchType === 'Early' ? styles.early : styles.late}>
//                             {item.computedPunchType}
//                           </span>
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={11} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59 AM
//           const earlyThreshold = new Date(firstPunchTime);
//           earlyThreshold.setHours(9, 30, 59, 999); // 9:30:59 AM

//           // If first punch is at or after 9:30:59 AM, count it as late
//           if (firstPunchTime > earlyThreshold) { // Changed from >= to >
//             const diffMs = firstPunchTime - earlyThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     let totalWorkingHours = 0;
//     let extraWorkingHours = 0;

//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut.map((time) => (time ? new Date(time) : null));
//     let pairsCount = Math.min(inTimes.length, outTimes.filter((time) => time !== null).length);

//     for (let i = 0; i < pairsCount; i++) {
//       if (outTimes[i] !== null && outTimes[i] > inTimes[i]) {
//         const punchInTime = inTimes[i];
//         const punchOutTime = outTimes[i];

//         const startTimeForCalc = new Date(punchInTime);
//         startTimeForCalc.setHours(9, 30, 59, 999);
//         const endTimeForCalc = new Date(punchOutTime);
//         endTimeForCalc.setHours(18, 30, 0, 0);

//         let workingHoursForPair = 0;
//         let extraHoursForPair = 0;

//         if (punchInTime >= startTimeForCalc && punchOutTime <= endTimeForCalc) {
//           workingHoursForPair = (punchOutTime - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime < startTimeForCalc &&
//           punchOutTime > startTimeForCalc &&
//           punchOutTime <= endTimeForCalc
//         ) {
//           workingHoursForPair = (punchOutTime - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair = (startTimeForCalc - punchInTime) / (1000 * 60 * 60);
//         } else if (
//           punchInTime >= startTimeForCalc &&
//           punchInTime < endTimeForCalc &&
//           punchOutTime > endTimeForCalc
//         ) {
//           workingHoursForPair = (endTimeForCalc - punchInTime) / (1000 * 60 * 60);
//           extraHoursForPair = (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         } else if (punchInTime < startTimeForCalc && punchOutTime > endTimeForCalc) {
//           workingHoursForPair = (endTimeForCalc - startTimeForCalc) / (1000 * 60 * 60);
//           extraHoursForPair =
//             (startTimeForCalc - punchInTime) / (1000 * 60 * 60) +
//             (punchOutTime - endTimeForCalc) / (1000 * 60 * 60);
//         }

//         totalWorkingHours += workingHoursForPair;
//         extraWorkingHours += extraHoursForPair;
//       } else {
//         if (i + 1 < inTimes.length && outTimes.length > 0 && outTimes[i] !== null) {
//           const secondPunchIn = inTimes[i + 1];
//           const firstPunchOut = outTimes[i];
//           if (secondPunchIn && firstPunchOut && secondPunchIn < firstPunchOut) {
//             const difference = (firstPunchOut - secondPunchIn) / (1000 * 60 * 60);
//             console.warn(
//               `Warning: Second punch-in before first punch-out. Calculated time: ${difference.toFixed(2)} hours.`
//             );
//             totalWorkingHours += difference;
//           }
//         }
//       }
//     }

//     if (inTimes.length > outTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-in(s).`);
//     }
//     if (outTimes.length > inTimes.length) {
//       console.warn(`Warning: Employee ${item.employeeId} has unmatched punch-out(s).`);
//     }

//     const hours = Math.floor(totalWorkingHours);
//     const minutes = Math.round((totalWorkingHours % 1) * 60);
//     const extraHours = Math.floor(extraWorkingHours);
//     const extraMinutes = Math.round((extraWorkingHours % 1) * 60);

//     let breakMinutes = 0;
//     let events = [];
//     item.punchIn.forEach((time) => {
//       events.push({ time: new Date(time), type: 'In' });
//     });
//     item.punchOut.forEach((time) => {
//       if (time) {
//         events.push({ time: new Date(time), type: 'Out' });
//       }
//     });
    
//     events.sort((a, b) => a.time - b.time);
    
//     for (let i = 0; i < events.length - 1; i++) {
//       if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//         const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//         if (diff > 0) {
//           breakMinutes += diff;
//         }
//       }
//     }
//     const breakHoursValue = breakMinutes / 60;
//     const breakHoursWhole = Math.floor(breakHoursValue);
//     const breakHoursRemaining = Math.round((breakHoursValue - breakHoursWhole) * 60);
//     const breakHoursFormatted = `${breakHoursWhole} hr ${breakHoursRemaining} min`;

//     let computedPunchType = '';
//     if (inTimes.length > 0) {
//       const sortedInTimes = [...inTimes].sort((a, b) => a - b);
//       const firstPunchIn = sortedInTimes[0];
//       const threshold = new Date(
//         firstPunchIn.getFullYear(),
//         firstPunchIn.getMonth(),
//         firstPunchIn.getDate(),
//         9,
//         30,
//         59,
//         999
//       );
//       computedPunchType = firstPunchIn <= threshold ? 'Early' : 'Late';
//     }

//     return {
//       ...item,
//       totalWorkingHours: `${hours} hr ${minutes} min`,
//       extraWorkingHours: `${extraHours} hr ${extraMinutes} min`,
//       breakHours: breakHoursFormatted,
//       computedPunchType: computedPunchType,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalWorkingHours: item.totalWorkingHours,
//       ExtraWorkingHours: item.extraWorkingHours,
//       PunchType: item.computedPunchType,
//       BreakHours: item.breakHours,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Hours', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Hours (in Minutes)" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Extra Working Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Punch Type</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalWorkingHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.extraWorkingHours}</td>
//                         <td style={styles.td}>{item.breakHours}</td>
//                         <td style={styles.td}>
//                           <span style={item.computedPunchType === 'Early' ? styles.early : styles.late}>
//                             {item.computedPunchType}
//                           </span>
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={11} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59 AM
//           const earlyThreshold = new Date(firstPunchTime);
//           earlyThreshold.setHours(9, 30, 59, 999); // 9:30:59 AM

//           // If first punch is after 9:30:59 AM, count it as late
//           if (firstPunchTime > earlyThreshold) {
//             const diffMs = firstPunchTime - earlyThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "0 hr 0 min";
//     let earlyOutFormatted = "0 hr 0 min";
//     let breakMinutes = 0;
    
//     // Calculate breakMinutes from events
//     let events = [];
//     item.punchIn.forEach((time) => {
//       events.push({ time: new Date(time), type: 'In' });
//     });
//     item.punchOut.forEach((time) => {
//       if (time) {
//         events.push({ time: new Date(time), type: 'Out' });
//       }
//     });
//     events.sort((a, b) => a.time - b.time);
//     for (let i = 0; i < events.length - 1; i++) {
//       if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//         const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//         if (diff > 0) {
//           breakMinutes += diff;
//         }
//       }
//     }
    
//     if (inTimes.length > 0 && outTimes.length > 0) {
//       const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//       const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
      
//       const totalMs = lastPunch - firstPunch;
//       const totalMinutes = Math.round(totalMs / (1000 * 60));
//       const totalHours = totalMs / (1000 * 60 * 60);
//       const totalHoursFloor = Math.floor(totalHours);
//       const totalHoursRemainingMinutes = Math.round((totalHours - totalHoursFloor) * 60);
//       totalHoursFormatted = `${totalHoursFloor} hr ${totalHoursRemainingMinutes} min`;
      
//       // Net working hours = Total Hours minus Break Minutes
//       const netMinutes = totalMinutes - breakMinutes;
//       const netHoursFloor = Math.floor(netMinutes / 60);
//       const netMinutesRemainder = netMinutes % 60;
//       netWorkingHoursFormatted = `${netHoursFloor} hr ${netMinutesRemainder} min`;
      
//       // Late In calculation: if first punch is after 9:30:59.999 AM
//       const lateThreshold = new Date(firstPunch);
//       lateThreshold.setHours(9, 30, 59, 999);
//       if (firstPunch > lateThreshold) {
//         const lateInMs = firstPunch - lateThreshold;
//         const lateInMinutes = Math.round(lateInMs / (1000 * 60));
//         const lateInHoursFloor = Math.floor(lateInMinutes / 60);
//         const lateInRemainder = lateInMinutes % 60;
//         lateInFormatted = `${lateInHoursFloor} hr ${lateInRemainder} min`;
//       } else {
//         lateInFormatted = "0 hr 0 min";
//       }
      
//       // Early Out calculation: if last punch is before 6:29:59.999 PM
//       const earlyOutThreshold = new Date(lastPunch);
//       earlyOutThreshold.setHours(18, 29, 59, 999);
//       if (lastPunch < earlyOutThreshold) {
//         const earlyOutMs = earlyOutThreshold - lastPunch;
//         const earlyOutMinutes = Math.round(earlyOutMs / (1000 * 60));
//         const earlyOutHoursFloor = Math.floor(earlyOutMinutes / 60);
//         const earlyOutRemainder = earlyOutMinutes % 60;
//         earlyOutFormatted = `${earlyOutHoursFloor} hr ${earlyOutRemainder} min`;
//       } else {
//         earlyOutFormatted = "0 hr 0 min";
//       }
//     }
    
//     return {
//       ...item,
//       totalHours: totalHoursFormatted, // Renamed from Total Working Hours to Total Hours
//       breakHours: (() => {
//         const breakHoursValue = breakMinutes / 60;
//         const breakHoursWhole = Math.floor(breakHoursValue);
//         const breakHoursRemaining = Math.round((breakHoursValue - breakHoursWhole) * 60);
//         return `${breakHoursWhole} hr ${breakHoursRemaining} min`;
//       })(),
//       netWorkingHours: netWorkingHoursFormatted, // Total Hours minus Break Hours
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59.999 AM
//           const earlyThreshold = new Date(firstPunchTime);
//           earlyThreshold.setHours(9, 30, 59, 999);

//           // If first punch is after 9:30:59.999 AM, count it as late
//           if (firstPunchTime > earlyThreshold) {
//             const diffMs = firstPunchTime - earlyThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     // Only calculate if there is at least one punch in and one punch out
//     if (inTimes.length > 0 && outTimes.length > 0) {
//       // Calculate only when the number of punch-ins equals the number of punch-outs.
//       if (inTimes.length === outTimes.length) {
//         const pairCount = inTimes.length;
//         if (pairCount === 1) {
//           // Single pair calculation
//           const firstPunch = new Date(inTimes[0]);
//           const lastPunch = new Date(outTimes[0]);

//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // No break time for a single pair
//           breakHoursFormatted = "0 hr 0 min";
//           netWorkingHoursFormatted = totalHoursFormatted;

//           // Late In: show value only if firstPunch is after 9:30:59.999 AM; otherwise, leave blank.
//           const lateThreshold = new Date(firstPunch);
//           lateThreshold.setHours(9, 30, 59, 999);
//           if (firstPunch > lateThreshold) {
//             const lateDiffMs = firstPunch - lateThreshold;
//             const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//             const lateHours = Math.floor(lateDiffMinutes / 60);
//             const lateMinutes = lateDiffMinutes % 60;
//             lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//           } else {
//             lateInFormatted = "";
//           }

//           // Early Out: show value only if lastPunch is before 6:29:59.999 PM; otherwise, leave blank.
//           const earlyOutThreshold = new Date(lastPunch);
//           earlyOutThreshold.setHours(18, 29, 59, 999);
//           if (lastPunch < earlyOutThreshold) {
//             const earlyDiffMs = earlyOutThreshold - lastPunch;
//             const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//             const earlyHours = Math.floor(earlyDiffMinutes / 60);
//             const earlyMinutes = earlyDiffMinutes % 60;
//             earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//           } else {
//             earlyOutFormatted = "";
//           }
//         } else {
//           // More than one pair exists – use overall earliest punch in and latest punch out
//           const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//           const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // Calculate break minutes from the events between punch outs and the subsequent punch ins
//           let breakMinutes = 0;
//           let events = [];
//           item.punchIn.forEach((time) => {
//             events.push({ time: new Date(time), type: 'In' });
//           });
//           item.punchOut.forEach((time) => {
//             if (time) {
//               events.push({ time: new Date(time), type: 'Out' });
//             }
//           });
//           events.sort((a, b) => a.time - b.time);
//           for (let i = 0; i < events.length - 1; i++) {
//             if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//               const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//               if (diff > 0) {
//                 breakMinutes += diff;
//               }
//             }
//           }
//           const breakHours = Math.floor(breakMinutes / 60);
//           const breakRemaining = Math.round(breakMinutes % 60);
//           breakHoursFormatted = `${breakHours} hr ${breakRemaining} min`;

//           // Net working hours = total minutes minus break minutes
//           const netMinutes = totalMinutes - breakMinutes;
//           const netHours = Math.floor(netMinutes / 60);
//           const netRemaining = Math.round(netMinutes % 60);
//           netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;

//           // Late In: calculate from the earliest punch only
//           const lateThreshold = new Date(firstPunch);
//           lateThreshold.setHours(9, 30, 59, 999);
//           if (firstPunch > lateThreshold) {
//             const lateDiffMs = firstPunch - lateThreshold;
//             const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//             const lateHours = Math.floor(lateDiffMinutes / 60);
//             const lateMinutes = lateDiffMinutes % 60;
//             lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//           } else {
//             lateInFormatted = "";
//           }
//           // For multiple pairs, per the requirement, do not calculate Early Out.
//           earlyOutFormatted = "";
//         }
//       } else {
//         // If the number of punch-ins and punch-outs is odd, show zeros.
//         totalHoursFormatted = "0 hr 0 min";
//         netWorkingHoursFormatted = "0 hr 0 min";
//         breakHoursFormatted = "0 hr 0 min";
//         lateInFormatted = "";
//         earlyOutFormatted = "";
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted, // Shown as Total Hours
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted, // Total Hours minus Break Hours
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59.999 AM
//           const earlyThreshold = new Date(firstPunchTime);
//           earlyThreshold.setHours(9, 30, 59, 999);

//           // If first punch is after 9:30:59.999 AM, count it as late
//           if (firstPunchTime > earlyThreshold) {
//             const diffMs = firstPunchTime - earlyThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     if (inTimes.length > 0 && outTimes.length > 0) {
//       // When both punch-ins and punch-outs exist
//       if (inTimes.length === outTimes.length) {
//         // EVEN number of punches (i.e. complete pairs)
//         const pairCount = inTimes.length;
//         // Late In: use the earliest punch
//         const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//         const lateThreshold = new Date(firstPunch);
//         lateThreshold.setHours(9, 30, 59, 999);
//         if (firstPunch > lateThreshold) {
//           const lateDiffMs = firstPunch - lateThreshold;
//           const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//           const lateHours = Math.floor(lateDiffMinutes / 60);
//           const lateMinutes = lateDiffMinutes % 60;
//           lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//         } else {
//           lateInFormatted = "";
//         }

//         // Total Hours, Break Hours, and Net Working Hours calculation
//         if (pairCount === 1) {
//           // Single pair calculation
//           const lastPunch = outTimes[0];
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // No break time for a single pair
//           breakHoursFormatted = "0 hr 0 min";
//           netWorkingHoursFormatted = totalHoursFormatted;
//         } else {
//           // More than one pair exists – use overall earliest punch in and latest punch out
//           const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // Calculate break minutes from the events between punch outs and subsequent punch ins
//           let breakMinutes = 0;
//           let events = [];
//           item.punchIn.forEach((time) => {
//             events.push({ time: new Date(time), type: 'In' });
//           });
//           item.punchOut.forEach((time) => {
//             if (time) {
//               events.push({ time: new Date(time), type: 'Out' });
//             }
//           });
//           events.sort((a, b) => a.time - b.time);
//           for (let i = 0; i < events.length - 1; i++) {
//             if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//               const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//               if (diff > 0) {
//                 breakMinutes += diff;
//               }
//             }
//           }
//           const breakHours = Math.floor(breakMinutes / 60);
//           const breakRemaining = Math.round(breakMinutes % 60);
//           breakHoursFormatted = `${breakHours} hr ${breakRemaining} min`;

//           // Net working hours = total minutes minus break minutes
//           const netMinutes = totalMinutes - breakMinutes;
//           const netHours = Math.floor(netMinutes / 60);
//           const netRemaining = Math.round(netMinutes % 60);
//           netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;
//         }

//         // Early Out calculation for even (complete) pairs:
//         // Regardless of whether there is a single pair or multiple pairs, use the last punch (a punch-out) to calculate
//         const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//         const earlyOutThreshold = new Date(lastPunch);
//         earlyOutThreshold.setHours(18, 29, 59, 999);
//         if (lastPunch < earlyOutThreshold) {
//           const earlyDiffMs = earlyOutThreshold - lastPunch;
//           const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//           const earlyHours = Math.floor(earlyDiffMinutes / 60);
//           const earlyMinutes = earlyDiffMinutes % 60;
//           earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//         } else {
//           earlyOutFormatted = "";
//         }
//       } else {
//         // ODD number of punches: set time calculations to zero and
//         // for Early Out, take the last punch from the combined events if it is an Out.
//         totalHoursFormatted = "0 hr 0 min";
//         netWorkingHoursFormatted = "0 hr 0 min";
//         breakHoursFormatted = "0 hr 0 min";

//         // Late In: use the earliest punch in
//         const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//         const lateThreshold = new Date(firstPunch);
//         lateThreshold.setHours(9, 30, 59, 999);
//         if (firstPunch > lateThreshold) {
//           const lateDiffMs = firstPunch - lateThreshold;
//           const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//           const lateHours = Math.floor(lateDiffMinutes / 60);
//           const lateMinutes = lateDiffMinutes % 60;
//           lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//         } else {
//           lateInFormatted = "";
//         }

//         const combinedEvents = [
//           ...item.punchIn.map((time) => ({ time: new Date(time), type: 'In' })),
//           ...item.punchOut.filter((t) => t).map((time) => ({ time: new Date(time), type: 'Out' })),
//         ];
//         combinedEvents.sort((a, b) => a.time - b.time);
//         const lastEvent = combinedEvents[combinedEvents.length - 1];
//         if (lastEvent && lastEvent.type === 'Out') {
//           const lastPunch = lastEvent.time;
//           const earlyOutThreshold = new Date(lastPunch);
//           earlyOutThreshold.setHours(18, 29, 59, 999);
//           if (lastPunch < earlyOutThreshold) {
//             const earlyDiffMs = earlyOutThreshold - lastPunch;
//             const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//             const earlyHours = Math.floor(earlyDiffMinutes / 60);
//             const earlyMinutes = earlyDiffMinutes % 60;
//             earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//           } else {
//             earlyOutFormatted = "";
//           }
//         } else {
//           earlyOutFormatted = "";
//         }
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted,
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted,
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59.999 AM
//           const earlyThreshold = new Date(firstPunchTime);
//           earlyThreshold.setHours(9, 30, 59, 999);

//           // If first punch is after the threshold, count it as late
//           if (firstPunchTime > earlyThreshold) {
//             const diffMs = firstPunchTime - earlyThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   // Updated calculation: even if an odd punch occurs, always calculate Late In
//   // For working hours, break time, net working hours, and early out,
//   // use only complete (even) pairs (ignore extra unmatched punch).
//   const groupedDataArray = groupedData.map((item) => {
//     const sortedInTimes = item.punchIn.map((time) => new Date(time)).sort((a, b) => a - b);
//     const sortedOutTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null)
//       .sort((a, b) => a - b);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     // Always calculate Late In based on the first punch in
//     if (sortedInTimes.length > 0) {
//       const firstPunch = sortedInTimes[0];
//       const lateThreshold = new Date(firstPunch);
//       lateThreshold.setHours(9, 30, 59, 999);
//       if (firstPunch > lateThreshold) {
//         const lateDiffMs = firstPunch - lateThreshold;
//         const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//         const lateHours = Math.floor(lateDiffMinutes / 60);
//         const lateMinutes = lateDiffMinutes % 60;
//         lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//       }
//     }

//     // Use only complete pairs (i.e. both In and Out exist) for further calculations
//     const pairCount = Math.min(sortedInTimes.length, sortedOutTimes.length);
//     if (pairCount > 0) {
//       // Use the first In and the last Out (from the complete pairs)
//       const firstPunch = sortedInTimes[0];
//       const lastPunch = sortedOutTimes[pairCount - 1];
//       const totalMs = lastPunch - firstPunch;
//       const totalMinutes = Math.round(totalMs / (1000 * 60));
//       const totalHours = Math.floor(totalMinutes / 60);
//       const remainingMinutes = totalMinutes % 60;
//       totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//       // Calculate break minutes from gaps between each complete pair
//       let breakMinutes = 0;
//       for (let i = 0; i < pairCount - 1; i++) {
//         const currentOut = sortedOutTimes[i];
//         const nextIn = sortedInTimes[i + 1];
//         const gap = Math.round((nextIn - currentOut) / (1000 * 60));
//         if (gap > 0) {
//           breakMinutes += gap;
//         }
//       }
//       const breakHours = Math.floor(breakMinutes / 60);
//       const breakRemaining = breakMinutes % 60;
//       breakHoursFormatted = `${breakHours} hr ${breakRemaining} min`;

//       // Net working hours = total minutes minus break minutes
//       const netMinutes = totalMinutes - breakMinutes;
//       const netHours = Math.floor(netMinutes / 60);
//       const netRemaining = netMinutes % 60;
//       netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;

//       // Calculate Early Out based on the last out punch vs threshold (18:29:59.999)
//       const earlyOutThreshold = new Date(lastPunch);
//       earlyOutThreshold.setHours(18, 29, 59, 999);
//       if (lastPunch < earlyOutThreshold) {
//         const earlyDiffMs = earlyOutThreshold - lastPunch;
//         const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//         const earlyHours = Math.floor(earlyDiffMinutes / 60);
//         const earlyMinutes = earlyDiffMinutes % 60;
//         earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted,
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted,
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       PunchOut: item.punchOut
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation (for chart view)
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59.999 AM
//           const lateThreshold = new Date(firstPunchTime);
//           lateThreshold.setHours(9, 30, 59, 999);

//           // If first punch is after 9:30:59.999 AM, count it as late
//           if (firstPunchTime > lateThreshold) {
//             const diffMs = firstPunchTime - lateThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     if (inTimes.length > 0 && outTimes.length > 0) {
//       // Check if we have an even number of punches (complete pairs)
//       if (inTimes.length === outTimes.length) {
//         // EVEN pairs calculation

//         // Late In: use the very first punch
//         const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//         const lateThreshold = new Date(firstPunch);
//         lateThreshold.setHours(9, 30, 59, 999);
//         if (firstPunch > lateThreshold) {
//           const lateDiffMs = firstPunch - lateThreshold;
//           const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//           const lateHours = Math.floor(lateDiffMinutes / 60);
//           const lateMinutes = lateDiffMinutes % 60;
//           lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//         } else {
//           lateInFormatted = "";
//         }

//         // Total Hours, Break Hours, and Net Working Hours calculation
//         if (inTimes.length === 1) {
//           // Single pair
//           const lastPunch = outTimes[0];
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           breakHoursFormatted = "0 hr 0 min";
//           netWorkingHoursFormatted = totalHoursFormatted;
//         } else {
//           // More than one pair: use overall earliest In and latest Out
//           const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // Calculate break minutes between punch-out and next punch-in events
//           let breakMinutes = 0;
//           let events = [];
//           item.punchIn.forEach((time) => {
//             events.push({ time: new Date(time), type: 'In' });
//           });
//           item.punchOut.forEach((time) => {
//             if (time) {
//               events.push({ time: new Date(time), type: 'Out' });
//             }
//           });
//           events.sort((a, b) => a.time - b.time);
//           for (let i = 0; i < events.length - 1; i++) {
//             if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//               const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//               if (diff > 0) {
//                 breakMinutes += diff;
//               }
//             }
//           }
//           const breakHrs = Math.floor(breakMinutes / 60);
//           const breakRemaining = Math.round(breakMinutes % 60);
//           breakHoursFormatted = `${breakHrs} hr ${breakRemaining} min`;

//           // Net working hours = total minutes minus break minutes
//           const netMinutes = totalMinutes - breakMinutes;
//           const netHours = Math.floor(netMinutes / 60);
//           const netRemaining = Math.round(netMinutes % 60);
//           netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;
//         }

//         // Early Out: only computed when pairs are complete
//         const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//         const earlyOutThreshold = new Date(lastPunch);
//         earlyOutThreshold.setHours(18, 29, 59, 999);
//         if (lastPunch < earlyOutThreshold) {
//           const earlyDiffMs = earlyOutThreshold - lastPunch;
//           const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//           const earlyHours = Math.floor(earlyDiffMinutes / 60);
//           const earlyMinutes = earlyDiffMinutes % 60;
//           earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//         } else {
//           earlyOutFormatted = "";
//         }
//       } else {
//         // ODD number of punches:
//         // Always calculate Late In from the first punch...
//         const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//         const lateThreshold = new Date(firstPunch);
//         lateThreshold.setHours(9, 30, 59, 999);
//         if (firstPunch > lateThreshold) {
//           const lateDiffMs = firstPunch - lateThreshold;
//           const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//           const lateHours = Math.floor(lateDiffMinutes / 60);
//           const lateMinutes = lateDiffMinutes % 60;
//           lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//         } else {
//           lateInFormatted = "";
//         }
//         // Do not calculate totals or Early Out when punches are odd
//         totalHoursFormatted = "0 hr 0 min";
//         netWorkingHoursFormatted = "0 hr 0 min";
//         breakHoursFormatted = "0 hr 0 min";
//         earlyOutFormatted = "";
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted,
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted,
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation (for chart view)
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:59.999 AM
//           const lateThreshold = new Date(firstPunchTime);
//           lateThreshold.setHours(9, 30, 0, 0);

//           // If first punch is after 9:30:59.999 AM, count it as late
//           if (firstPunchTime > lateThreshold) {
//             const diffMs = firstPunchTime - lateThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table
//   const groupedData = [];
//   filteredData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);
//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }
//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     // Always calculate Late In if there is at least one punch-in
//     if (inTimes.length > 0) {
//       const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//       const lateThreshold = new Date(firstPunch);
//       lateThreshold.setHours(9, 30, 0, 0);
//       if (firstPunch > lateThreshold) {
//         const lateDiffMs = firstPunch - lateThreshold;
//         const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//         const lateHours = Math.floor(lateDiffMinutes / 60);
//         const lateMinutes = lateDiffMinutes % 60;
//         lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//       }
//     }

//     // Only calculate totals and Early Out if both punch-in and punch-out exist
//     if (inTimes.length > 0 && outTimes.length > 0) {
//       if (inTimes.length === outTimes.length) {
//         // EVEN pairs calculation
//         if (inTimes.length === 1) {
//           // Single pair calculation
//           const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//           const lastPunch = outTimes[0];
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           breakHoursFormatted = "0 hr 0 min";
//           netWorkingHoursFormatted = totalHoursFormatted;
//         } else {
//           // More than one pair: use overall earliest In and latest Out
//           const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//           const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // Calculate break minutes between punch-out and next punch-in events
//           let breakMinutes = 0;
//           let events = [];
//           item.punchIn.forEach((time) => {
//             events.push({ time: new Date(time), type: 'In' });
//           });
//           item.punchOut.forEach((time) => {
//             if (time) {
//               events.push({ time: new Date(time), type: 'Out' });
//             }
//           });
//           events.sort((a, b) => a.time - b.time);
//           for (let i = 0; i < events.length - 1; i++) {
//             if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//               const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//               if (diff > 0) {
//                 breakMinutes += diff;
//               }
//             }
//           }
//           const breakHrs = Math.floor(breakMinutes / 60);
//           const breakRemaining = Math.round(breakMinutes % 60);
//           breakHoursFormatted = `${breakHrs} hr ${breakRemaining} min`;

//           // Net working hours = total minutes minus break minutes
//           const netMinutes = totalMinutes - breakMinutes;
//           const netHours = Math.floor(netMinutes / 60);
//           const netRemaining = Math.round(netMinutes % 60);
//           netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;
//         }

//         // Early Out: only computed when pairs are complete
//         const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//         const earlyOutThreshold = new Date(lastPunch);
//         earlyOutThreshold.setHours(18, 30, 0, 0);
//         if (lastPunch < earlyOutThreshold) {
//           const earlyDiffMs = earlyOutThreshold - lastPunch;
//           const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//           const earlyHours = Math.floor(earlyDiffMinutes / 60);
//           const earlyMinutes = earlyDiffMinutes % 60;
//           earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//         } else {
//           earlyOutFormatted = "";
//         }
//       } else {
//         // ODD number of punches: do not compute totals or Early Out
//         totalHoursFormatted = "0 hr 0 min";
//         netWorkingHoursFormatted = "0 hr 0 min";
//         breakHoursFormatted = "0 hr 0 min";
//         earlyOutFormatted = "";
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted,
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted,
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName,
//       Place: item.place,
//       Date: item.date,
//       PunchIn: item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input type="date" style={styles.input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input type="date" style={styles.input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select style={styles.input} value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select style={styles.input} value={punchType} onChange={(e) => setPunchType(e.target.value)}>
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>Export</div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days, 
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.employeeName}</td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchIn.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>No records found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const PunchLogTable = () => {
//   const [data, setData] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [filteredData, setFilteredData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [punchType, setPunchType] = useState('');
//   const [latePunchData, setLatePunchData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);
//   const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
//     totalDaysLate: 0,
//     totalLateHours: 0,
//   });

//   const payload = {
//     from_date: fromDate,
//     to_date: toDate,
//   };

//   // 1. Fetch Punch Data
//   useEffect(() => {
//     const fetchFilteredData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/dailypunch`,
//           payload
//         );
//         setData(response.data);
//         setFilteredData(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFilteredData();
//   }, [fromDate, toDate]);

//   // 2. Fetch Employee List
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

//   // 3. Apply Filters
//   useEffect(() => {
//     let filtered = data;

//     if (fromDate) {
//       const fromDateObj = new Date(fromDate);
//       fromDateObj.setHours(0, 0, 0, 0);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(0, 0, 0, 0);
//         return itemDate >= fromDateObj;
//       });
//     }
//     if (toDate) {
//       const toDateObj = new Date(toDate);
//       toDateObj.setHours(23, 59, 59, 999);
//       filtered = filtered.filter((item) => {
//         const itemDate = new Date(item.logTime);
//         itemDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDateObj;
//       });
//     }
//     if (selectedEmployeeId) {
//       filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
//     }
//     if (punchType && punchType !== 'Late Punches') {
//       filtered = filtered.filter((item) => item.logType === punchType);
//     }

//     setFilteredData(filtered);
//   }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

//   // 4. Late Punch Calculation (for chart view)
//   useEffect(() => {
//     const fetchLatePunchData = async () => {
//       if (selectedEmployeeId && punchType === 'Late Punches') {
//         setChartLoading(true);

//         let totalDaysLate = 0;
//         let totalLateMinutes = 0;
//         const latePunches = [];

//         const employeeData = filteredData.filter(
//           (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
//         );

//         const groupedByDate = employeeData.reduce((acc, item) => {
//           const dateStr = new Date(item.logTime).toLocaleDateString();
//           if (!acc[dateStr]) {
//             acc[dateStr] = [];
//           }
//           acc[dateStr].push(item);
//           return acc;
//         }, {});

//         Object.keys(groupedByDate).forEach((dateStr) => {
//           const punches = groupedByDate[dateStr].sort(
//             (a, b) => new Date(a.logTime) - new Date(b.logTime)
//           );

//           const firstPunch = punches[0];
//           const firstPunchTime = new Date(firstPunch.logTime);

//           // Set the threshold time for late punches to 9:30:00 AM
//           const lateThreshold = new Date(firstPunchTime);
//           lateThreshold.setHours(9, 30, 0, 0);

//           // If first punch is after 9:30:00 AM, count it as late
//           if (firstPunchTime > lateThreshold) {
//             const diffMs = firstPunchTime - lateThreshold;
//             const lateMinutes = Math.round(diffMs / (1000 * 60));

//             latePunches.push({
//               date: dateStr,
//               lateMinutes: lateMinutes,
//             });
//             totalDaysLate++;
//             totalLateMinutes += lateMinutes;
//           }
//         });

//         const totalLateHours = totalLateMinutes / 60;
//         setLatePunchData(latePunches);
//         setMonthlyLatePunchSummary({
//           totalDaysLate,
//           totalLateHours,
//         });
//         setChartLoading(false);
//       } else {
//         setLatePunchData([]);
//         setMonthlyLatePunchSummary({
//           totalDaysLate: 0,
//           totalLateHours: 0,
//         });
//       }
//     };
//     fetchLatePunchData();
//   }, [selectedEmployeeId, punchType, filteredData]);

//   // 5. Group data for table (using sorted filteredData)
//   // Sort filteredData in descending order based on logTime
//   const sortedData = [...filteredData].sort((a, b) => new Date(b.logTime) - new Date(a.logTime));

//   const groupedData = [];
//   sortedData.forEach((item) => {
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString()}`;
//     const index = groupedData.findIndex((group) => group.key === key);

//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString(),
//         punchIn: [],
//         punchOut: [],
//         device: item.device,
//       });
//     }

//     if (item.logType === 'In') {
//       groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
//     } else if (item.logType === 'Out') {
//       groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
//     }
//   });

//   const groupedDataArray = groupedData.map((item) => {
//     const inTimes = item.punchIn.map((time) => new Date(time));
//     const outTimes = item.punchOut
//       .map((time) => (time ? new Date(time) : null))
//       .filter((t) => t !== null);

//     let totalHoursFormatted = "0 hr 0 min";
//     let netWorkingHoursFormatted = "0 hr 0 min";
//     let breakHoursFormatted = "0 hr 0 min";
//     let lateInFormatted = "";
//     let earlyOutFormatted = "";

//     // Always calculate Late In if there is at least one punch-in
//     if (inTimes.length > 0) {
//       const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//       const lateThreshold = new Date(firstPunch);
//       lateThreshold.setHours(9, 30, 0, 0);
//       if (firstPunch > lateThreshold) {
//         const lateDiffMs = firstPunch - lateThreshold;
//         const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
//         const lateHours = Math.floor(lateDiffMinutes / 60);
//         const lateMinutes = lateDiffMinutes % 60;
//         lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
//       }
//     }

//     // Only calculate totals and Early Out if both punch-in and punch-out exist
//     if (inTimes.length > 0 && outTimes.length > 0) {
//       if (inTimes.length === outTimes.length) {
//         // EVEN pairs calculation
//         if (inTimes.length === 1) {
//           // Single pair calculation
//           const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//           const lastPunch = outTimes[0];
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           breakHoursFormatted = "0 hr 0 min";
//           netWorkingHoursFormatted = totalHoursFormatted;
//         } else {
//           // More than one pair: use overall earliest In and latest Out
//           const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
//           const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//           const totalMs = lastPunch - firstPunch;
//           const totalMinutes = Math.round(totalMs / (1000 * 60));
//           const totalHours = Math.floor(totalMinutes / 60);
//           const remainingMinutes = totalMinutes % 60;
//           totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

//           // Calculate break minutes between punch-out and next punch-in events
//           let breakMinutes = 0;
//           let events = [];
//           item.punchIn.forEach((time) => {
//             events.push({ time: new Date(time), type: 'In' });
//           });
//           item.punchOut.forEach((time) => {
//             if (time) {
//               events.push({ time: new Date(time), type: 'Out' });
//             }
//           });
//           events.sort((a, b) => a.time - b.time);
//           for (let i = 0; i < events.length - 1; i++) {
//             if (events[i].type === 'Out' && events[i + 1].type === 'In') {
//               const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
//               if (diff > 0) {
//                 breakMinutes += diff;
//               }
//             }
//           }
//           const breakHrs = Math.floor(breakMinutes / 60);
//           const breakRemaining = Math.round(breakMinutes % 60);
//           breakHoursFormatted = `${breakHrs} hr ${breakRemaining} min`;

//           // Net working hours = total minutes minus break minutes
//           const netMinutes = totalMinutes - breakMinutes;
//           const netHours = Math.floor(netMinutes / 60);
//           const netRemaining = Math.round(netMinutes % 60);
//           netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;
//         }

//         // Early Out: only computed when pairs are complete
//         const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
//         const earlyOutThreshold = new Date(lastPunch);
//         earlyOutThreshold.setHours(18, 30, 0, 0);
//         if (lastPunch < earlyOutThreshold) {
//           const earlyDiffMs = earlyOutThreshold - lastPunch;
//           const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
//           const earlyHours = Math.floor(earlyDiffMinutes / 60);
//           const earlyMinutes = earlyDiffMinutes % 60;
//           earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
//         } else {
//           earlyOutFormatted = "";
//         }
//       } else {
//         // ODD number of punches: do not compute totals or Early Out
//         totalHoursFormatted = "0 hr 0 min";
//         netWorkingHoursFormatted = "0 hr 0 min";
//         breakHoursFormatted = "0 hr 0 min";
//         earlyOutFormatted = "";
//       }
//     }

//     return {
//       ...item,
//       totalHours: totalHoursFormatted,
//       breakHours: breakHoursFormatted,
//       netWorkingHours: netWorkingHoursFormatted,
//       lateIn: lateInFormatted,
//       earlyOut: earlyOutFormatted,
//       // New property: true if there's an unmatched punch (i.e. remaining punch)
//       lastPunchRemaining: item.punchIn.length > item.punchOut.length,
//     };
//   });

//   // 6. Export to Excel
//   const handleExport = () => {
//     const exportData = groupedDataArray.map((item) => ({
//       EmployeeName: item.employeeName + (item.lastPunchRemaining ? ' (Last Punch Remaining)' : ''),
//       Place: item.place,
//       Date: item.date,
//       // Reverse the punchIn array for LIFO display in the export as well
//       PunchIn: item.punchIn
//         .slice()
//         .reverse()
//         .map((time) => new Date(time).toLocaleTimeString())
//         .join(', '),
//       PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
//       TotalHours: item.totalHours,
//       BreakHours: item.breakHours,
//       TotalWorkingHours: item.netWorkingHours,
//       LateIn: item.lateIn,
//       EarlyOut: item.earlyOut,
//       Device: item.device,
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
//     XLSX.writeFile(wb, 'PunchLogData.xlsx');
//   };

//   // 7. Styles
//   const styles = {
//     container: { padding: '16px' },
//     row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
//     column: { flex: '1', minWidth: '160px' },
//     label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
//     input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
//     table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
//     th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
//     td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
//     noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
//     device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
//     device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
//     exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
//     chartContainer: { width: '100%', height: 300, marginTop: '20px' },
//     summary: { marginTop: '10px', fontSize: '16px' },
//     early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
//     late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Filters */}
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label style={styles.label}>From Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>To Date:</label>
//           <input
//             type="date"
//             style={styles.input}
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Employee Name:</label>
//           <select
//             style={styles.input}
//             value={selectedEmployeeId}
//             onChange={(e) => setSelectedEmployeeId(e.target.value)}
//           >
//             <option value="">All</option>
//             {employeeList.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.employeeName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div style={styles.column}>
//           <label style={styles.label}>Punch Type:</label>
//           <select
//             style={styles.input}
//             value={punchType}
//             onChange={(e) => setPunchType(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="In">In Punches</option>
//             <option value="Out">Out Punches</option>
//             <option value="Late Punches">Late Punches</option>
//           </select>
//         </div>
//         <div onClick={handleExport} style={styles.exportButton}>
//           Export
//         </div>
//       </div>

//       {/* Late Punch Chart */}
//       {punchType === 'Late Punches' && selectedEmployeeId && (
//         <div style={styles.chartContainer}>
//           {chartLoading ? (
//             <div style={styles.noRecords}>Loading chart data...</div>
//           ) : latePunchData.length > 0 ? (
//             <>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div style={styles.summary}>
//                 <strong>Late Punches Summary</strong>
//                 <br />
//                 No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days,
//                 <br />
//                 Total Late Time:{" "}
//                 {(() => {
//                   const totalLateHours = monthlyLatePunchSummary.totalLateHours;
//                   const wholeHours = Math.floor(totalLateHours);
//                   const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
//                   return `${wholeHours} hr ${remainingMinutes} min`;
//                 })()}
//               </div>
//             </>
//           ) : (
//             <div style={styles.noRecords}>No late punches found for the selected employee.</div>
//           )}
//         </div>
//       )}

//       {/* Table for non-late punches */}
//       {punchType !== 'Late Punches' && (
//         <>
//           {loading ? (
//             <div style={styles.noRecords}>Loading...</div>
//           ) : error ? (
//             <div style={styles.noRecords}>{error}</div>
//           ) : (
//             <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
//               <table style={styles.table}>
//                 <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
//                   <tr style={{ margin: '0px' }}>
//                     <th style={styles.th}>S.No</th>
//                     <th style={styles.th}>Employee Name</th>
//                     <th style={styles.th}>Place</th>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Punch Time In</th>
//                     <th style={styles.th}>Punch Time Out</th>
//                     <th style={styles.th}>Total Hours</th>
//                     <th style={styles.th}>Break Hours</th>
//                     <th style={styles.th}>Total Working Hours</th>
//                     <th style={styles.th}>Late In</th>
//                     <th style={styles.th}>Early Out</th>
//                     <th style={styles.th}>Device</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedDataArray.length > 0 ? (
//                     groupedDataArray.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>
//                           {item.employeeName}
//                           {item.lastPunchRemaining ? ' (Last Punch Remaining)' : ''}
//                         </td>
//                         <td style={styles.td}>{item.place}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {/* Reverse the punchIn array for LIFO display */}
//                           {item.punchIn
//                             .slice()
//                             .reverse()
//                             .map((time) => new Date(time).toLocaleTimeString())
//                             .join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device2 }}>
//                           {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
//                         </td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
//                         <td style={styles.td}>{item.lateIn}</td>
//                         <td style={styles.td}>{item.earlyOut}</td>
//                         <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>
//                         No records found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PunchLogTable;












import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PunchLogTable = () => {
  const [data, setData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [punchType, setPunchType] = useState('');
  const [latePunchData, setLatePunchData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
    totalDaysLate: 0,
    totalLateHours: 0,
  });
  const payload = {
    from_date: fromDate,
    to_date: toDate,
  };

  // 1. Fetch Punch Data
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/dailypunch`,
          payload
        );
        setData(response.data);
        setFilteredData(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredData();
  }, [fromDate, toDate]);

  // 2. Fetch Employee List
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

  // 3. Apply Filters
  useEffect(() => {
    let filtered = data;

    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      fromDateObj.setHours(0, 0, 0, 0);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.logTime);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= fromDateObj;
      });
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.logTime);
        itemDate.setHours(23, 59, 59, 999);
        return itemDate <= toDateObj;
      });
    }
    if (selectedEmployeeId) {
      filtered = filtered.filter((item) => item.employeeId === selectedEmployeeId);
    }
    if (punchType && punchType !== 'Late Punches') {
      filtered = filtered.filter((item) => item.logType === punchType);
    }

    setFilteredData(filtered);
  }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

  // 4. Late Punch Calculation (for chart view)
  useEffect(() => {
    const fetchLatePunchData = async () => {
      if (selectedEmployeeId && punchType === 'Late Punches') {
        setChartLoading(true);

        let totalDaysLate = 0;
        let totalLateMinutes = 0;
        const latePunches = [];

        const employeeData = filteredData.filter(
          (item) => item.employeeId === selectedEmployeeId && item.logType === 'In'
        );

        const groupedByDate = employeeData.reduce((acc, item) => {
          const dateStr = new Date(item.logTime).toLocaleDateString('en-GB');
          if (!acc[dateStr]) {
            acc[dateStr] = [];
          }
          acc[dateStr].push(item);
          return acc;
        }, {});

        Object.keys(groupedByDate).forEach((dateStr) => {
          const punches = groupedByDate[dateStr].sort(
            (a, b) => new Date(a.logTime) - new Date(b.logTime)
          );

          const firstPunch = punches[0];
          const firstPunchTime = new Date(firstPunch.logTime);

          // Set the threshold time for late punches to 9:30:00 AM
          const lateThreshold = new Date(firstPunchTime);
          lateThreshold.setHours(9, 30, 0, 0);

          // If first punch is after 9:30:00 AM, count it as late
          if (firstPunchTime > lateThreshold) {
            const diffMs = firstPunchTime - lateThreshold;
            const lateMinutes = Math.round(diffMs / (1000 * 60));

            latePunches.push({
              date: dateStr,
              lateMinutes: lateMinutes,
            });
            totalDaysLate++;
            totalLateMinutes += lateMinutes;
          }
        });

        const totalLateHours = totalLateMinutes / 60;
        setLatePunchData(latePunches);
        setMonthlyLatePunchSummary({
          totalDaysLate,
          totalLateHours,
        });
        setChartLoading(false);
      } else {
        setLatePunchData([]);
        setMonthlyLatePunchSummary({
          totalDaysLate: 0,
          totalLateHours: 0,
        });
      }
    };
    fetchLatePunchData();
  }, [selectedEmployeeId, punchType, filteredData]);

  // 5. Group data for table (using sorted filteredData)
  // Sort filteredData in descending order based on logTime
  const sortedData = [...filteredData].sort((a, b) => new Date(b.logTime) - new Date(a.logTime));

  const groupedData = [];
  sortedData.forEach((item) => {
    const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString('en-GB')}`;
    const index = groupedData.findIndex((group) => group.key === key);

    if (index === -1) {
      groupedData.push({
        key,
        employeeId: item.employeeId,
        employeeName:
          employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
          item.employeeId,
        place: item.place1,
        date: new Date(item.logTime).toLocaleDateString('en-GB'),
        punchIn: [],
        punchOut: [],
        device: item.device,
      });
    }

    if (item.logType === 'In') {
      groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
    } else if (item.logType === 'Out') {
      groupedData.find((group) => group.key === key).punchOut.push(item.logTime);
    }
  });

  const groupedDataArray = groupedData.map((item) => {
    const inTimes = item.punchIn.map((time) => new Date(time));
    const outTimes = item.punchOut
      .map((time) => (time ? new Date(time) : null))
      .filter((t) => t !== null);

    let totalHoursFormatted = "0 hr 0 min";
    let netWorkingHoursFormatted = "0 hr 0 min";
    let breakHoursFormatted = "0 hr 0 min";
    let lateInFormatted = "";
    let earlyOutFormatted = "";

    // Always calculate Late In if there is at least one punch-in
    if (inTimes.length > 0) {
      const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
      const lateThreshold = new Date(firstPunch);
      lateThreshold.setHours(9, 30, 0, 0);
      if (firstPunch > lateThreshold) {
        const lateDiffMs = firstPunch - lateThreshold;
        const lateDiffMinutes = Math.round(lateDiffMs / (1000 * 60));
        const lateHours = Math.floor(lateDiffMinutes / 60);
        const lateMinutes = lateDiffMinutes % 60;
        lateInFormatted = `${lateHours} hr ${lateMinutes} min`;
      }
    }

    // Only calculate totals and Early Out if both punch-in and punch-out exist
    if (inTimes.length > 0 && outTimes.length > 0) {
      if (inTimes.length === outTimes.length) {
        // EVEN pairs calculation
        if (inTimes.length === 1) {
          // Single pair calculation
          const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
          const lastPunch = outTimes[0];
          const totalMs = lastPunch - firstPunch;
          const totalMinutes = Math.round(totalMs / (1000 * 60));
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

          breakHoursFormatted = "0 hr 0 min";
          netWorkingHoursFormatted = totalHoursFormatted;
        } else {
          // More than one pair: use overall earliest In and latest Out
          const firstPunch = new Date(Math.min(...inTimes.map((t) => t.getTime())));
          const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
          const totalMs = lastPunch - firstPunch;
          const totalMinutes = Math.round(totalMs / (1000 * 60));
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

          // Calculate break minutes between punch-out and next punch-in events
          let breakMinutes = 0;
          let events = [];
          item.punchIn.forEach((time) => {
            events.push({ time: new Date(time), type: 'In' });
          });
          item.punchOut.forEach((time) => {
            if (time) {
              events.push({ time: new Date(time), type: 'Out' });
            }
          });
          events.sort((a, b) => a.time - b.time);
          for (let i = 0; i < events.length - 1; i++) {
            if (events[i].type === 'Out' && events[i + 1].type === 'In') {
              const diff = (events[i + 1].time - events[i].time) / (1000 * 60);
              if (diff > 0) {
                breakMinutes += diff;
              }
            }
          }
          const breakHrs = Math.floor(breakMinutes / 60);
          const breakRemaining = Math.round(breakMinutes % 60);
          breakHoursFormatted = `${breakHrs} hr ${breakRemaining} min`;

          // Net working hours = total minutes minus break minutes
          const netMinutes = totalMinutes - breakMinutes;
          const netHours = Math.floor(netMinutes / 60);
          const netRemaining = Math.round(netMinutes % 60);
          netWorkingHoursFormatted = `${netHours} hr ${netRemaining} min`;
        }

        // Early Out: only computed when pairs are complete
        const lastPunch = new Date(Math.max(...outTimes.map((t) => t.getTime())));
        const earlyOutThreshold = new Date(lastPunch);
        earlyOutThreshold.setHours(18, 30, 0, 0);
        if (lastPunch < earlyOutThreshold) {
          const earlyDiffMs = earlyOutThreshold - lastPunch;
          const earlyDiffMinutes = Math.round(earlyDiffMs / (1000 * 60));
          const earlyHours = Math.floor(earlyDiffMinutes / 60);
          const earlyMinutes = earlyDiffMinutes % 60;
          earlyOutFormatted = `${earlyHours} hr ${earlyMinutes} min`;
        } else {
          earlyOutFormatted = "";
        }
      } else {
        // ODD number of punches: do not compute totals or Early Out
        totalHoursFormatted = "0 hr 0 min";
        netWorkingHoursFormatted = "0 hr 0 min";
        breakHoursFormatted = "0 hr 0 min";
        earlyOutFormatted = "";
      }
    }

    return {
      ...item,
      totalHours: totalHoursFormatted,
      breakHours: breakHoursFormatted,
      netWorkingHours: netWorkingHoursFormatted,
      lateIn: lateInFormatted,
      earlyOut: earlyOutFormatted,
    };
  });

  // 6. Export to Excel
  const handleExport = () => {
    const exportData = groupedDataArray.map((item) => ({
      EmployeeName: item.employeeName,
      Place: item.place,
      Date: item.date,
      // Reverse the punchIn array for LIFO display in the export as well
      PunchIn: item.punchIn
        .slice()
        .reverse()
        .map((time) => new Date(time).toLocaleTimeString())
        .join(', '),
      PunchOut: item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', '),
      TotalHours: item.totalHours,
      BreakHours: item.breakHours,
      TotalWorkingHours: item.netWorkingHours,
      LateIn: item.lateIn,
      EarlyOut: item.earlyOut,
      Device: item.device,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PunchLog');
    XLSX.writeFile(wb, 'PunchLogData.xlsx');
  };

  // 7. Styles
  const styles = {
    container: { padding: '16px' },
    row: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
    column: { flex: '1', minWidth: '160px' },
    label: { display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '16px' },
    input: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', maxHeight: '700px', overflowY: 'auto', display: 'block' },
    th: { backgroundColor: '#343a40', color: '#fff', padding: '6px', textAlign: 'left', border: '1px solid #ddd', fontSize: '16px' },
    td: { padding: '6px', border: '1px solid #ddd', fontSize: '16px' },
    noRecords: { textAlign: 'center', padding: '16px', fontSize: '16px' },
    device: { color: 'blue', fontWeight: 'bold', fontSize: '16px' },
    device2: { color: 'orange', fontWeight: 'bold', fontSize: '16px' },
    exportButton: { display: 'inline-block', padding: '3px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', textAlign: 'center', marginTop: '30px' },
    chartContainer: { width: '100%', height: 300, marginTop: '20px' },
    summary: { marginTop: '10px', fontSize: '16px' },
    early: { color: 'green', fontWeight: 'bold', fontSize: '16px' },
    late: { color: 'red', fontWeight: 'bold', fontSize: '16px' },
  };

  return (
    <div style={styles.container}>
      {/* Filters */}
      <div style={styles.row}>
        <div style={styles.column}>
          <label style={styles.label}>From Date:</label>
          <input
            type="date"
            style={styles.input}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>To Date:</label>
          <input
            type="date"
            style={styles.input}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div style={styles.column}>
          <label style={styles.label}>Employee Name:</label>
          <select
            style={styles.input}
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
        <div style={styles.column}>
          <label style={styles.label}>Punch Type:</label>
          <select
            style={styles.input}
            value={punchType}
            onChange={(e) => setPunchType(e.target.value)}
          >
            <option value="">All</option>
            <option value="In">In Punches</option>
            <option value="Out">Out Punches</option>
            <option value="Late Punches">Late Punches</option>
          </select>
        </div>
        <div onClick={handleExport} style={styles.exportButton}>
          Export
        </div>
      </div>

      {/* Late Punch Chart */}
      {punchType === 'Late Punches' && selectedEmployeeId && (
        <div style={styles.chartContainer}>
          {chartLoading ? (
            <div style={styles.noRecords}>Loading chart data...</div>
          ) : latePunchData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latePunchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Late Minutes', angle: -90, position: 'left', offset: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lateMinutes" stroke="red" name="Late Minutes" />
                </LineChart>
              </ResponsiveContainer>
              <div style={styles.summary}>
                <strong>Late Punches Summary</strong>
                <br />
                No. of Days Late: {monthlyLatePunchSummary.totalDaysLate} days,
                <br />
                Total Late Time:{" "}
                {(() => {
                  const totalLateHours = monthlyLatePunchSummary.totalLateHours;
                  const wholeHours = Math.floor(totalLateHours);
                  const remainingMinutes = Math.round((totalLateHours - wholeHours) * 60);
                  return `${wholeHours} hr ${remainingMinutes} min`;
                })()}
              </div>
            </>
          ) : (
            <div style={styles.noRecords}>No late punches found for the selected employee.</div>
          )}
        </div>
      )}

      {/* Table for non-late punches */}
      {punchType !== 'Late Punches' && (
        <>
          {loading ? (
            <div style={styles.noRecords}>Loading...</div>
          ) : error ? (
            <div style={styles.noRecords}>{error}</div>
          ) : (
            <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
              <table style={styles.table}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{ margin: '0px' }}>
                    <th style={styles.th}>S.No</th>
                    <th style={styles.th}>Employee Name</th>
                    <th style={styles.th}>Place</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Punch Time In</th>
                    <th style={styles.th}>Punch Time Out</th>
                    <th style={styles.th}>Total Hours</th>
                    <th style={styles.th}>Break Hours</th>
                    <th style={styles.th}>Total Working Hours</th>
                    <th style={styles.th}>Late In</th>
                    <th style={styles.th}>Early Out</th>
                    <th style={styles.th}>Device</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedDataArray.length > 0 ? (
                    groupedDataArray.map((item, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={{ ...styles.td, ...styles.device }}>
                          {item.employeeName}
                        </td>
                        <td style={styles.td}>{item.place}</td>
                        <td style={{ ...styles.td, ...styles.device }}>{item.date}</td>
                        <td style={{ ...styles.td, ...styles.device2 }}>
                          {/* Reverse the punchIn array for LIFO display */}
                          {item.punchIn
                            .slice()
                            .reverse()
                            .map((time) => new Date(time).toLocaleTimeString())
                            .join(', ')}
                        </td>
                        <td style={{ ...styles.td, ...styles.device2 }}>
                          {item.punchOut.map((time) => new Date(time).toLocaleTimeString()).join(', ')}
                        </td>
                        <td style={{ ...styles.td, ...styles.device }}>{item.totalHours}</td>
                        <td style={{ ...styles.td, ...styles.device }}>{item.breakHours}</td>
                        <td style={{ ...styles.td, ...styles.device }}>{item.netWorkingHours}</td>
                        <td style={styles.td}>{item.lateIn}</td>
                        <td style={styles.td}>{item.earlyOut}</td>
                        <td style={{ ...styles.td, ...styles.device }}>{item.device}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} style={{ ...styles.td, ...styles.noRecords }}>
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PunchLogTable;
