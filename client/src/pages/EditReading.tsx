import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GET_READING } from "../graphql/queries";
import { UPDATE_READING } from "../graphql/mutations";
import { useAuth } from "../context/useAuth";

type Reading = {
  id: string;
  value: number;
  status: string;
  readingTime: string;
  note?: string;
};

type GetReadingResponse = {
  reading: Reading;
};

type UpdateReadingResponse = {
  updateReading: Reading;
};

const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const EditReading = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<{
    value: string;
    readingTime: string;
    note: string;
  } | null>(null);

  const { data, loading, error } = useQuery<GetReadingResponse>(GET_READING, {
    variables: { id },
    skip: !id,
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  const [updateReading, { loading: updateLoading }] =
    useMutation<UpdateReadingResponse>(UPDATE_READING, {
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });

  const formValues = form ?? {
    value: data?.reading.value.toString() || "",
    readingTime: data?.reading ? formatDateTimeLocal(data.reading.readingTime) : "",
    note: data?.reading.note || "",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!id) {
      setErrorMessage("Reading ID is missing");
      return;
    }

    try {
      await updateReading({
        variables: {
          id,
          value: parseFloat(formValues.value),
          readingTime: new Date(formValues.readingTime).toISOString(),
          note: formValues.note,
        },
      });

      navigate("/readings");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  if (!id) return <p className="app-error-state">Reading ID is missing</p>;
  if (loading) return <p className="app-loading">Loading...</p>;
  if (error) return <p className="app-error-state">Error loading reading</p>;

  return (
    <div className="app-page">
      <div className="app-card app-card--form form-card">
        <h2 className="app-title">Edit Glucose Reading</h2>
        <p className="app-subtitle">
          Update your saved glucose reading in mmol/L.
        </p>

        {errorMessage && (
          <p className="app-message app-message--error">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            step="0.1"
            name="value"
            placeholder="Glucose value (mmol/L)"
            value={formValues.value}
            onChange={handleChange}
            className="form-field"
          />

          <input
            type="datetime-local"
            name="readingTime"
            value={formValues.readingTime}
            onChange={handleChange}
            className="form-field"
          />

          <textarea
            name="note"
            placeholder="Optional note"
            value={formValues.note}
            onChange={handleChange}
            rows={4}
            cols={30}
            className="form-field form-textarea"
          />

          <button
            type="submit"
            disabled={updateLoading}
            className="form-button"
          >
            {updateLoading ? "Saving..." : "Update Reading"}
          </button>
        </form>

        <p className="form-back-link">
          <Link to="/readings" className="app-link app-link-inline">
            Back to Readings
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EditReading;
