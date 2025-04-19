import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const navigate = useNavigate();
  // const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    project: "",
    subProject: "",
    contact_details: [
      {
        client_name: "",
        contact_number: "",
        mail_id: "",
      },
    ],
  });

  const location = useLocation();
  const [projects, setProjects] = useState(location.state?.project || {});
  const [errors, setErrors] = useState({});
  //   useEffect(() => {

  //     setFormData({
  //       id: projects.id,
  //       project: projects.projectName,
  //       subProject: Array.isArray(projects.subCategory)
  //         ? projects.subCategory.join(", ")
  //         : "",
  //       client_name: projects.contactDetails?.[0]?.client_name || "",
  //       contact_number: projects.contactDetails?.[0]?.contact_number || "",
  //       mail_id: projects.contactDetails?.[0]?.mail_id || "",
  //     });
  // }, []);

  useEffect(() => {
    setFormData({
      id: projects.id,
      project: projects.projectName || "",
      subProject: Array.isArray(projects.subCategory)
        ? projects.subCategory.join(", ")
        : "",
      contact_details:
        projects.contactDetails && projects.contactDetails.length
          ? projects.contactDetails
          : [
              {
                client_name: "",
                contact_number: "",
                mail_id: "",
              },
            ],
    });
  }, []);

  // const fetchProjects = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/get_projects_list`
  //     );
  //     console.log("Fetched Projects:", response.data.data);
  //     setProjects(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching projects", error);
  //   }
  // };

  const handleEdit = (project) => {
    setFormData({
      id: project.id,
      project: project.projectName,
      subProject: Array.isArray(project.subCategory)
        ? project.subCategory.join(", ")
        : "",
      client_name: project.contact_details?.[0]?.client_name || "",
      contact_number: project.contact_details?.[0]?.contact_number || "",
      mail_id: project.contact_details?.[0]?.mail_id || "",
    });
    setShowForm(true);
  };

  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (field && index !== null) {
      const updatedContacts = [...formData.contact_details];
      updatedContacts[index][field] = value;
      setFormData((prev) => ({
        ...prev,
        contact_details: updatedContacts,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for the changed field
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    if (field && errors[`${field}_${index}`]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${field}_${index}`];
        return newErrors;
      });
    }
  };

  const handleAddContact = () => {
    if (formData.contact_details.length < 5) {
      setFormData((prev) => ({
        ...prev,
        contact_details: [
          ...prev.contact_details,
          {
            client_name: "",
            contact_number: "",
            mail_id: "",
          },
        ],
      }));
    }
  };

  const handleRemoveContact = (index) => {
    const updatedContacts = [...formData.contact_details];
    updatedContacts.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      contact_details: updatedContacts,
    }));
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactNumberRegex = /^\d{10}$/;

    let validationErrors = {};
    if (!formData.project.trim()) {
      newErrors.project = "Project Name is required";
      isValid = false;
    }

    formData.contact_details.forEach((contact, index) => {
      if (!contact.client_name.trim()) {
        newErrors[`client_name_${index}`] = "Client Name is required";
        isValid = false;
      }
      if (!contact.contact_number.trim()) {
        newErrors[`contact_number_${index}`] = "Contact Number is required";
        isValid = false;
      } else if (
        !contact.contact_number ||
        contact.contact_number.length !== 10
      ) {
        newErrors[`contact_${index}`] =
          "Contact number must be exactly 10 digits.";
        isValid = false;
      }
      if (!contact.mail_id.trim()) {
        newErrors[`mail_id_${index}`] = "Client Email is required";
        isValid = false;
      } else if (!emailRegex.test(contact.mail_id)) {
        newErrors[`mail_id_${index}`] = "Invalid email format";
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (isValid) {
      const payload = {
        id: formData.id ?? null,
        project: formData.project || null,
        idRef: null,
        subProject: formData.subProject
          ? formData.subProject.split(",").map((s) => s.trim())
          : [],
        //     contact_details: [
        //       {
        //         client_name: formData.client_name || null,
        //         contact_number: formData.contact_number || null,
        //         mail_id: formData.mail_id || null,
        //       },
        //     ],
        //   };

        //   try {
        //     await axios.post(
        //       `${process.env.REACT_APP_API_URL}/project_master`,
        //       payload
        //     );

        //     setFormData({
        //       id: null,
        //       project: "",
        //       subProject: "",
        //       client_name: "",
        //       contact_number: "",
        //       mail_id: "",
        //     });
        //     // fetchProjects();
        //     setSuccessMessage("Project saved successfully.");
        //   } catch (err) {
        //     console.error("Failed to submit project", err);
        //   }
        // };
        contact_details: formData.contact_details.map((contact) => ({
          client_name: contact.client_name || null,
          contact_number: contact.contact_number || null,
          mail_id: contact.mail_id || null,
        })),
      };

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/project_master`,
          payload
        );

        setFormData({
          id: null,
          project: "",
          subProject: "",
          contact_details: [
            {
              client_name: "",
              contact_number: "",
              mail_id: "",
            },
          ],
        });
        setSuccessMessage("Project saved successfully.");
        setErrors({});
      } catch (err) {
        console.error("Failed to submit project", err);
      }
    }
  };

  //   return (
  //     <div className="p-5">
  //       <h2 className="text-2xl font-bold mb-4">Project Form</h2>

  //       {showForm ? (
  //         <button
  //           onClick={() => {
  //             setShowForm(false);
  //             setFormData({
  //               id: null,
  //               project: "",
  //               subProject: "",
  //               client_name: "",
  //               contact_number: "",
  //               mail_id: "",
  //             });
  //           }}
  //           className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4"
  //         >
  //           ← Back
  //         </button>
  //       ) : (
  //         <></>
  //       )}

  //       {successMessage && (
  //         <div className="bg-green-100 text-blue-800 p-2 rounded mb-4">
  //           {successMessage}
  //         </div>
  //       )}

  //       {/* Form */}

  //       <div className="mb-6 border p-4 rounded bg-gray-50">
  //         <h3 className="text-lg font-semibold mb-2">
  //           {formData.id ? "Update Project" : "Add Project"}
  //         </h3>

  //         <input
  //           type="text"
  //           name="project"
  //           placeholder="Project Name"
  //           value={formData.project}
  //           onChange={handleChange}
  //           className="block w-full mb-2 p-2 border"
  //         />

  //         <input
  //           type="text"
  //           name="subProject"
  //           placeholder="Sub Projects"
  //           value={formData.subProject}
  //           onChange={handleChange}
  //           className="block w-full mb-2 p-2 border"
  //         />

  //         <input
  //           type="text"
  //           name="client_name"
  //           placeholder="Client Name"
  //           value={formData.client_name}
  //           onChange={handleChange}
  //           className="block w-full mb-2 p-2 border"
  //         />

  //         <input
  //           type="text"
  //           name="contact_number"
  //           placeholder="Contact Number"
  //           value={formData.contact_number}
  //           onChange={handleChange}
  //           className="block w-full mb-2 p-2 border"
  //         />

  //         <input
  //           type="email"
  //           name="mail_id"
  //           placeholder="Email"
  //           value={formData.mail_id}
  //           onChange={handleChange}
  //           className="block w-full mb-2 p-2 border"
  //         />

  //         <div className="flex gap-2 mt-2">
  //           <button
  //             onClick={handleSubmit}
  //             className="bg-blue-600 text-white px-4 py-2 rounded"
  //           >
  //             {formData.id ? "Update Project" : "Add Project"}
  //           </button>
  //           <button
  //             onClick={() => {
  //               navigate("/dashboard/projects");
  //               setShowForm(false);
  //               setFormData({
  //                 id: null,
  //                 project: "",
  //                 subProject: "",
  //                 client_name: "",
  //                 contact_number: "",
  //                 mail_id: "",
  //               });
  //             }}
  //             className="bg-blue-600 text-white px-4 py-2 rounded"
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default ProjectForm;

  return (
    <div className="p-5">
      {/* <h2 className="text-2xl font-bold mb-4">Project Form</h2> */}

      {showForm && (
        <button
          onClick={() => {
            setShowForm(false);
            setFormData({
              id: null,
              project: "",
              subProject: "",
              contact_details: [
                {
                  client_name: "",
                  contact_number: "",
                  mail_id: "",
                },
              ],
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4"
        >
          ← Back
        </button>
      )}

      {/* {successMessage && (
        <div className="bg-green-100 text-blue-800 p-2 rounded mb-4">
          {successMessage}
        </div>
      )} */}

      {/* <div className="mb-6 border p-4 rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">
        {formData.id ? "Update Project" : "Add Project"}
      </h3>

      <input
        type="text"
        name="project"
        placeholder="Project Name"
        value={formData.project}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />

      <input
        type="text"
        name="subProject"
        placeholder="Sub Projects"
        value={formData.subProject}
        onChange={handleChange}
        className="block w-full mb-4 p-2 border"
      />

      <div className="mb-4">
        <h4 className="font-medium mb-2">Contact Details</h4>
        {formData.contact_details.map((contact, index) => (
          <div key={index} className="border p-3 mb-2 rounded bg-white">
            <input
              type="text"
              placeholder="Client Name"
              value={contact.client_name}
              onChange={(e) => handleChange(e, index, "client_name")}
              className="block w-full mb-2 p-2 border"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={contact.contact_number}
              onChange={(e) => handleChange(e, index, "contact_number")}
              className="block w-full mb-2 p-2 border"
            />
            <input
              type="email"
              placeholder="Email"
              value={contact.mail_id}
              onChange={(e) => handleChange(e, index, "mail_id")}
              className="block w-full mb-2 p-2 border"
            />
            {formData.contact_details.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {formData.contact_details.length < 5 && (
          <button
            type="button"
            onClick={handleAddContact}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Add Contact
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {formData.id ? "Update Project" : "Add Project"}
        </button>
        <button
          onClick={() => {
            navigate("/dashboard/projects");
            setShowForm(false);
            setFormData({
              id: null,
              project: "",
              subProject: "",
              contact_details: [
                {
                  client_name: "",
                  contact_number: "",
                  mail_id: "",
                },
              ],
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div> */}
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-black-800 border-b pb-3">
          {formData.id ? "Update Project" : "Add Project"}
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <label htmlFor="project" className="w-32 text-sm font-text-black-600">
            Project Name:
          </label>
          <input
            type="text"
            name="project"
            //placeholder="Project Name"
            value={formData.project}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none"
          />
          {errors.project && (
            <p className="text-red-600 text-sm mt-1">{errors.project}</p>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <label
            htmlFor="subProject"
            className="w-32 text-sm font-medium text-black-700"
          >
            Sub Products:
          </label>
          <input
            type="text"
            name="subProject"
            // placeholder="Sub Projects (comma-separated)"
            value={formData.subProject}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black-700 mb-4">
            Client Contact Details
          </h3>

          {formData.contact_details.map((contact, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <label
                  htmlFor="Client Name"
                  className="w-32 text-sm font-medium text-black-700"
                >
                  Client Name:
                </label>
                <input
                  type="text"
                  // placeholder="Client Name"
                  value={contact.client_name}
                  onChange={(e) => handleChange(e, index, "client_name")}
                  className="w-full p-2 border rounded focus:outline-none"
                />
                {errors[`client_name_${index}`] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[`client_name_${index}`]}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <label
                  htmlFor="Contact Number"
                  className="w-32 text-sm font-medium text-black-700"
                >
                  Contact Number:
                </label>
                <input
                  type="text"
                  //placeholder="Contact Number"
                  value={contact.contact_number}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Allow only digits and max 10 characters
                    if (/^\d{0,10}$/.test(input)) {
                      handleChange(e, index, "contact_number");
                    }
                  }}
                  maxLength={10}
                  className="w-full p-2 border rounded focus:outline-none"
                />
                {errors[`contact_${index}`] && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors[`contact_${index}`]}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <label
                  htmlFor="Email"
                  className="w-32 text-sm font-medium text-black-700"
                >
                  Client Email:
                </label>

                <input
                  type="email"
                  //placeholder="Email"
                  value={contact.mail_id}
                  onChange={(e) => handleChange(e, index, "mail_id")}
                  className="w-full p-2 border rounded focus:outline-none"
                />
                {errors[`mail_id_${index}`] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[`mail_id_${index}`]}
                  </p>
                )}
              </div>
              {formData.contact_details.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveContact(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  ✖ Remove Contact
                </button>
              )}
            </div>
          ))}

          {formData.contact_details.length < 5 && (
            <button
              type="button"
              onClick={handleAddContact}
              className="mt-2 text-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Add Another Contact
            </button>
          )}
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded shadow-sm text-center font-medium">
            ✅ {successMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow"
          >
            {formData.id ? "Update Project" : "Add Project"}
          </button>
          <button
            onClick={() => {
              navigate("/dashboard/projects");
              setShowForm(false);
              setFormData({
                id: null,
                project: "",
                subProject: "",
                contact_details: [
                  {
                    client_name: "",
                    contact_number: "",
                    mail_id: "",
                  },
                ],
              });
              setErrors({});
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
