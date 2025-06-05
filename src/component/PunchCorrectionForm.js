import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PunchCorrectionForm.css";

const PunchCorrectionForm = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const today = new Date().toISOString().split("T")[0]; // format: "YYYY-MM-DD"

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const payload = {
    from_date: fromDate,
    to_date: toDate,
  };

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/dailypunch`,
          payload
        );
        const updated = response.data.map((item) => ({
          ...item,
          manual: false, // Initially system-generated
        }));
        setData(updated);
        setFilteredData(updated);
        setError(null);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (fromDate && toDate) fetchFilteredData();
  }, [fromDate, toDate]);

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
    let filtered = [...data];

    if (selectedEmployeeId) {
      filtered = filtered.filter(
        (item) => item.employeeId === selectedEmployeeId
      );
    }

    setFilteredData(filtered);
  }, [selectedEmployeeId, data]);

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.logTime) - new Date(a.logTime)
  );

  const groupedData = [];

  sortedData.forEach((item) => {
    const key = `${item.employeeId}-${new Date(item.logTime).toLocaleDateString(
      "en-GB"
    )}`;
    const existingGroup = groupedData.find((group) => group.key === key);

    if (!existingGroup) {
      groupedData.push({
        key,
        employeeId: item.employeeId,
        employeeName:
          employeeList.find((emp) => emp.employeeId === item.employeeId)
            ?.employeeName || item.employeeId,
        date: new Date(item.logTime).toLocaleDateString("en-GB"),
        punches: [],
      });
    }

    // groupedData
    //   .find((group) => group.key === key)
    //   .punches.push({ ...item, time: formatAMPM(new Date(item.logTime)) });
    const targetGroup = groupedData.find((group) => group.key === key);
    targetGroup.punches.push({
      ...item,
      time: formatAMPM(new Date(item.logTime)),
      originalDate: new Date(item.logTime),
    });
    targetGroup.punches.sort((a, b) => a.originalDate - b.originalDate); // ascending
  });

  const handlePunchChange = (groupIndex, punchIndex, newTime) => {
    const updatedGroups = [...groupedData];
    updatedGroups[groupIndex].punches[punchIndex].time = newTime;
    updatedGroups[groupIndex].punches[punchIndex].manual = true;
    setFilteredData(
      updatedGroups.flatMap((group) => group.punches.map((p) => ({ ...p })))
    );
  };

  function formatAMPM(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    return `${h}:${m} ${ampm}`;
  }

  return (
    <div className="form-container">
      <h2>Punch Correction Form</h2>

      {/* Filters */}
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
      </div>

      {/* Punch Table */}
      {groupedData.map((group, groupIndex) => (
        <div key={group.key} className="punch-table-wrapper">
          <h4>
            {group.employeeName} - {group.date}
          </h4>
          <table className="punch-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Punch Type</th>
                <th>Punch Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {group.punches.map((punch, punchIndex) => (
                <tr key={punchIndex}>
                  <td>{punchIndex + 1}</td>
                  <td>{punch.logType}</td>
                  <td>
                    <input
                      type="text"
                      value={punch.time || ""}
                      placeholder="HH:MM AM/PM"
                      onChange={(e) =>
                        handlePunchChange(
                          groupIndex,
                          punchIndex,
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    {punch.time === "" ? (
                      <span className="missing">Missing</span>
                    ) : punch.manual ? (
                      <span className="manual">Manual</span>
                    ) : (
                      <span>System</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PunchCorrectionForm;
