import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import userimg from "../../assets/userimg.png";
import {
    acceptRequest,
    cancelRequest,
    sendFriendRequest,
} from "../../FirebaseFriendRequests";
import { database } from "../../Firebase";
import { ref as dbref, onValue } from "firebase/database";
import "./Users-styles.css";
import { useStateValue } from "../../StateProvider";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import ChatIcon from "@material-ui/icons/Chat";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Tooltip } from "@material-ui/core";

export const Users = ({
    fetchedUser,
    check = true,
    userStatus,
    showAppIcon = true,
}) => {
    const [{ user }] = useStateValue();
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState("user");
    const history = useHistory();

    useEffect(() => {
        const userRef = dbref(database, "users/" + fetchedUser);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                setFirstName(data.firstname);
                setLastName(data.lastname);
                setProfilePicture(data.profilePicture);
            }
        });

        if (fetchedUser !== user && check) {
            const friendRef = dbref(
                database,
                "friends/" + user + "/" + fetchedUser,
            );
            onValue(friendRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    setStatus("friend");
                } else {
                    const sentRequestRef = dbref(
                        database,
                        "sentRequests/" + user + "/" + fetchedUser,
                    );
                    onValue(sentRequestRef, (snapshot) => {
                        const data = snapshot.val();
                        if (data !== null) {
                            setStatus("sent");
                        } else {
                            const receivedRequestRef = dbref(
                                database,
                                "receivedRequests/" + user + "/" + fetchedUser,
                            );
                            onValue(receivedRequestRef, (snapshot) => {
                                const data = snapshot.val();
                                if (data !== null) {
                                    setStatus("received");
                                } else {
                                    setStatus("new");
                                }
                            });
                        }
                    });
                }
            });
        } else {
            setStatus("user");
        }
        if (!check) {
            setStatus(userStatus);
        }
    }, [fetchedUser, user, check, userStatus]);

    const handleSendMessage = () => {
        if (status === "friend") {
            history.push(`/${fetchedUser}`);
        }
    };

    return (
        <div className="users" onClick={handleSendMessage}>
            <span className="users_details">
                <img
                    src={
                        profilePicture.length > 0
                            ? `${profilePicture}`
                            : userimg
                    }
                    alt=""
                />
                <h4>
                    {firstname} {lastname}
                </h4>
            </span>
            <span>
                {status === "user" ? (
                    <small>Your account</small>
                ) : status === "new" ? (
                    <Tooltip title="Send friend request">
                        <PersonAddIcon
                            className="users_add"
                            onClick={() => sendFriendRequest(fetchedUser, user)}
                        />
                    </Tooltip>
                ) : status === "sent" ? (
                    <Tooltip title="Cancel sent request">
                        <PersonAddDisabledIcon
                            className="users_reject"
                            onClick={() => cancelRequest(fetchedUser, user)}
                        />
                    </Tooltip>
                ) : status === "received" ? (
                    <>
                        <Tooltip title="Accept request">
                            <PersonAddIcon
                                className="users_add"
                                onClick={() => {
                                    acceptRequest(fetchedUser, user);
                                }}
                            />
                        </Tooltip>{" "}
                        <Tooltip title="Cancel Request">
                            <PersonAddDisabledIcon
                                className="users_reject"
                                onClick={() => cancelRequest(user, fetchedUser)}
                            />
                        </Tooltip>
                    </>
                ) : (
                    <Tooltip title="Send Message">
                        <ChatIcon className="users_sendMessage" />
                    </Tooltip>
                )}
            </span>
        </div>
    );
};
