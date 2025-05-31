// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './RulesForm.css';

// const RulesForm = () => {
//   const [formData, setFormData] = useState({
//     morning_punch: '',
//     working_hours: '',
//     permission_hours: '',
//     permission_count: '',
//     grace_time: '',
//     late_penalty: '',
//     break_hours: '',
//     half_day_limit: '',
//     evening_punch: '',
//     task_submission: '',
//     casual_leave: '',
//     saturday_off: '',
//     sandwich_policy: '',
//   });

//   useEffect(() => {
//     const fetchRules = async () => {
//       try {
//         const res = await axios.post(`${process.env.REACT_APP_API_URL}/get_rules_form`);
//         if (res.data) {
//           setFormData(res.data);
//         }
//       } catch (error) {
//         console.error('Error fetching rules:', error);
//       }
//     };

//     fetchRules();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/post_rules_form`, formData);
//       alert('Rules submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting rules:', error);
//     }
//   };

//   return (
//     <form className="rules-form" onSubmit={handleSubmit}>
//       <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Rules Form</h1>

//       <label>1. Morning punch should be on or before:</label>
//       <input type="time" name="morning_punch" value={formData.morning_punch} onChange={handleChange} required />

//       <label>2. Total working hours per day:</label>
//       <input type="number" name="working_hours" value={formData.working_hours} onChange={handleChange} required />

//       <label>3. Total hours of permission per month:</label>
//       <input type="number" name="permission_hours" value={formData.permission_hours} onChange={handleChange} required />

//       <label>4. Number of permission per month:</label>
//       <input type="number" name="permission_count" value={formData.permission_count} onChange={handleChange} required />

//       <label>5. Grace time allowed for late coming per month (in minutes):</label>
//       <input type="number" name="grace_time" value={formData.grace_time} onChange={handleChange} required />

//       <label>6. Late coming beyond grace will be considered as:</label>
//       <input type="text" name="late_penalty" value={formData.late_penalty} onChange={handleChange} required />

//       <label>7. Total break hours allowed per day:</label>
//       <input type="number" name="break_hours" value={formData.break_hours} onChange={handleChange} required />

//       <label>8. Half-day leave is considered if worked for less than:</label>
//       <input type="number" name="half_day_limit" value={formData.half_day_limit} onChange={handleChange} required />

//       <label>9. Evening punch should be on or after:</label>
//       <input type="time" name="evening_punch" value={formData.evening_punch} onChange={handleChange} required />

//       <label>10. Daily tasks should be submitted within (minutes after punch-in):</label>
//       <input type="number" name="task_submission" value={formData.task_submission} onChange={handleChange} required />

//       <label>11. Casual leave per month:</label>
//       <input type="number" name="casual_leave" value={formData.casual_leave} onChange={handleChange} required />

//       <label>12. Saturday off per month:</label>
//       <input type="number" name="saturday_off" value={formData.saturday_off} onChange={handleChange} required />

//       <label>13. Sandwich Policy:</label>
//       <input type="text" name="sandwich_policy" value={formData.sandwich_policy} onChange={handleChange} required />

//       <button type="submit">Submit Rules</button>
//     </form>
//   );
// };

// export default RulesForm;


import React, { useState } from 'react';

const RulesForm = () => {
  const [formData, setFormData] = useState({
    morningPunchBefore: '',
    eveningPunchAfter: '',
    workingHoursPerDay: '',
    graceTimeLate: '',
    considerFirstLastPunch: false,
    calculateHalfDayMins: '',
    calculateAbsentMins: '',
    deductBreakFromWork: false,
    absentWhenLateForDays: '',
    weeklyOffHolidayAbsent: '',
    totalPermissionHoursPerMonth: '',
    noOfPermissionsPerMonth: '',
    breakHoursPerDay: '',
    casualOrPaidLeavePerMonth: '',
    saturdayOffPerMonth: '',
    dailyTaskSubmitMins: '',
    lateMoreThanDays: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add API logic here
  };

  const numericFields = [
    { label: 'Total Working Hours per Day', name: 'workingHoursPerDay', unit: 'hrs' },
    { label: 'Grace Time for Late', name: 'graceTimeLate', unit: 'mins' },
    { label: 'Calculate Half Day worked in less than', name: 'calculateHalfDayMins', unit: 'mins' },
    { label: 'Calculate Absent worked in less than', name: 'calculateAbsentMins', unit: 'mins' },
    { label: 'Absent when late for more than', name: 'absentWhenLateForDays', unit: 'days' },
    { label: 'Total Hours of Permission per Month', name: 'totalPermissionHoursPerMonth', unit: 'mins' },
    { label: 'No. of Permission per Month', name: 'noOfPermissionsPerMonth', unit: 'times' },
    { label: 'Total Break Hours Allowed per Day', name: 'breakHoursPerDay', unit: 'mins' },
    { label: 'Casual or Paid Leave per Month', name: 'casualOrPaidLeavePerMonth', unit: 'days' },
    { label: 'Saturday Offs per Month', name: 'saturdayOffPerMonth', unit: 'days' },
    { label: 'Daily Tasks should be submitted within', name: 'dailyTaskSubmitMins', unit: 'mins after punch-in' },
    { label: 'Late for more than', name: 'lateMoreThanDays', unit: 'days (consider as 1 leave)' },
  ];

  const checkboxFields = [
    { label: 'Consider 1st & Last Punch at Calculation', name: 'considerFirstLastPunch' },
    { label: 'Deduct Break Hours from Work Duration', name: 'deductBreakFromWork' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8"
      noValidate
    >
      <h2 className="text-4xl font-bold text-gray-800 border-b pb-3 mb-6">
        Rules Master
      </h2>

      {/* Punch Time Settings */}
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="morningPunchBefore" className="block text-gray-700 font-semibold mb-2">
            1. Morning Punch should be on or before
          </label>
          <input
            type="time"
            id="morningPunchBefore"
            name="morningPunchBefore"
            value={formData.morningPunchBefore}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="eveningPunchAfter" className="block text-gray-700 font-semibold mb-2">
            2. Evening Punch should be on or after
          </label>
          <input
            type="time"
            id="eveningPunchAfter"
            name="eveningPunchAfter"
            value={formData.eveningPunchAfter}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>

      {/* Numeric Inputs */}
      <section className="grid gap-6 md:grid-cols-2">
        {numericFields.map(({ label, name, unit }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
              {label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id={name}
                name={name}
                min="0"
                value={formData[name]}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter value"
              />
              <span className="text-gray-500 whitespace-nowrap">{unit}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Checkbox Options */}
      <section className="grid gap-4 md:grid-cols-2">
        {checkboxFields.map(({ label, name }) => (
          <label
            key={name}
            htmlFor={name}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={formData[name]}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">{label}</span>
          </label>
        ))}
      </section>

      {/* Dropdown Select */}
      <section>
        <label
          htmlFor="weeklyOffHolidayAbsent"
          className="block text-gray-700 font-semibold mb-2"
        >
          9. Mark Weekly Off & Holidays as Absent if:
        </label>
        <select
          id="weeklyOffHolidayAbsent"
          name="weeklyOffHolidayAbsent"
          value={formData.weeklyOffHolidayAbsent}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="prefix">Prefix Day Absent</option>
          <option value="suffix">Suffix Day Absent</option>
          <option value="both">Both Days Absent</option>
        </select>
      </section>

      {/* Buttons */}
      <section className="flex justify-end gap-4 border-t pt-5">
        <button
          type="reset"
          onClick={() =>
            setFormData({
              morningPunchBefore: '',
              eveningPunchAfter: '',
              workingHoursPerDay: '',
              graceTimeLate: '',
              considerFirstLastPunch: false,
              calculateHalfDayMins: '',
              calculateAbsentMins: '',
              deductBreakFromWork: false,
              absentWhenLateForDays: '',
              weeklyOffHolidayAbsent: '',
              totalPermissionHoursPerMonth: '',
              noOfPermissionsPerMonth: '',
              breakHoursPerDay: '',
              casualOrPaidLeavePerMonth: '',
              saturdayOffPerMonth: '',
              dailyTaskSubmitMins: '',
              lateMoreThanDays: '',
            })
          }
          className="rounded-md bg-gray-500 px-6 py-3 text-white font-semibold hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Save
        </button>
      </section>
    </form>
  );
};

export default RulesForm;


