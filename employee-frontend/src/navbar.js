
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import EmployeeList from "./employee-create";
import UpdateEmployee from "./employee-edit";

const Navbar = () => {
    // Get the username from localStorage, and fallback to a default value if not found
    const userName = localStorage.getItem("userName");

    // Handle the logout process
    const logoutMe = () => {
        localStorage.clear();
        window.location.href = '/';  // Redirect to home after logout (or to login page)
    };

    return (
        <HashRouter>
            <div className="container sticky-top">
                <nav className="navbar navbar-expand-sm navbar-dark">
                    <div className="container-fluid">
                        <img src="logo192.png" alt="logo" className="rounded-circle me-2" width={40} />
                        {/* You can use Link or just text here */}
                        <Link className="navbar-brand">Logo</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/create-employee">Employee Create</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="/update-employee"> Employee Edit</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="container mt-1 justify-content-end text-white">
                        <em>
                            {userName ? (
                                <p>
                                    {userName} - <button onClick={logoutMe} className="btn btn-sm btn-light">Logout</button>
                                </p>
                            ) : (
                                <Link to="/login" className="nav-link active fs-5">Login</Link>
                            )}
                        </em>
                    </div>
                </nav>
            </div>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create-employee" element={<EmployeeList />} />
                <Route path="/update-employee" element={<UpdateEmployee />} />
                {/* You might want to add a login route or handle redirects after logout */}
                {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
        </HashRouter>
    );
};

export default Navbar;