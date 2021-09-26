import { database, storage, auth } from "./Firebase";
import { ref as dbref, update } from "firebase/database";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    updatePassword,
    EmailAuthProvider,
    signInWithCredential,
    signOut,
} from "firebase/auth";

const validateFields = (firstname, lastname, setLoading, setError) => {
    if (firstname.length === 0 || lastname.length === 0) {
        setLoading(false);
        setError("Both firstname and last name are required");
        return false;
    }
    return true;
};

const validatePassword = (newPassword, reNewPassword, setLoading, setError) => {
    if (newPassword.length === 0 || reNewPassword.lastname === 0) {
        setLoading(false);
        setError("Please fill in both fields");
        return false;
    }

    if (newPassword !== reNewPassword) {
        setLoading(false);
        setError("Password and re-entered password must be same");
        return false;
    }

    if (newPassword.length < 6) {
        setLoading(false);
        setError("Password should be of minimum 6 characters");
        return false;
    }
    return true;
};

export const upDateName = (
    e,
    user,
    firstname,
    lastname,
    setLoading,
    setError,
) => {
    e.preventDefault();
    setLoading(true);
    if (validateFields(firstname, lastname, setLoading, setError)) {
        setError(null);
        update(dbref(database), {
            ["/users/" + user + "/firstname"]: firstname,
            ["/users/" + user + "/lastname"]: lastname,
        })
            .then(() => setLoading(false))
            .catch((error) => {
                setLoading(false);
                setError(error.message);
                console.log(error);
            });
    }
};

export const handleImageAsFile = (e, setImageAsFile) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
};

export const handleFireBaseUpload = (
    e,
    user,
    setLoading,
    imageAsFile,
    setError,
) => {
    e.preventDefault();
    setLoading(true);
    // async magic goes here...
    if (imageAsFile === "") {
        setError(`not an image, the image file is a ${typeof imageAsFile}`);
        setLoading(false);
        return;
    }
    setError(null);
    const metadata = {
        contentType: "image/jpeg",
    };
    const storageRef = ref(storage, "profilepictures/" + user + ".jpg");
    const uploadTask = uploadBytesResumable(storageRef, imageAsFile, metadata);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            switch (snapshot.state) {
                case "paused":
                    break;
                case "running":
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case "storage/unauthorized":
                    setError(error.message);
                    break;
                case "storage/canceled":
                    setError(error.message);
                    break;
                case "storage/unknown":
                    setError(error.message);
                    break;
            }
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                update(dbref(database), {
                    ["/users/" + user + "/profilePicture"]: downloadURL,
                })
                    .then(() => setLoading(false))
                    .catch((error) => setError(error.message));
            });
        },
    );
};

export const handleChangeNewPassword = (
    email,
    oldPassword,
    newPassword,
    reNewPassword,
    setLoading,
    setError,
    history,
) => {
    setLoading(true);
    if (validatePassword(newPassword, reNewPassword, setLoading, setError)) {
        setError(null);
        const user = auth.currentUser;
        const authCredential = EmailAuthProvider.credential(email, oldPassword);
        signInWithCredential(auth, authCredential)
            .then((c) => {
                updatePassword(user, newPassword)
                    .then(() => {
                        setLoading(false);
                        setError(null);
                        signOut(auth);
                        history.push("/login");
                    })
                    .catch((error) => {
                        setLoading(false);
                        setError(error.message);
                    });
            })
            .catch((error) => {
                setLoading(false);
                setError(error.message);
            });
    }
};
