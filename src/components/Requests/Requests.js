import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Requests-styles.css";
import { database } from "../../Firebase";
import { ref as dbref, onValue } from "firebase/database";
import { useStateValue } from "../../StateProvider";
import { Users } from "../Users/Users";

export const Requests = () => {
    const [{ user }] = useStateValue();
    const history = useHistory();
    if (!user) {
        history.push("/login");
    }
    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    const [selectedField, setSelectedField] = useState("1");

    useEffect(() => {
        const friendRef = dbref(database, "friends/" + user + "/");
        onValue(friendRef, (snapshot) => {
            const data = snapshot.val();
            const tempArray = [];
            if (data !== null) {
                for (let key in data) {
                    tempArray.push(key);
                }
            }
            setFriends(tempArray);
        });

        const sentRequestRef = dbref(database, "sentRequests/" + user + "/");
        onValue(sentRequestRef, (snapshot) => {
            const data = snapshot.val();
            const tempArray = [];
            if (data !== null) {
                for (let key in data) {
                    tempArray.push(key);
                }
            }
            setSentRequests(tempArray);
        });

        const receivedRequestRef = dbref(
            database,
            "receivedRequests/" + user + "/",
        );
        onValue(receivedRequestRef, (snapshot) => {
            const data = snapshot.val();
            const tempArray = [];
            if (data !== null) {
                for (let key in data) {
                    tempArray.push(key);
                }
            }
            setReceivedRequests(tempArray);
        });
    }, [user]);

    return (
        <div className="requests_main">
            <div className="requests">
                <h3>Requests and Friends</h3>
                <div className="requests_area">
                    <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        <option value={1}>Friends</option>
                        <option value={2}>Sent Requests</option>
                        <option value={3}>Received Requests</option>
                    </select>
                    <div className="requests_data">
                        <div
                            className={
                                selectedField === "1"
                                    ? "requests_type"
                                    : "requests_type requests_hide"
                            }
                        >
                            <h3>Friends</h3>
                            <div className="requests_div">
                                {friends.map((friend) => (
                                    <Users
                                        key={`${friend}`}
                                        fetchedUser={friend}
                                        check={false}
                                        userStatus="friend"
                                    />
                                ))}
                                {friends.length === 0 ? (
                                    <small>No friends yet!</small>
                                ) : null}
                            </div>
                        </div>
                        <div
                            className={
                                selectedField === "2"
                                    ? "requests_type"
                                    : "requests_type requests_hide"
                            }
                        >
                            <h3>Sent Requests</h3>
                            <div className="requests_div">
                                {sentRequests.map((sentRequest) => (
                                    <Users
                                        key={sentRequest}
                                        fetchedUser={sentRequest}
                                        check={false}
                                        userStatus="sent"
                                    />
                                ))}
                                {sentRequests.length === 0 ? (
                                    <small>
                                        You haven't sent any requests yet!
                                    </small>
                                ) : null}
                            </div>
                        </div>
                        <div
                            className={
                                selectedField === "3"
                                    ? "requests_type"
                                    : "requests_type requests_hide"
                            }
                        >
                            <h3>Received Requests</h3>
                            <div className="requests_div">
                                {receivedRequests.map((receivedRequest) => (
                                    <Users
                                        fetchedUser={receivedRequest}
                                        check={false}
                                        userStatus="received"
                                    />
                                ))}
                                {receivedRequests.length === 0 ? (
                                    <small>No received requests yet!</small>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
