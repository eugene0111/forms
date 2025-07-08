import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Star,
  FileText,
  User,
  Calendar,
  Hash,
  Type,
  Mail,
  MessageSquare,
  CheckSquare,
  Circle,
  List,
  AlertCircle,
  Clock,
  X,
  Menu,
  LogOut
} from "lucide-react";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assignedForm, setAssignedForm] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedResponsesData, setSubmittedResponsesData] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "email", label: "Email", icon: Mail },
    { value: "number", label: "Number", icon: Hash },
    { value: "textarea", label: "Text Area", icon: MessageSquare },
    { value: "select", label: "Dropdown", icon: List },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "radio", label: "Radio Button", icon: Circle },
    { value: "date", label: "Date", icon: Calendar },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
    fetchAssignedForm();
  }, []);

  const fetchAssignedForm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      const response = await axios.get(
        "http://localhost:3000/api/user/my-form",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.hasForm) {
        setAssignedForm(response.data.form);
        setHasSubmitted(response.data.hasSubmitted);
        setSubmittedResponsesData(response.data.response);

        const initialFormData = {};
        if (response.data.hasSubmitted && response.data.response) {
          response.data.response.responses.forEach((res) => {
            initialFormData[res.fieldName] = res.value;
          });
        } else {
          response.data.form.fields.forEach((field) => {
            if (field.fieldType === "checkbox") {
              initialFormData[field.fieldName] = [];
            } else {
              initialFormData[field.fieldName] = "";
            }
          });
        }
        setFormData(initialFormData);
      } else {
        setAssignedForm(null);
        setHasSubmitted(false);
        setSubmittedResponsesData(null);
      }
    } catch (error) {
      console.error("Error fetching assigned form:", error);
      setError(
        error.response?.data?.error || "Failed to fetch form. Please try again."
      );
      setAssignedForm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, value, fieldType) => {
    setFormData((prev) => {
      if (fieldType === "checkbox") {
        const currentValues = prev[fieldName] || [];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [fieldName]: currentValues.filter((v) => v !== value),
          };
        } else {
          return { ...prev, [fieldName]: [...currentValues, value] };
        }
      }
      return { ...prev, [fieldName]: value };
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const responsesPayload = Object.keys(formData).map((fieldName) => ({
        fieldName,
        value: formData[fieldName],
      }));

      const payload = {
        formId: assignedForm._id,
        responses: responsesPayload,
      };

      await axios.post("http://localhost:3000/api/user/submit-form", payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Form submitted successfully!");
      await fetchAssignedForm();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to submit form. Please check your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const renderFormField = (field, isReadOnly = false) => {
    const FieldIcon =
      fieldTypes.find((type) => type.value === field.fieldType)?.icon || Type;

    let currentValue = formData[field.fieldName];
    if (
      isReadOnly &&
      submittedResponsesData &&
      submittedResponsesData.responses
    ) {
      const submittedValue = submittedResponsesData.responses.find(
        (r) => r.fieldName === field.fieldName
      )?.value;
      currentValue = submittedValue !== undefined ? submittedValue : "";
    }

    return (
      <div
        key={field.fieldName}
        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2 items-center space-x-2">
          <FieldIcon className="w-4 h-4 text-blue-600" />
          <span>
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </span>
        </label>

        {field.fieldType === "text" && (
          <input
            type="text"
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
          />
        )}

        {field.fieldType === "email" && (
          <input
            type="email"
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
          />
        )}

        {field.fieldType === "number" && (
          <input
            type="number"
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
          />
        )}

        {field.fieldType === "textarea" && (
          <textarea
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
            disabled={isReadOnly}
          />
        )}

        {field.fieldType === "select" && (
          <select
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required}
            disabled={isReadOnly}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {field.fieldType === "checkbox" && (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={field.fieldName}
                  value={option}
                  checked={
                    Array.isArray(currentValue) && currentValue.includes(option)
                  }
                  onChange={(e) =>
                    handleInputChange(
                      field.fieldName,
                      e.target.value,
                      field.fieldType
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isReadOnly}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {field.fieldType === "radio" && (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option}
                  checked={currentValue === option}
                  onChange={(e) =>
                    handleInputChange(
                      field.fieldName,
                      e.target.value,
                      field.fieldType
                    )
                  }
                  className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isReadOnly}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {field.fieldType === "date" && (
          <input
            type="date"
            name={field.fieldName}
            value={currentValue || ""}
            onChange={(e) =>
              handleInputChange(
                field.fieldName,
                e.target.value,
                field.fieldType
              )
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required}
            disabled={isReadOnly}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white border-b-4 border-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <img src="/logo.png" alt="DRDO Logo" className="w-15 h-15 object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">
                    DRDO User Panel
                  </h1>
                  <p className="text-sm text-gray-600">
                    Form Submission System
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">
                  Welcome, {currentUser?.username || "User"}
                </p>
                <p className="text-xs text-gray-500 uppercase">Personnel</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  My Assigned Form
                </h2>
                <p className="text-gray-600">
                  Complete the form assigned to you
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your form...</p>
          </div>
        ) : (
          <>
            {!assignedForm ? (
              <div className="bg-white rounded-lg shadow-lg border-t-4 border-gray-400 p-6 text-center py-12">
                <FileText className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Form Currently Assigned
                </h3>
                <p className="text-gray-600">
                  Please check back later or contact your administrator if you
                  believe this is an error.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-green-600" />
                    {assignedForm.title}
                  </h3>
                  {assignedForm.description && (
                    <p className="text-gray-600 mb-4">
                      {assignedForm.description}
                    </p>
                  )}
                  {hasSubmitted && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <p className="text-yellow-700 font-medium">
                        You have already submitted this form. Viewing read-only
                        responses.
                        {submittedResponsesData?.submittedAt &&
                          ` (Submitted on: ${new Date(
                            submittedResponsesData.submittedAt
                          ).toLocaleDateString()})`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-lg border-t-4 border-purple-600 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-2 text-purple-600" />
                    Your Responses
                  </h3>
                  <div className="space-y-6">
                    {assignedForm.fields.map((field) =>
                      renderFormField(field, hasSubmitted)
                    )}
                  </div>
                </div>

                {!hasSubmitted && (
                  <div className="bg-white rounded-lg shadow-lg border-t-4 border-orange-600 p-6">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                      >
                        <LogOut className="w-5 h-5 mr-2 inline" />
                        Logout
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-5 h-5 mr-2" />
                            Submit Form
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {hasSubmitted && (
                  <div className="bg-white rounded-lg shadow-lg border-t-4 border-gray-600 p-6 text-center">
                    <p className="text-gray-700 font-medium">
                      Form has been successfully submitted. You can review your
                      responses above.
                    </p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center mx-auto"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Secure Logout
                    </button>
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            DRDO - Defence Research and Development Organisation |
            Government of India
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Classified System - Authorized Personnel Only
          </p>
        </div>
      </footer>
    </div>
  );
};
