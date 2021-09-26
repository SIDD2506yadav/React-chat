import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import userimg from "../../assets/userimg.png";
import chat from "../../assets/chat.png";
import { Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { database } from "../../Firebase";
import { onValue } from "firebase/database";
import { useStateValue } from "../../StateProvider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import ClearIcon from "@material-ui/icons/Clear";
import { signOut } from "firebase/auth";
import { ref, query, startAt, orderByChild, endAt } from "firebase/database";
import { auth } from "../../Firebase";
import "./Navbar-styles.css";
import { Users } from "../Users/Users";

export const Navbar = () => {
    const [{ user }] = useStateValue();
    const [search, setSearch] = useState("");
    const [haveText, sethaveText] = useState(false);
    const [fetchedUsers, setFetchedUsers] = useState([]);

    const history = useHistory();
    const handleLogout = () => {
        signOut(auth);
        history.push("/login");
    };

    const [profilePicture, setProfilePicture] = useState("");
    const [firstname, setFirstname] = useState("");
    const handleClick = () => {
        setSearch("");
    };

    useEffect(() => {
        if (search.length > 0) {
            const timer = setTimeout(() => {
                sethaveText(true);
                const usernameQuery = query(
                    ref(database, `usernames`),
                    orderByChild("name"),
                    startAt(search.toLowerCase()),
                    endAt(search.toLowerCase() + "\uf8ff"),
                );
                onValue(
                    usernameQuery,
                    (snapshot) => {
                        const data = snapshot.val();
                        const tempArray = [];
                        if (data !== null) {
                            for (let key in data) {
                                tempArray.push(key);
                            }
                            setFetchedUsers(tempArray);
                        } else {
                            setFetchedUsers([]);
                        }
                    },
                    500,
                );
            });
            return () => clearTimeout(timer);
        } else {
            sethaveText(false);
        }
    }, [search]);

    useEffect(() => {
        if (user) {
            const userRef = ref(database, "users/" + user);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setProfilePicture(data.profilePicture);
                setFirstname(data.firstname);
            });
        }
    }, [user]);
    return (
        <div className="navbar">
            <Link to="/" style={{ textDecoration: "none" }}>
                <span className="navbar_logoSpan">
                    <img src={chat} alt="" className="navbar_logo" />
                    <Tooltip title="Home">
                        <h3 className="navbar_brandName">React Chat</h3>
                    </Tooltip>
                </span>
            </Link>

            <div className="navbar_items">
                <div className="navbar_searchbox">
                    <div className="navbar_search">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ClearIcon
                            onClick={handleClick}
                            className={
                                haveText ? "cross" : "cross navbar_hideUsers"
                            }
                        />
                    </div>

                    <div
                        className={
                            haveText
                                ? "navbar_displayUsers"
                                : "navbar_hideUsers navbar_displayUsers"
                        }
                    >
                        {fetchedUsers.length > 0 ? (
                            fetchedUsers.map((fetchedUser) => (
                                <Users
                                    fetchedUser={fetchedUser}
                                    key={fetchedUser}
                                />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                </div>
                <Tooltip title="Requests">
                    <Link to="/friends">
                        <PeopleAltIcon className="navbar_usericon" />
                    </Link>
                </Tooltip>
                <Tooltip title="Logout" onClick={handleLogout}>
                    <ExitToAppIcon className="navbar_logout" />
                </Tooltip>

                <Link to="/profile" className="navbar_profileLink">
                    <Tooltip title="Your profile">
                        <img
                            src={
                                profilePicture.length > 0
                                    ? `${profilePicture}`
                                    : userimg
                            }
                            alt=""
                            className="navbar_profilePicture"
                        />
                    </Tooltip>
                    <small>{firstname}</small>
                </Link>
            </div>
        </div>
    );
};
