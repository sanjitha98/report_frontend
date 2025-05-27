import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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

  const formatLateBy = (lateBy) => {
    if (!lateBy) return "";

    const [hoursStr, minutesStr, secondsStr] = lateBy.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    let result = "";
    if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
    if (minutes > 0) result += `${minutes} min `;
    if (seconds > 0) result += `${seconds} sec`;

    return result.trim() || "0 sec";
  };

  const formatPunchTime = (timeStr) => {
    if (!timeStr) return "";

    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // convert 0 to 12 for 12 AM/PM

    return `${hour}:${minute} ${ampm}`;
  };

  const [showGraph, setShowGraph] = useState(false);
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchEmployees();
    fetchData();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/employee_list`
    );
    setEmployees(res.data.data);
  };

  const fetchData = async () => {
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
    setData(res.data.data);
    if (res.data.pagination) {
      setPagination(res.data.pagination);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
     setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Late Punch Report");
    XLSX.writeFile(wb, "LatePunchReport.xlsx");
  };

  const aggregatedData = data.reduce((acc, curr) => {
    const emp = acc.find((e) => e.name === curr.name);
    if (emp) emp.count += 1;
    else acc.push({ name: curr.name, count: 1 });
    return acc;
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md font-sans text-sm">
      <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Late Report</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Employee</label>
          <select
            name="employeeId"
            value={filters.employeeId}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Export
          </button>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            {showGraph ? "Show Table" : "Show Graph"}
          </button>
        </div>
      </div>

      {!showGraph ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-2 border">Sr. No</th>
                <th className="px-3 py-2 border">Employee ID</th>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Date</th>
                <th className="px-3 py-2 border">Punch Time</th>
                {/* Reference Time column removed */}
                <th className="px-3 py-2 border">Late By</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 italic text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-3 py-2 border text-center">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 border">{row.employeeId}</td>
                    <td className="px-3 py-2 border">{row.name}</td>
                    <td className="px-3 py-2 border">
                      {formatDate(row.punchDate)}
                    </td>

                    <td className="px-3 py-2 border">
                      {formatPunchTime(row.punchTime)}
                    </td>

                    {/* Reference Time cell removed */}
                    <td className="px-3 py-2 border">
                      {formatLateBy(row.lateBy)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
           <div className="mt-4 flex justify-between items-center">
    <span className="text-sm text-gray-600">
      Page {pagination.page} of {pagination.totalPages}
    </span>
    <div className="flex gap-2">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
      >
        Prev
      </button>
      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  </div>
        </div>
      ) : (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LatePunchReport;
