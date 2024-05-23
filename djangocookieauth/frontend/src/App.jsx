import { React, useState } from "react";
import { useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setisAuthenticated] = useState(false);

  // const componentDidMount = () => {
  //   getSession();
  // };

  useEffect(() => {
    getSession();
  }, []);

  const getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          setisAuthenticated(true);
        } else {
          setisAuthenticated(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const whoami = () => {
    fetch("/api/whoami", {
      headers: {
        "Content-Type": "application/json",
        credentials: "same-origin",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const isResponseOk = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw Error(response.statusText);
    }
  };

  const login = (event) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"), //CSRF token
      },
      credentials: "same-origin",
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setisAuthenticated(true);
        setUsername("");
        setPassword("");
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError("Invalid username or password");
      });
  };

  const logout = () => {
    fetch("/api/logout/", {
      credentials: "same-origin",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setisAuthenticated(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <div>
                {error && <small className="text-danger">{error}</small>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <p>You Are logged in</p>
          <button className="btn btn-primary mr-2" onClick={whoami}>
            Who Am I
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </>
  );
}

export default App;
