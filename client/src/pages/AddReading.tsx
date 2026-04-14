import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { ADD_READING } from "../graphql/mutations";
import { GET_READINGS } from "../graphql/queries";
import { useAuth } from "../context/useAuth";

type AddReadingResponse = {
  addReading: {
    id: string;
    value: number;
    status: string;
    readingTime: string;
    note?: string;
    user: {
      username: string;
    };
  };
};

const AddReading = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    value: "",
    readingTime: "",
    note: "",
  });

  const [addReading, { loading }] = useMutation<AddReadingResponse>(
    ADD_READING,
    {
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
      refetchQueries: [
        {
          query: GET_READINGS,
          context: {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        },
      ],
      awaitRefetchQueries: true,
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await addReading({
        variables: {
          value: parseFloat(form.value),
          readingTime: new Date(form.readingTime).toISOString(),
          note: form.note,
        },
      });

      if (!data) {
        return;
      }

      navigate("/readings", {
        state: { successMessage: "Reading added successfully" },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="app-page">
      <div className="app-card app-card--form form-card">
        <h2 className="app-title">Add Glucose Reading</h2>
        <p className="app-subtitle">Enter your glucose reading in mmol/L.</p>

        {errorMessage && (
          <p className="app-message app-message--error">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="0.1"
            name="value"
            placeholder="Glucose value (mmol/L)"
            value={form.value}
            onChange={handleChange}
            className="form-field"
          />

          <input
            type="datetime-local"
            name="readingTime"
            value={form.readingTime}
            onChange={handleChange}
            className="form-field"
          />

          <textarea
            name="note"
            placeholder="Optional note"
            value={form.note}
            onChange={handleChange}
            rows={4}
            cols={30}
            className="form-field form-textarea"
          />

          <button type="submit" disabled={loading} className="form-button">
            {loading ? "Saving..." : "Add Reading"}
          </button>
        </form>

        <p className="form-back-link">
          <Link to="/dashboard" className="app-link app-link-inline">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddReading;
