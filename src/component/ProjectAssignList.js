import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

const ProjectAssignList = () => {
  const navigate = useNavigate();
  const { isAuth, userData } = useSelector((state) => state.login);
  const employeeId = userData ? userData.employeeId : null;
  const userType = userData ? userData.userType : null;
  const designation = userData ? userData.designation : null;
  const isAdmin = userType === "Admin" || designation === "Sr. Technical Head";

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [isAllowedTime, setIsAllowedTime] = useState(false);
  const [allAssignments, setAllAssignments] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAssignments();
    if (!isAdmin) {
      checkPunchTimeWindow();
      const timer = setInterval(checkPunchTimeWindow, 60 * 1000); // Check every 1 minute
      return () => clearInterval(timer);
    }
  }, []);

  const checkPunchTimeWindow = async () => {
    const todayDate = moment().format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/dailypunch`,
        { date: todayDate }
      );
      const punchData = response.data;

      const userPunch = punchData.find(
        (entry) => entry.employeeId === employeeId && entry.logType === "In"
      );
      console.log("userPunch", userPunch);

      if (userPunch && userPunch.refTime) {
        const punchTime = moment(userPunch.refTime, "HH:mm:ss");

        const punchMinutes = punchTime.hours() * 60 + punchTime.minutes();

        const now = moment();
        const nowMinutes = now.hours() * 60 + now.minutes();

        const cutoffMinutes = 9 * 60 + 30; // 9:30 AM

        if (punchMinutes <= cutoffMinutes) {
          // Punched before or at 9:30 AM → allow until 9:45 AM
          setIsAllowedTime(nowMinutes <= 9 * 60 + 45);
        } else {
          // Punched after 9:30 AM → allow for 15 minutes from punch time
          const validFrom = punchMinutes;
          const validTo = punchMinutes + 15;
          setIsAllowedTime(nowMinutes >= validFrom && nowMinutes <= validTo);
        }
      } else {
        setIsAllowedTime(false); // Not punched in
      }
    } catch (err) {
      console.error("Failed to fetch punch data", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee_list`
      );

      let employeeData = res.data.data || [];

      // Read logged-in user info from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem("user")); // e.g., { employeeId: "kst77", isAdmin: false }

      if (loggedInUser && !loggedInUser.isAdmin) {
        employeeData = employeeData.filter(
          (emp) => emp.employeeId === loggedInUser.employeeId
        );
      }

      setEmployees(employeeData);
    } catch (err) {
      console.error("Failed to fetch employee list", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        employee_id: isAdmin ? selectedEmployee : employeeId,
        from_date: fromDate || today,
        to_date: toDate || today,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_assigned_project`,
        payload
      );
      const data = res.data.data || [];
      setAllAssignments(data);
      setAssignments(filterByUserType(data, selectedUserType));
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  const filterByUserType = (data, type) => {
    if (!type) return data;
    return data.filter((item) => item.created_by === type);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/delete_project_assign?id=${id}`
      );
      setSuccessMessage("Assignment deleted successfully.");
      fetchAssignments();
    } catch (err) {
      console.error("Failed to delete assignment", err);
    }
  };

  const handleEdit = (id, created_by) => {
    if (isAdmin) {
      navigate(`/dashboard/project-assign`, { state: { id, created_by } });
    } else {
      navigate(`/dashboard/employeeTask`, { state: { id, created_by } });
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };
  const styles = {
    exportbtn: {
      display: "inline-block",
      padding: "4px 16px",
      background: "#4caf50",
      color: "#fff",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "18px",
      textAlign: "center",
      marginTop: "25px",
    },
    container: {
      padding: "16px 20px",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSize: "14px",
      color: "#333",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
    },
    filters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "20px",
      background: "#f9fafb",
      padding: "18px 20px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.05)",
      justifyContent: "left",
    },
    
    filterItem: {
      display: "flex",
      flexDirection: "column",
      minWidth: "180px",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#4b5563",
    },
    input: {
      padding: "6px 10px",
      fontSize: "14px",
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      background: "#fff",
      transition: "border-color 0.2s ease-in-out",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#2563eb",
      boxShadow: "0 0 3px #93c5fd",
    },
    select: {
      padding: "6px 10px",
      fontSize: "14px",
      border: "1px solid #cbd5e1",
      borderRadius: "6px",
      background: "#fff",
      transition: "border-color 0.2s ease-in-out",
    },
    selectFocus: {
      outline: "none",
      borderColor: "#2563eb",
      boxShadow: "0 0 3px #93c5fd",
    },
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-baseline mb-6">
        <div></div>
        <div>
          <h1 className="font-bold text-center text-black mb-6">
            {isAdmin ? "Project Assignment List" : "Daily Task List"}
          </h1>
        </div>
        <div>
          <button
            onClick={() =>
              isAdmin
                ? navigate("/dashboard/project-assign")
                : navigate("/dashboard/project-assign")
            }
            disabled={!isAllowedTime && !isAdmin}
            className={`px-6 py-3 rounded-xl transition-all ${
              isAdmin
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : isAllowedTime
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {isAdmin ? "Assign Project" : "Assign Task"}
          </button>
        </div>
      </div>

      {!isAdmin && !isAllowedTime && (
        <p className="text-red-600 text-sm text-right">
          Task assignment allowed only within 15 minutes of punch-in after 9:30
          AM
        </p>
      )}

      {successMessage && (
        <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
          {successMessage}
        </div>
      )}

      {/* Filter Section */}
      <div style={styles.filters}>
        {isAdmin && (
          <div style={styles.filterItem}>
            <label style={styles.label}>Employee</label>
            <select
              style={styles.input}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.filterItem}>
          <label style={styles.label}>From</label>
          <input
            style={styles.input}
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>To</label>
          <input
            style={styles.input}
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>User Type</label>
          <select
            style={styles.input}
            value={selectedUserType}
            onChange={(e) => {
              const type = e.target.value;
              setSelectedUserType(type);
              setAssignments(filterByUserType(allAssignments, type));
            }}
          >
            <option value="">Select User Type</option>
            <option value="Admin">Admin</option>
            <option value="Sr Technicals Lead">Sr Technical head</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={fetchAssignments}
            className="bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {assignments.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-300 table-auto shadow-lg rounded-xl text-sm">
            <thead className="bg-gray-100 text-black-900 font-semibold">
              <tr>
                <th className="p-3 border border-gray-300">S.No</th>
                {isAdmin && (
                  <th className="p-3 border border-gray-300">Employee</th>
                )}
                <th className="p-3 border border-gray-300">Project</th>
                <th className="p-3 border border-gray-300">Sub Product</th>
                <th className="p-3 border border-gray-300">Assigned Date</th>
                <th className="p-3 border border-gray-300">Deadline</th>
                <th className="p-3 border border-gray-300">Estimated Time</th>
                <th className="p-3 border border-gray-300">Task</th>
                <th className="p-3 border border-gray-300">Description</th>
                <th className="p-3 border border-gray-300">Task Created By</th>
                <th className="p-3 border border-gray-300">Admin Review</th>
                <th className="p-3 border border-gray-300">TL Review</th>
                <th className="p-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assign, index) => (
                <tr key={assign.id} className="text-center hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{index + 1}</td>
                  {isAdmin && (
                    <td className="p-3 border border-gray-300">
                      {assign.employee_name}
                    </td>
                  )}
                  <td className="p-3 border border-gray-300">
                    {assign.project_name}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.sub_products}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {formatDateTime(assign.assigned_date)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {formatDateTime(assign.deadline_date)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.estimated_time}
                  </td>
                  {/* Updated styles for Task and Description columns */}
                  <td
                    className="p-3 border border-gray-300 text-center"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {assign.task_details
                      ? assign.task_details
                      : "No Task Details"}
                  </td>
                  <td
                    className="p-3 border border-gray-300 text-center"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {assign.task_description
                      ? assign.task_description
                      : "No Description Available"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.created_by}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.admin_review}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {assign.team_leader_review}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex justify-center gap-3">
                      {assign.created_by === userType ? (
                        <button
                          onClick={() =>
                            handleEdit(assign.id, assign.created_by)
                          }
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(assign.id, assign.created_by)
                          }
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          View
                        </button>
                      )}

                      {assign.created_by === userType && (
                        <button
                          onClick={() => handleDelete(assign.id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-black mt-10">
          No assignments found.
        </div>
      )}
    </div>
  );
};

export default ProjectAssignList;
