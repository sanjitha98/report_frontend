import React, { useState } from "react";

const RulesMasterForm = () => {
  const [formData, setFormData] = useState({
    morningPunchTime: "",
    totalWorkingHours: "",
    monthlyPermissionHours: "",
    monthlyPermissionCount: "",
    monthlyGraceMinutes: "",
    graceLeaveType: "",
    breakMinutesPerDay: "",
    halfDayThreshold: "",
    eveningPunchTime: "",
    considerFirstLastPunch: false,
    absentIfLateForDays: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Rule Data:", formData);
    // Call your API here
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">Rules Master Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Morning Punch (on or before)</label>
          <input type="time" name="morningPunchTime" value={formData.morningPunchTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Evening Punch (on or after)</label>
          <input type="time" name="eveningPunchTime" value={formData.eveningPunchTime} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Total Working Hours (per day)</label>
          <input type="number" name="totalWorkingHours" value={formData.totalWorkingHours} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Monthly Permission Hours</label>
          <input type="number" name="monthlyPermissionHours" value={formData.monthlyPermissionHours} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Permission Times (per month)</label>
          <input type="number" name="monthlyPermissionCount" value={formData.monthlyPermissionCount} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Grace Time for Late Coming (mins/month)</label>
          <input type="number" name="monthlyGraceMinutes" value={formData.monthlyGraceMinutes} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Exceeded Grace Considered as</label>
          <select name="graceLeaveType" value={formData.graceLeaveType} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select Leave Type</option>
            <option value="Half Day">Half Day</option>
            <option value="Full Day">Full Day</option>
            <option value="LOP">Loss of Pay</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Break Hours (mins/day)</label>
          <input type="number" name="breakMinutesPerDay" value={formData.breakMinutesPerDay} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Half Day if Worked Less Than (hrs)</label>
          <input type="number" name="halfDayThreshold" value={formData.halfDayThreshold} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="flex items-center">
            <input type="checkbox" name="considerFirstLastPunch" checked={formData.considerFirstLastPunch} onChange={handleChange} className="mr-2" />
            Consider 1st and Last Punch for Attendance Calculation
          </label>
        </div>

        <div>
          <label className="block mb-1 font-medium">Absent If Late For (days)</label>
          <input type="number" name="absentIfLateForDays" value={formData.absentIfLateForDays} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center gap-4">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl">Save</button>
          <button type="reset" className="bg-gray-400 text-white px-6 py-2 rounded-xl">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default RulesMasterForm;