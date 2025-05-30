

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApplyLeave.css";
import { useNavigate } from "react-router-dom";

const ApplyLeave = () => {
  const initialFormState = {
    leaveTypes: "",
    leaveTimes: "",
    startDate: "",
    endDate: "",
    reason: "",
    Employee_id: localStorage.getItem("employeeId"),
    userName: localStorage.getItem("employeeName"),
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Track success or error
  const [casualLeaveUsed, setCasualLeaveUsed] = useState(false); // Track if casual leave has been used
  const [saturdayOffUsed, setSaturdayOffUsed] = useState(false); // Track if Saturday Off has been used
  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });
  const leaveTypeOptions = [
    "Casual Leave",
    "Work From Home",
    "Maternity Leave",
    "Permission",
    "Saturday Off",
    "Loss of Pay Leave",
  ];

  const fullDayOptions = ["Full day", "Half day"];
  const permissionOptions = ["1 hour", "2 hours"];

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    const userName = localStorage.getItem("userName");

    if (employeeId && userName) {
      setFormData((prevData) => ({
        ...prevData,
        Employee_id: employeeId,
        userName: userName,
      }));
    }
  }, []);

  const isSaturday = (date) => {
    const selectedDate = new Date(date);
    return selectedDate.getDay() === 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date().toISOString().split("T")[0];
    const oneDayLeaves = ["Saturday Off", "Casual Leave", "Permission"];

    let updatedForm = { ...formData, [name]: value };
    let updatedErrors = { ...errors };

    // Check if selected start date is Saturday
    if (name === "startDate") {
      const selectedDay = new Date(value).getDay(); // 6 = Saturday
      if (selectedDay === 6) {
        updatedForm.leaveTypes = "Saturday Off";
        updatedForm.endDate = value; // one-day leave
      }
    }

    // Past date check
    if ((name === "startDate" || name === "endDate") && value < today) {
      updatedErrors[name] = " You cannot select a past date.";
    } else {
      updatedErrors[name] = "";
    }

    // End date before start date
    if (
      name === "endDate" &&
      updatedForm.startDate &&
      value < updatedForm.startDate
    ) {
      updatedErrors.endDate = " End Date cannot be before Start Date.";
    }

    // Auto-update end date for one-day leaves
    if (
      (name === "leaveTypes" && oneDayLeaves.includes(value)) ||
      (name === "startDate" && oneDayLeaves.includes(formData.leaveTypes))
    ) {
      updatedForm.endDate = updatedForm.startDate || value;
      updatedErrors.endDate = ""; // Clear error
    }

    setErrors(updatedErrors);
    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/applyLeave`,
        formData
      );

      const { status, message } = response.data;

      if (status === "Success") {
        setMessage(message);
        setMessageType("success");

        // Send notification (optional but included)
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/notifications`, {
            message: `Leave applied by ${formData.userName} (ID: ${formData.Employee_id}) for ${formData.leaveTypes} from ${formData.startDate} to ${formData.endDate}. Reason: ${formData.reason}`,
            read: false,
          });
        } catch (notificationError) {
          console.warn(
            "Notification failed but leave applied:",
            notificationError
          );
        }

        // Redirect after short delay (optional for UX)
        setTimeout(() => {
          navigate("/dashboard/applyLeave");
        }, 1000);
      } else if (status === "Error") {
        setMessage(message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Leave application failed due to server error."
      );
      setMessageType("error");
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setMessage("");
    setMessageType("");
    navigate("/dashboard/applyLeave");
  };

  return (
    <div className="apply-leave-container">
      <div className="apply-leave-card">
        <h2 className="text-4xl font-bold text-center text-black mb-16">Apply for Leave</h2>

        {message && (
          <div
            className={`apply-leave-alert ${
              messageType === "success"
                ? "apply-leave-alert-success"
                : "apply-leave-alert-error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="apply-leave-form">
          <div className="row">
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.startDate && (
                <div
                  className="error-text"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errors.startDate}
                </div>
              )}
            </div>
            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">End Date</label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="apply-leave-input"
                required
                min={new Date().toISOString().split("T")[0]}
                disabled={
                  formData.leaveTypes === "Saturday Off" ||
                  formData.leaveTypes === "Casual Leave" ||
                  formData.leaveTypes === "Permission"
                }
              />
              {errors.endDate && (
                <div
                  className="error-text"
                  style={{ color: "red", fontSize: "13px" }}
                >
                  {errors.endDate}
                </div>
              )}
            </div>  <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Leave Types</label>
              <select
                name="leaveTypes"
                value={formData.leaveTypes}
                onChange={handleChange}
                className="apply-leave-select"
                required
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                {leaveTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                {formData.startDate &&
                  isSaturday(formData.startDate) &&
                  !saturdayOffUsed && (
                    <option value="Saturday Off">Saturday Off</option>
                  )}
              </select>
            </div>

            <div className="col-md-6 apply-leave-form-group">
              <label className="apply-leave-label">Leave Time</label>
              {formData.leaveTypes === "Permission" ? (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Permission Time
                  </option>
                  {permissionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="leaveTimes"
                  value={formData.leaveTimes}
                  onChange={handleChange}
                  className="apply-leave-select"
                  required
                >
                  <option value="" disabled>
                    Select Leave Time
                  </option>
                  {fullDayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {formData.leaveTypes !== "Saturday Off" && (
            <div className="apply-leave-form-group mt-10">
              <textarea
                name="reason"
                placeholder="Reason for Leave"
                value={formData.reason}
                onChange={handleChange}
                className="apply-leave-input"
                rows={5}
                required
              />
            </div>
          )}
          <div className="apply-leave-buttons">
            <button type="submit" className="apply-leave-btn">
              Apply Leave
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="apply-leave-btn apply-leave-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;

