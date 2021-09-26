import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { signUpUser } from "../../FirebaseAuth";
import "./SignUp-styles.css";
import { Loading } from "../Loading/Loading";

export const SignUp = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const history = useHistory();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = (e) => {
        e.preventDefault();
        signUpUser(
            email,
            password,
            rePassword,
            setLoading,
            setError,
            firstname,
            lastname,
            history,
        );
    };

    return (
        <div className="signup">
            <div className="signup_details">
                <div className="signup_headers">
                    <h1>React Chat</h1>
                    <h2>Create New Account!</h2>
                </div>
                <form>
                    <div className="signup_name">
                        <div>
                            <h5>First Name</h5>
                            <input
                                type="text"
                                required
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <h5>Last Name</h5>
                            <input
                                type="text"
                                required
                                placeholder="First Name"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="signup_detail">
                        <h5>Email</h5>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="signup_detail">
                        <h5>Password</h5>
                        <input
                            type="password"
                            required
                            placeholder="Enter your password (Must be atleast 6 characters long)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="signup_detail">
                        <h5>Re-Enter Password</h5>
                        <input
                            type="password"
                            required
                            placeholder="Re-enter your password (Must be atleast 6 characters long)"
                            value={rePassword}
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                    </div>
                    <button onClick={(e) => handleSignUp(e)}>
                        Create Account
                    </button>
                    {loading ? <Loading /> : null}
                    {error ? (
                        <p className="signup_error">
                            <ErrorOutlineIcon /> {error}
                        </p>
                    ) : null}
                </form>
                <Link to="/login" style={{ textDecoration: "none" }}>
                    <div className="sign_goToLogin">
                        <small>
                            Already have an account? <strong>{" Login"}</strong>
                        </small>
                    </div>
                </Link>
            </div>
        </div>
    );
};
