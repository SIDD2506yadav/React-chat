import { database } from "./Firebase";
import { ref as dbref, set } from "firebase/database";

const sendFriendRequest = (fetchedUser, user) => {
    set(dbref(database, "sentRequests/" + user + "/" + fetchedUser), {
        [`${fetchedUser}`]: "yes",
    });
    set(dbref(database, "receivedRequests/" + fetchedUser + "/" + user), {
        [`${user}`]: "yes",
    });
};

const cancelRequest = (fetchedUser, user) => {
    set(dbref(database, "sentRequests/" + user + "/" + fetchedUser), {
        [`${fetchedUser}`]: null,
    });
    set(dbref(database, "receivedRequests/" + fetchedUser + "/" + user), {
        [`${user}`]: null,
    });
};

const acceptRequest = (fetchedUser, user) => {
    cancelRequest(user, fetchedUser);
    set(dbref(database, "friends/" + user + "/" + fetchedUser), {
        friends: "yes",
    });
    set(dbref(database, "friends/" + fetchedUser + "/" + user), {
        friends: "yes",
    });
};

export { sendFriendRequest, cancelRequest, acceptRequest };
