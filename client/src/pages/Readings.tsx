import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GET_READINGS } from "../graphql/queries";
import { DELETE_READING } from "../graphql/mutations";
import { useAuth } from "../context/useAuth";

type Reading = {
  id: string;
  value: number;
  status: string;
  readingTime: string;
  note?: string;
};

type GetReadingsResponse = {
  myReadings: Reading[];
};

type DeleteReadingResponse = {
  deleteReading: string;
};

const getStatusColor = (status: string) => {
  if (status === "Low") return "skyblue";
  if (status === "Normal") return "lightgreen";
  if (status === "High") return "orange";
  if (status === "Very High") return "red";
  return "white";
};

const Readings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const pageSuccessMessage =
    (location.state as { successMessage?: string } | null)?.successMessage || "";

  if (pageSuccessMessage) {
    window.history.replaceState({}, "", location.pathname);
  }

  const { data, loading, error } = useQuery<GetReadingsResponse>(GET_READINGS, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [deleteReading] = useMutation<DeleteReadingResponse>(DELETE_READING);

  const handleDelete = async (id: string) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setDeletingId(id);

      await deleteReading({
        variables: { id },
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
      });

      setSuccessMessage("Reading deleted successfully");
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong while deleting the reading");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="app-loading">Loading...</p>;
  if (error) return <p className="app-error-state">Error loading readings</p>;

  return (
    <div className="app-page">
      <div className="app-shell">
        <div className="app-card readings-header-card">
          <h2 className="app-title">My Glucose Readings</h2>

          {errorMessage && (
            <p className="app-message app-message--error">{errorMessage}</p>
          )}

          {(successMessage || pageSuccessMessage) && (
            <p className="app-message app-message--success">
              {successMessage || pageSuccessMessage}
            </p>
          )}

          <p className="app-subtitle">
            Your glucose readings are shown in mmol/L.
          </p>

          <div className="app-link-row">
            <Link to="/add-reading" className="app-link app-link-inline">
              + Add New Reading
            </Link>

            <Link to="/dashboard" className="app-link app-link-inline">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {data && data.myReadings.length === 0 && (
          <div className="app-card readings-header-card">
            <p className="readings-empty">No readings yet.</p>
          </div>
        )}

        <ul className="readings-list">
          {data?.myReadings.map((reading) => (
            <li key={reading.id} className="reading-card">
              <p className="reading-value">
                <strong style={{ color: getStatusColor(reading.status) }}>
                  {reading.value.toFixed(1)} mmol/L
                </strong>{" "}
                - {reading.status}
              </p>

              <p className="reading-meta">
                Time: {new Date(reading.readingTime).toLocaleString()}
              </p>

              <p className="reading-note">
                Note: {reading.note || "No note"}
              </p>

              <button
                onClick={() => navigate(`/edit-reading/${reading.id}`)}
                className="reading-button reading-button--edit"
                disabled={deletingId === reading.id}
              >
                Edit
              </button>

              {confirmDeleteId === reading.id ? (
                <div className="reading-confirm-box">
                  <p className="reading-confirm-text">
                    Are you sure you want to delete this reading?
                  </p>

                  <button
                    onClick={() => handleDelete(reading.id)}
                    disabled={deletingId === reading.id}
                    className="reading-button reading-button--delete reading-confirm-button"
                  >
                    {deletingId === reading.id ? "Deleting..." : "Confirm Delete"}
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deletingId === reading.id}
                    className="reading-button reading-button--cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(reading.id)}
                  disabled={deletingId === reading.id}
                  className="reading-button reading-button--delete"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Readings;
