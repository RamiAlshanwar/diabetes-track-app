import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";
import { useAuth } from "../context/useAuth";

type RegisterResponse = {
  register: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      authProvider: string;
    };
  };
};

const Register = () => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [register] = useMutation<RegisterResponse>(REGISTER_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await register({
        variables: form,
      });

      if (!data) {
        return;
      }

      setAuthData(data.register.token, data.register.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="app-page app-page--centered">
      <div className="app-card app-card--medium auth-card">
        <h2 className="app-title">Register</h2>
        <p className="app-subtitle">
          Create your account to start tracking readings.
        </p>

        {errorMessage && (
          <p className="app-message app-message--error">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="form-field"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="form-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-field"
          />

          <button type="submit" className="form-button">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="app-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
