import React, { useEffect, useState, useRef } from "react";
import userimg from "../../assets/userimg.png";
import { useStateValue } from "../../StateProvider";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Button } from "@material-ui/core";
import {
    upDateName,
    handleImageAsFile,
    handleFireBaseUpload,
    handleChangeNewPassword,
} from "../../FirebaseProfile";
import { useHistory } from "react-router-dom";
import { database } from "../../Firebase";
import { ref as dbref, onValue } from "firebase/database";

import "./Profile-styles.css";
import { Loading } from "../Loading/Loading";

export const Profile = () => {
    const [{ user }] = useStateValue();
    const history = useHistory();
    if (!user) {
        history.push("/login");
    }

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [imageAsFile, setImageAsFile] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const errorRef = useRef(null);

    useEffect(() => {
        errorRef.current.scrollIntoView({ behaviour: "smooth" });
    }, [errors]);

    useEffect(() => {
        const userRef = dbref(database, "users/" + user);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setEmail(data.email);
            setProfilePicture(data.profilePicture);
        });
    }, [user]);

    return (
        <div className="profile">
            <div className="profile_view">
                <h3>
                    {firstname} {lastname}
                </h3>
                <div className="profile_picture">
                    <img
                        src={
                            profilePicture.length > 0
                                ? `${profilePicture}`
                                : userimg
                        }
                        alt=""
                    />
                    <div className="profile_changeOptions">
                        <input
                            type="file"
                            id="input"
                            className="profile_chooseText"
                            onChange={(e) =>
                                handleImageAsFile(e, setImageAsFile)
                            }
                        />
                        <Button
                            className="profile_uploadProfile"
                            variant="contained"
                            component="label"
                            onClick={(e) =>
                                handleFireBaseUpload(
                                    e,
                                    user,
                                    setLoading,
                                    imageAsFile,
                                    setError,
                                )
                            }
                        >
                            Change Profile Picture
                        </Button>
                    </div>
                </div>

                <div className="profile_userDetails">
                    <div className="profile_userDetail">
                        <h5>Change profile name</h5>
                        <div className="profile_userName">
                            <span className="profile_textFields">
                                <label htmlFor="firstname">
                                    <strong>Firstname</strong>
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    autoComplete="new-password"
                                    maxLength="20"
                                    placeholder="First Name"
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </span>
                            <span className="profile_textFields">
                                <label htmlFor="lastname">
                                    <strong>Lastname</strong>
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    autoComplete="new-password"
                                    maxLength="10"
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </span>
                        </div>
                        <button
                            className="profile_changeName"
                            onClick={(e) =>
                                upDateName(
                                    e,
                                    user,
                                    firstname,
                                    lastname,
                                    setLoading,
                                    setError,
                                )
                            }
                        >
                            Change Username
                        </button>
                    </div>
                </div>
                <div className="profile_changePassword">
                    <h5>Change Password</h5>
                    <span className="profile_passwordFields">
                        <label htmlFor="oldPassword">
                            <strong>Enter old password</strong>
                        </label>
                        <input
                            type="password"
                            id="oldPasword"
                            placeholder="Enter your old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </span>
                    <span className="profile_newPassword">
                        <span className="profile_passwordField">
                            <label htmlFor="newPassword">
                                <strong>Enter new password</strong>
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter your new password(Minimum length must be 6 characters)"
                                value={newPassword}
                                onChange={(e) => setnewPassword(e.target.value)}
                            />
                        </span>
                        <span className="profile_passwordField">
                            <label htmlFor="reNewPassword">
                                <strong>Enter new password</strong>
                            </label>
                            <input
                                type="password"
                                id="reNewPassword"
                                placeholder="Re-enter your new password(Minimum length must be 6 characters)"
                                value={reNewPassword}
                                onChange={(e) =>
                                    setReNewPassword(e.target.value)
                                }
                            />
                        </span>
                    </span>
                    <button
                        onClick={() =>
                            handleChangeNewPassword(
                                email,
                                oldPassword,
                                newPassword,
                                reNewPassword,
                                setLoading,
                                setError,
                                history,
                            )
                        }
                    >
                        Change Password
                    </button>
                    <span className="profile_forgotPassword">
                        <strong>Forgot password!</strong>
                    </span>
                </div>
                <span className="profile_feedback">
                    {loading ? <Loading /> : null}
                    {errors ? (
                        <small>
                            <ErrorOutlineIcon /> {errors}
                        </small>
                    ) : null}
                </span>
                <div ref={errorRef}></div>
            </div>
        </div>
    );
};
