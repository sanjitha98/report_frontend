import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RulesForm.css';

const RulesForm = () => {
  const [formData, setFormData] = useState({
    morning_punch: '',
    working_hours: '',
    permission_hours: '',
    permission_count: '',
    grace_time: '',
    late_penalty: '',
    break_hours: '',
    half_day_limit: '',
    evening_punch: '',
    task_submission: '',
    casual_leave: '',
    saturday_off: '',
    sandwich_policy: '',
  });

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/get_rules_form`);
        if (res.data) {
          setFormData(res.data);
        }
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/post_rules_form`, formData);
      alert('Rules submitted successfully!');
    } catch (error) {
      console.error('Error submitting rules:', error);
    }
  };

  return (
    <form className="rules-form" onSubmit={handleSubmit}>
      <h1 className="font-bold text-center text-black mb-4" style={{ fontSize: '1.5rem' }}>Rules Form</h1>

      <label>1. Morning punch should be on or before:</label>
      <input type="time" name="morning_punch" value={formData.morning_punch} onChange={handleChange} required />

      <label>2. Total working hours per day:</label>
      <input type="number" name="working_hours" value={formData.working_hours} onChange={handleChange} required />

      <label>3. Total hours of permission per month:</label>
      <input type="number" name="permission_hours" value={formData.permission_hours} onChange={handleChange} required />

      <label>4. Number of permission per month:</label>
      <input type="number" name="permission_count" value={formData.permission_count} onChange={handleChange} required />

      <label>5. Grace time allowed for late coming per month (in minutes):</label>
      <input type="number" name="grace_time" value={formData.grace_time} onChange={handleChange} required />

      <label>6. Late coming beyond grace will be considered as:</label>
      <input type="text" name="late_penalty" value={formData.late_penalty} onChange={handleChange} required />

      <label>7. Total break hours allowed per day:</label>
      <input type="number" name="break_hours" value={formData.break_hours} onChange={handleChange} required />

      <label>8. Half-day leave is considered if worked for less than:</label>
      <input type="number" name="half_day_limit" value={formData.half_day_limit} onChange={handleChange} required />

      <label>9. Evening punch should be on or after:</label>
      <input type="time" name="evening_punch" value={formData.evening_punch} onChange={handleChange} required />

      <label>10. Daily tasks should be submitted within (minutes after punch-in):</label>
      <input type="number" name="task_submission" value={formData.task_submission} onChange={handleChange} required />

      <label>11. Casual leave per month:</label>
      <input type="number" name="casual_leave" value={formData.casual_leave} onChange={handleChange} required />

      <label>12. Saturday off per month:</label>
      <input type="number" name="saturday_off" value={formData.saturday_off} onChange={handleChange} required />

      <label>13. Sandwich Policy:</label>
      <input type="text" name="sandwich_policy" value={formData.sandwich_policy} onChange={handleChange} required />

      <button type="submit">Submit Rules</button>
    </form>
  );
};

export default RulesForm;
