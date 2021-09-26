import "./App.css";
import { Navbar } from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Profile } from "./components/Profile/Profile";
import { SignUp } from "./components/SignUp/SignUp";
import { Login } from "./components/Login/Login";
import { Home } from "./Home";
import { onAuthStateChanged } from "firebase/auth";
import { useStateValue } from "./StateProvider";
import { useEffect, useState } from "react";
import { auth } from "./Firebase";
import { Loading } from "./components/Loading/Loading";
import { Requests } from "./components/Requests/Requests";

function App() {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                dispatch({
                    type: "SET_USER",
                    uid: uid,
                });
                setLoading(false);
            } else {
                dispatch({
                    type: "REMOVE_USER",
                });
                setLoading(false);
            }
        });
    }, [dispatch]);

    return (
        <Router>
            {!loading ? (
                <div className="app">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/profile">
                            <Navbar />
                            <Profile />
                        </Route>
                        <Route path="/signup">
                            <SignUp />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/friends">
                            <Navbar />
                            <Requests />
                        </Route>
                        <Route exact path="/:userId">
                            <Home />
                        </Route>
                    </Switch>
                </div>
            ) : (
                <div className="app_loading">
                    <Loading />
                </div>
            )}
        </Router>
    );
}

export default App;
