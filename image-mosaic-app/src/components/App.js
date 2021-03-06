import React from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Account from "./Account";
import CreateMosaic from "./CreateMosaic";
import Navigation from "./Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import InProgress from "./InProgress";
import About from "./About";
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <Link to="/">
                            <h1 id="appTitle">Image Mosaic Creator</h1>
                        </Link>
                        <Navigation />
                    </header>
                    <footer>
                        <p>
                            Credit: This website's photo library is comprised of
                            images from{" "}
                        </p>
                        <a href="https://www.pexels.com/api/">Pexels API</a>
                    </footer>
                </div>
                <Route exact path="/" component={CreateMosaic} />
                {/* <PrivateRoute path="/home" component={} /> */}
                <PrivateRoute path="/account" component={Account} />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/inprogress" component={InProgress} />
                <Route path="/about" component={About} />
            </Router>
        </AuthProvider>
    );
}

export default App;
