import React, { useEffect, useState, useRef, useMemo } from "react";
import "./Chat-styles.css";
import userimg from "../../assets/userimg.png";
import {
    ref as dbref,
    onValue,
    push,
    set,
    onChildAdded,
} from "firebase/database";
import { database } from "../../Firebase";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import SendIcon from "@material-ui/icons/Send";
import { useStateValue } from "../../StateProvider";
import { PermPhoneMsg } from "@material-ui/icons";

const Chat = ({ passedUser }) => {
    const [{ user }] = useStateValue();
    const history = useHistory();
    if (!user) {
        history.push("/login");
    }
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [message, setMessage] = useState("");
    const messageChatRef = useRef(null);
    const messages = [];

    const getMessages = () => {
        const chatRef = dbref(database, "chats/" + user + "/" + passedUser);
        onChildAdded(chatRef, (snapshot) => {
            const data = snapshot.val();
            messages.push(data);
        });
    };

    useEffect(() => {
        const userRef = dbref(database, "users/" + passedUser);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setProfilePicture(data.profilePicture);
        });
    }, [passedUser]);

    useEffect(() => {
        messageChatRef.current.scrollIntoView();
    }, [messages]);

    const sendMessage = () => {
        const userMessage = message;
        setMessage("");
        if (userMessage.length > 0) {
            const date = new Date();

            const chatRef = dbref(database, "chats/" + passedUser + "/" + user);

            const newChatFirstUser = push(chatRef);
            set(newChatFirstUser, {
                message: userMessage,
                time: date.getTime(),
                from: user,
                to: passedUser,
            });

            const seconduserChatRef = dbref(
                database,
                "chats/" + user + "/" + passedUser,
            );
            const newChat = push(seconduserChatRef);
            set(newChat, {
                message: userMessage,
                time: date.getTime(),
                from: user,
                to: passedUser,
            });
        }
    };
    getMessages();
    return (
        <div className="chat">
            <div className="chat_view">
                <div className="chat_header">
                    <div className="chat_userDetails">
                        <img
                            src={
                                profilePicture.length > 0
                                    ? `${profilePicture}`
                                    : userimg
                            }
                            alt=""
                        />
                        <h5>
                            {firstname} {lastname}
                        </h5>
                    </div>
                    <ListIcon className="chat_menu" />
                </div>
                <div className="chat_messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.time}
                            className={
                                msg.from === user ? "sender" : "receiver"
                            }
                        >
                            <p>{msg.message}</p>
                        </div>
                    ))}

                    <div ref={messageChatRef}></div>
                </div>

                <div className="chat_enterMeaasge">
                    <div className="chat_messageDiv">
                        <textarea
                            spellCheck={false}
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <Tooltip title="Send">
                        <SendIcon
                            className="chat_sendButton"
                            onClick={sendMessage}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default Chat;
