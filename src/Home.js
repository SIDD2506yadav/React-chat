import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Chats } from "./components/Chats/Chats";
import Chat from "./components/Chat/Chat";
import { useStateValue } from "./StateProvider";
import chat from "./assets/chat.png";

export const Home = () => {
    const [{ user }] = useStateValue();
    const history = useHistory();
    if (!user) {
        history.push("/login");
    }

    const { userId } = useParams();
    console.log(userId);
    return (
        <>
            <Navbar />
            <div className="home">
                {userId !== undefined ? (
                    <>
                        <Chats /> <Chat passedUser={userId} />
                    </>
                ) : (
                    <>
                        <Chats />
                        <div className="home_whitespace">
                            <img src={chat} alt="" />
                            <h2>React Chat</h2>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
