import React, { useState, useEffect } from "react";
import { database } from "../../Firebase";
import { ref as dbref, onValue } from "firebase/database";
import "./Chats-styles.css";
import { useStateValue } from "../../StateProvider";
import { Users } from "../Users/Users";

export const Chats = () => {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);

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
    }, [user]);

    return (
        <div className="chats">
            <div className="chats_list">
                <h3>Messages</h3>
                {friends.map((friend) => (
                    <Users
                        showAppIcon={false}
                        key={`${friend}`}
                        fetchedUser={friend}
                        check={false}
                        userStatus="friend"
                    />
                ))}
                {friends.length === 0 ? <small>No friends yet!</small> : null}
            </div>
        </div>
    );
};
