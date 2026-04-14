import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN_USER } from "../graphql/mutations";
import { useAuth } from "../context/useAuth";

type LoginResponse = {
  login: {
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

const Login = () => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [login] = useMutation<LoginResponse>(LOGIN_USER);

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
      const { data } = await login({
        variables: form,
      });

      if (!data) {
        return;
      }

      setAuthData(data.login.token, data.login.user);
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
      <div className="app-card app-card--narrow auth-card">
        <h2 className="app-title">Login</h2>
        <p className="app-subtitle">Sign in to manage your glucose readings.</p>

        {errorMessage && (
          <p className="app-message app-message--error">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="app-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
