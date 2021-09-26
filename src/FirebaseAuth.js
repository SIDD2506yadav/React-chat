import { database, auth } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";

const validateLoginFields = (email, password, setLoading, setError) => {
    if (email.length === 0 || password.length === 0) {
        setLoading(false);
        setError("Please fill all the fields");
        return false;
    }
    return true;
};

const validateSignUpFields = (
    email,
    password,
    rePassword,
    setLoading,
    setError,
    firstname,
    lastname,
) => {
    var emailFormat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (
        firstname.length === 0 ||
        lastname.length === 0 ||
        email.length === 0 ||
        password.length === 0 ||
        rePassword.length === 0
    ) {
        setLoading(false);
        setError("Please fill all the fields");
        return false;
    }
    if (password !== rePassword) {
        setLoading(false);
        setError("!Password and re-entered must be same.");
        return false;
    }

    if (!email.match(emailFormat)) {
        setLoading(false);
        setError("!Invalid email address.");
        return false;
    }

    if (password.length < 6) {
        setLoading(false);
        setError("!Password must be atleast 6 characters long.");
        return false;
    }
    return true;
};

export const signUpUser = (
    email,
    password,
    rePassword,
    setLoading,
    setError,
    firstname,
    lastname,
    history,
) => {
    setLoading(true);
    if (
        validateSignUpFields(
            email,
            password,
            rePassword,
            setLoading,
            setError,
            firstname,
            lastname,
        )
    ) {
        setError(null);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                set(dbRef(database, "users/" + user.uid), {
                    firstname,
                    lastname,
                    email,
                    profilePicture: "",
                });
                set(dbRef(database, `usernames/${user.uid}`), {
                    name: `${firstname.toLowerCase()}`,
                });
                setLoading(false);
                history.push("/profile");
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error.message;
                setError(errorMessage);
                // ..
            });
    }
};

export const loginUser = (email, password, setLoading, setError, history) => {
    setLoading(true);
    if (validateLoginFields(email, password, setLoading, setError)) {
        setError(null);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setLoading(false);
                history.push("/");
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }
};
