import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Loading } from "../Loading/Loading";
import { loginUser } from "../../FirebaseAuth";
import "./Login-styles.css";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleSignIn = (e) => {
        e.preventDefault();
        loginUser(email, password, setLoading, setError, history);
    };

    return (
        <div className="login">
            <div className="login_details">
                <div className="login_headers">
                    <h1>React Chat</h1>
                    <h2>Welcome back !</h2>
                    <h2>Login</h2>
                </div>
                <form>
                    <div className="login_detail">
                        <h5>Email</h5>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login_detail">
                        <h5>Password</h5>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={(e) => handleSignIn(e)}>Login</button>
                    {loading ? <Loading /> : null}
                    {error ? (
                        <p className="login_error">
                            <ErrorOutlineIcon /> {error}
                        </p>
                    ) : null}
                </form>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                    <div className="login_goToSignUp">
                        <small>Don't have an account? </small>{" "}
                        <strong> Sign Up!</strong>
                    </div>
                </Link>
            </div>
        </div>
    );
};
