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
//           const dateStr = new Date(item.logTime).toLocaleDateString('en-GB');
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
//     const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString('en-GB')}`;
//     const index = groupedData.findIndex((group) => group.key === key);

//     if (index === -1) {
//       groupedData.push({
//         key,
//         employeeId: item.employeeId,
//         employeeName:
//           employeeList.find((emp) => emp.employeeId === item.employeeId)?.employeeName ||
//           item.employeeId,
//         place: item.place1,
//         date: new Date(item.logTime).toLocaleDateString('en-GB'),
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PunchLogTable = () => {
  const [data, setData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [punchType, setPunchType] = useState("");
  const [latePunchData, setLatePunchData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
    totalDaysLate: 0,
    totalLateHours: 0,
  });
  const [showExtraColumns, setShowExtraColumns] = useState(true);
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
        setError("Error fetching data. Please try again.");
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
      filtered = filtered.filter(
        (item) => item.employeeId === selectedEmployeeId
      );
    }
    if (punchType && punchType !== "Late Punches") {
      filtered = filtered.filter((item) => item.logType === punchType);
    }

    setFilteredData(filtered);
  }, [fromDate, toDate, selectedEmployeeId, data, punchType]);

  // 4. Late Punch Calculation (for chart view)
  useEffect(() => {
    const fetchLatePunchData = async () => {
      if (selectedEmployeeId && punchType === "Late Punches") {
        setChartLoading(true);

        let totalDaysLate = 0;
        let totalLateMinutes = 0;
        const latePunches = [];

        const employeeData = filteredData.filter(
          (item) =>
            item.employeeId === selectedEmployeeId && item.logType === "In"
        );

        const groupedByDate = employeeData.reduce((acc, item) => {
          const dateStr = new Date(item.logTime).toLocaleDateString("en-GB");
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
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.logTime) - new Date(a.logTime)
  );

  const groupedData = [];
  sortedData.forEach((item) => {
    const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString(
      "en-GB"
    )}`;
    const index = groupedData.findIndex((group) => group.key === key);

    if (index === -1) {
      groupedData.push({
        key,
        employeeId: item.employeeId,
        employeeName:
          employeeList.find((emp) => emp.employeeId === item.employeeId)
            ?.employeeName || item.employeeId,
        place: item.place1,
        date: new Date(item.logTime).toLocaleDateString("en-GB"),
        punchIn: [],
        punchOut: [],
        device: item.device,
      });
    }

    if (item.logType === "In") {
      groupedData.find((group) => group.key === key).punchIn.push(item.logTime);
    } else if (item.logType === "Out") {
      groupedData
        .find((group) => group.key === key)
        .punchOut.push(item.logTime);
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
          const firstPunch = new Date(
            Math.min(...inTimes.map((t) => t.getTime()))
          );
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
          const firstPunch = new Date(
            Math.min(...inTimes.map((t) => t.getTime()))
          );
          const lastPunch = new Date(
            Math.max(...outTimes.map((t) => t.getTime()))
          );
          const totalMs = lastPunch - firstPunch;
          const totalMinutes = Math.round(totalMs / (1000 * 60));
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          totalHoursFormatted = `${totalHours} hr ${remainingMinutes} min`;

          // Calculate break minutes between punch-out and next punch-in events
          let breakMinutes = 0;
          let events = [];
          item.punchIn.forEach((time) => {
            events.push({ time: new Date(time), type: "In" });
          });
          item.punchOut.forEach((time) => {
            if (time) {
              events.push({ time: new Date(time), type: "Out" });
            }
          });
          events.sort((a, b) => a.time - b.time);
          for (let i = 0; i < events.length - 1; i++) {
            if (events[i].type === "Out" && events[i + 1].type === "In") {
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
        const lastPunch = new Date(
          Math.max(...outTimes.map((t) => t.getTime()))
        );
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
        .join(", "),
      PunchOut: item.punchOut
        .map((time) => new Date(time).toLocaleTimeString())
        .join(", "),
      TotalHours: item.totalHours,
      BreakHours: item.breakHours,
      TotalWorkingHours: item.netWorkingHours,
      LateIn: item.lateIn,
      EarlyOut: item.earlyOut,
      Device: item.device,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PunchLog");
    XLSX.writeFile(wb, "PunchLogData.xlsx");
  };

  const styles = {
    column: { flex: "1", minWidth: "160px" },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "bold",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "6px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
      fontSize: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      maxHeight: "700px",
      overflowY: "auto",
      display: "block",
    },
    th: {
      backgroundColor: "#343a40",
      color: "#fff",
      padding: "6px",
      textAlign: "left",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    td: { padding: "6px", border: "1px solid #ddd", fontSize: "16px" },
    noRecords: { textAlign: "center", padding: "16px", fontSize: "16px" },
    device: { color: "blue", fontWeight: "bold", fontSize: "16px" },
    device2: { color: "orange", fontWeight: "bold", fontSize: "16px" },
   
    chartContainer: { width: "100%", height: 300, marginTop: "20px" },
    summary: { marginTop: "10px", fontSize: "16px" },
    early: { color: "green", fontWeight: "bold", fontSize: "16px" },
    late: { color: "red", fontWeight: "bold", fontSize: "16px" },
  };

  return (
    <div className="container">
       <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Punch Report</h1>
       <div className="flex justify-end">
        
        <button
          onClick={() => setShowExtraColumns(!showExtraColumns)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition "
        >
          {showExtraColumns ? "Hide Extra Columns" : "Show Extra Columns"}
        </button>
      </div>
      <div className="filters">
        <div className="filter-item">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Employee Name:</label>
          <select
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
        <div className="filter-item">
          <label>Punch Type:</label>
          <select
            value={punchType}
            onChange={(e) => setPunchType(e.target.value)}
          >
            <option value="">All</option>
            <option value="In">In Punches</option>
            <option value="Out">Out Punches</option>
            <option value="Late Punches">Late Punches</option>
          </select>
        </div>
        <div className="exportbtn">
          <div onClick={handleExport}>Export</div>
        </div>
      </div>
      {/* Late Punch Chart */}
      {punchType === "Late Punches" && selectedEmployeeId && (
        <div style={styles.chartContainer}>
          {chartLoading ? (
            <div style={styles.noRecords}>Loading chart data...</div>
          ) : latePunchData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={latePunchData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    label={{
                      value: "Late Minutes",
                      angle: -90,
                      position: "left",
                      offset: 10,
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="lateMinutes"
                    stroke="red"
                    name="Late Minutes"
                  />
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
                  const remainingMinutes = Math.round(
                    (totalLateHours - wholeHours) * 60
                  );
                  return `${wholeHours} hr ${remainingMinutes} min`;
                })()}
              </div>
            </>
          ) : (
            <div style={styles.noRecords}>
              No late punches found for the selected employee.
            </div>
          )}
        </div>
      )}

      {/* Table for non-late punches */}
      {punchType !== "Late Punches" && (
        <>
          {loading ? (
            <div style={styles.noRecords}>Loading...</div>
          ) : error ? (
            <div style={styles.noRecords}>{error}</div>
          ) : (
            <div className="max-h-[100vh] overflow-y-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="sticky top-0 bg-gray-200 z-20">
                  {showExtraColumns ? (
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        S.No
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Employee Name
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Place
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Date
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Punch Time In
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Punch Time Out
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Total Hours
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Break Hours
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Total Working Hours
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Late In
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Early Out
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Device
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        S.No
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Employee Name
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Date
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Punch Time In
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">
                        Punch Time Out
                      </th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {groupedDataArray.length > 0 ? (
                    groupedDataArray.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50">
                        <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                          {index + 1}
                        </td>
                        <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                          {item.employeeName}
                        </td>

                        {showExtraColumns ? (
                          <>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.place}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.date}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm whitespace-nowrap">
                              {item.punchIn
                                .slice()
                                .reverse()
                                .map((time) =>
                                  new Date(time).toLocaleTimeString()
                                )
                                .join(", ")}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm whitespace-nowrap">
                              {item.punchOut
                                .map((time) =>
                                  new Date(time).toLocaleTimeString()
                                )
                                .join(", ")}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.totalHours}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.breakHours}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.netWorkingHours}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.lateIn}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.earlyOut}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.device}
                            </td>
                          </>
                        ) : (
                          <>
                            {/* For compact view, show only limited columns */}
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm">
                              {item.date}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm whitespace-nowrap">
                              {item.punchIn[1]
                                ? new Date(item.punchIn[1]).toLocaleTimeString()
                                : item.punchIn[0]
                                ? new Date(item.punchIn[0]).toLocaleTimeString()
                                : "--"}
                            </td>
                            <td className="border text-left border-gray-300 px-3 py-2 text-sm whitespace-nowrap">
                              {item.punchOut[0]
                                ? new Date(
                                    item.punchOut[0]
                                  ).toLocaleTimeString()
                                : "--"}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={showExtraColumns ? 12 : 5}
                        className="border border-gray-300 px-3 py-4 text-center text-gray-500 text-sm"
                      >
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
      <style jsx>{`
        .exportbtn {
          display: inline-block;
          padding: 4px 16px;
          background: #4caf50;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          text-align: center;
          margin-top: 25px;
        }
        .container {
          padding: 16px 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px; /* was 13px */
          color: #333;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
          background: #f9fafb;
          padding: 18px 20px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.05);
          justify-content: Left;
        }
        .filter-item {
          display: flex;
          flex-direction: column;
          min-width: 180px;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #4b5563;
        }
        input[type="date"],
        select {
          padding: 6px 10px;
          font-size: 14px; /* was 13px */
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #fff;
          transition: border-color 0.2s ease-in-out;
        }
        input[type="date"]:focus,
        select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 3px #93c5fd;
        }
      `}</style>
    </div>
  );
};

export default PunchLogTable;
