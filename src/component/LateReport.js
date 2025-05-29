// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import moment from "moment";

// const LatePunchReport = () => {
//   const [data, setData] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filters, setFilters] = useState({
//     fromDate: moment().format("YYYY-MM-DD"),
//     toDate: moment().format("YYYY-MM-DD"),
//     employeeId: "",
//   });
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 0,
//   });

//   const formatLateBy = (lateBy) => {
//     if (!lateBy) return "";

//     const [hoursStr, minutesStr, secondsStr] = lateBy.split(":");
//     const hours = parseInt(hoursStr, 10);
//     const minutes = parseInt(minutesStr, 10);
//     const seconds = parseInt(secondsStr, 10);

//     let result = "";
//     if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
//     if (minutes > 0) result += `${minutes} min `;
//     if (seconds > 0) result += `${seconds} sec`;

//     return result.trim() || "0 sec";
//   };

//   const formatPunchTime = (timeStr) => {
//     if (!timeStr) return "";

//     const [hourStr, minuteStr] = timeStr.split(":");
//     let hour = parseInt(hourStr, 10);
//     const minute = minuteStr;
//     const ampm = hour >= 12 ? "PM" : "AM";

//     hour = hour % 12;
//     hour = hour === 0 ? 12 : hour; // convert 0 to 12 for 12 AM/PM

//     return `${hour}:${minute} ${ampm}`;
//   };

//   const [showGraph, setShowGraph] = useState(false);
//   const formatDate = (dateString) => {
//     const d = new Date(dateString);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   useEffect(() => {
//     fetchEmployees();
//     fetchData();
//   }, []);

//   const fetchEmployees = async () => {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_URL}/employee_list`
//     );
//     setEmployees(res.data.data);
//   };

//   const fetchData = async () => {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_URL}/get_late_punch`,
//       {
//         fromDate: filters.fromDate,
//         toDate: filters.toDate,
//         employeeId: filters.employeeId,
//         page: pagination.page,
//         limit: pagination.limit,
//       }
//     );
//     setData(res.data.data);
//     if (res.data.pagination) {
//       setPagination(res.data.pagination);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page]);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleSearch = () => {
//      setPagination((prev) => ({ ...prev, page: 1 }));
//     fetchData();
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Late Punch Report");
//     XLSX.writeFile(wb, "LatePunchReport.xlsx");
//   };

//   const aggregatedData = data.reduce((acc, curr) => {
//     const emp = acc.find((e) => e.name === curr.name);
//     if (emp) emp.count += 1;
//     else acc.push({ name: curr.name, count: 1 });
//     return acc;
//   }, []);

//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md font-sans text-sm">
//       <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Late Report</h1>
//       <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300 flex flex-wrap gap-4 items-end">
//         <div className="flex flex-col">
//           <label className="font-semibold text-gray-700 mb-1">From Date</label>
//           <input
//             type="date"
//             name="fromDate"
//             value={filters.fromDate}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="font-semibold text-gray-700 mb-1">To Date</label>
//           <input
//             type="date"
//             name="toDate"
//             value={filters.toDate}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="font-semibold text-gray-700 mb-1">Employee</label>
//           <select
//             name="employeeId"
//             value={filters.employeeId}
//             onChange={handleFilterChange}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           >
//             <option value="">All</option>
//             {employees.map((emp) => (
//               <option key={emp.employeeId} value={emp.employeeId}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleSearch}
//             className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Search
//           </button>
//           <button
//             onClick={exportToExcel}
//             className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
//           >
//             Export
//           </button>
//           <button
//             onClick={() => setShowGraph(!showGraph)}
//             className="bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-700 transition"
//           >
//             {showGraph ? "Show Table" : "Show Graph"}
//           </button>
//         </div>
//       </div>

//       {!showGraph ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border border-gray-300 text-gray-700 text-sm">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="px-3 py-2 border">Sr. No</th>
//                 <th className="px-3 py-2 border">Employee ID</th>
//                 <th className="px-3 py-2 border">Name</th>
//                 <th className="px-3 py-2 border">Date</th>
//                 <th className="px-3 py-2 border">Punch Time</th>
//                 {/* Reference Time column removed */}
//                 <th className="px-3 py-2 border">Late By</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="text-center py-4 italic text-gray-500"
//                   >
//                     No data found
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row, index) => (
//                   <tr key={index} className="hover:bg-gray-100">
//                     <td className="px-3 py-2 border text-center">
//                       {index + 1}
//                     </td>
//                     <td className="px-3 py-2 border">{row.employeeId}</td>
//                     <td className="px-3 py-2 border">{row.name}</td>
//                     <td className="px-3 py-2 border">
//                       {formatDate(row.punchDate)}
//                     </td>

//                     <td className="px-3 py-2 border">
//                       {formatPunchTime(row.punchTime)}
//                     </td>

//                     {/* Reference Time cell removed */}
//                     <td className="px-3 py-2 border">
//                       {formatLateBy(row.lateBy)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//            <div className="mt-4 flex justify-between items-center">
//     <span className="text-sm text-gray-600">
//       Page {pagination.page} of {pagination.totalPages}
//     </span>
//     <div className="flex gap-2">
//       <button
//         onClick={() => handlePageChange(pagination.page - 1)}
//         disabled={pagination.page === 1}
//         className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
//       >
//         Prev
//       </button>
//       <button
//         onClick={() => handlePageChange(pagination.page + 1)}
//         disabled={pagination.page === pagination.totalPages}
//         className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
//       >
//         Next
//       </button>
//     </div>
//   </div>
//         </div>
//       ) : (
//         <div className="mt-6">
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={aggregatedData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Bar dataKey="count" fill="#4F46E5" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LatePunchReport;


import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import moment from "moment";

const LatePunchReport = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    employeeId: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showGraph, setShowGraph] = useState(false);
  const [summaryMap, setSummaryMap] = useState({});
  // Convert total minutes to total seconds as integer
  const formatSeconds = (totalMinutes) => {
    return Math.round(totalMinutes * 60);
  };

  // Helper: Convert HH:mm:ss to total minutes (number)
  const lateByToMinutes = (lateBy) => {
    if (!lateBy) return 0;
    const [h, m, s] = lateBy.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  const formatMinutes = (totalMinutes) => {
    if (!totalMinutes) return "0 min";
    const hrs = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
    const secs = Math.round((totalMinutes % 1) * 60);
    if (hrs === 0 && mins === 0 && secs > 0) {
      return `${secs} sec`;
    }
    return `${hrs > 0 ? hrs + " hr " : ""}${mins} min${
      secs > 0 && hrs === 0 ? ` ${secs} sec` : ""
    }`;
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee_list`
      );
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_late_punch`,
        {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          employeeId: filters.employeeId,
          page: pagination.page,
          limit: pagination.limit,
        }
      );

      const fetchedData = res.data.data || [];
      setData(fetchedData);

      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }

      const summaryRows = res.data.summary || [];
      const summaryObj = {};
      summaryRows.forEach((r) => {
        summaryObj[r.employeeId] = {
          count: r.noOfDaysLate,
          totalLateBy: r.totalLateBy,
        };
      });
      setSummaryMap(summaryObj);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  const exportToExcel = () => {
    const excelData = data.map((row) => {
      const empSummary = summaryMap[row.employeeId] || {};
      return {
        "Employee ID": row.employeeId,
        Name: row.name,
        Date: formatDate(row.punchDate),
        "Punch Time": row.punchTime,
        "Late By": row.lateBy,
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Late Punch Report");
    XLSX.writeFile(wb, "LatePunchReport.xlsx");
  };

  // Selected employee summary
  const selectedEmpSummary = filters.employeeId
    ? summaryMap[filters.employeeId]
    : null;
  const selectedEmpName =
    employees.find((e) => e.employeeId === filters.employeeId)?.name || "";

  // Prepare data for LineChart: aggregate total late minutes per date
  const chartData = [];

  if (filters.employeeId) {
    // Only prepare chart data if a specific employee is selected
    const dateMap = {};
    data.forEach((item) => {
      const dateKey = moment(item.punchDate).format("DD/MM/YYYY");
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = 0;
      }
      dateMap[dateKey] += lateByToMinutes(item.lateBy);
    });

    Object.entries(dateMap)
      .sort(
        ([dateA], [dateB]) =>
          moment(dateA, "DD/MM/YYYY") - moment(dateB, "DD/MM/YYYY")
      )
      .forEach(([date, totalMinutes]) => {
        chartData.push({
          date,
          lateMinutes: +totalMinutes.toFixed(2),
        });
      });
  }
  // If filters.employeeId is empty (All selected), chartData stays empty → graph shows nothing

  // Calculate total days late and total late minutes for summary below graph
  const totalDaysLate = Object.keys(
    data.reduce((acc, item) => {
      const dateKey = moment(item.punchDate).format("DD/MM/YYYY");
      acc[dateKey] = true;
      return acc;
    }, {})
  ).length;

  const totalLateMinutes = data.reduce((sum, item) => {
    return sum + lateByToMinutes(item.lateBy);
  }, 0);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md font-sans text-sm">
      <h1 className="font-bold text-center text-black mb-4 text-xl">
        Late Report
      </h1>

      <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Employee</label>
          <select
            name="employeeId"
            value={filters.employeeId}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded"
          >
            Export
          </button>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded"
          >
            {showGraph ? "Show Table" : "Show Graph"}
          </button>
        </div>
      </div>

      {!showGraph ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 border">Sr. No</th>
                  <th className="px-3 py-2 border">Employee ID</th>
                  <th className="px-3 py-2 border">Name</th>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Punch Time</th>
                  <th className="px-3 py-2 border">Late By</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 font-semibold text-gray-600"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr
                      key={`${row.employeeId}-${row.punchDate}-${idx}`}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border px-3 py-1 text-center">
                        {(pagination.page - 1) * pagination.limit + idx + 1}
                      </td>
                      <td className="border px-3 py-1 text-center">
                        {row.employeeId}
                      </td>
                      <td className="border px-3 py-1">{row.name}</td>
                      <td className="border px-3 py-1 text-center">
                        {formatDate(row.punchDate)}
                      </td>
                      <td className="border px-3 py-1 text-center">
                        {moment(row.punchTime, "HH:mm:ss").format("hh:mm A")}
                      </td>

                      <td className="border px-3 py-1 text-center">
                        {formatMinutes(lateByToMinutes(row.lateBy))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          {filters.employeeId ? (
            <>
              <div className="mb-2 font-semibold">
                Graph for {selectedEmpName} ({filters.employeeId})
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    label={{
                      value: "Late Time",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                    }}
                    allowDecimals={false}
                    tickFormatter={formatMinutes}
                  />
                  <Tooltip formatter={(value) => formatMinutes(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="lateMinutes"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-2">
                Total Days Late:{" "}
                <span className="font-semibold">{totalDaysLate}</span> | Total
                Late Time:{" "}
                <span className="font-semibold">
                  {formatMinutes(totalLateMinutes)}
                </span>{" "}
                (
                <span className="font-mono">
                  {formatSeconds(totalLateMinutes)} seconds
                </span>
                )
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 font-semibold py-10">
              Please select an employee to view the graph.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LatePunchReport;
