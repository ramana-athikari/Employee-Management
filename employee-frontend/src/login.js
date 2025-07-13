import {useState} from "react";

const UserLogin = () =>{
    let [uName, pickUser] = useState("");
    let [uNameError, setEmailError] = useState("");
    let [password, pickPassword] = useState("");
    let [passwordError, setPassError] = useState("");
    let [msg, setMessage] = useState("Enter Login Details");

    const LoginCheck = (obj) =>{
        obj.preventDefault();

        uName == ""?setEmailError("Enter User Name !"):setEmailError("");
        password == ""?setPassError("Enter Password !"):setPassError("");

        if(uName !== "" && password !== ""){
            let input = {userName : uName, userPassword:password};

            let url = "http://localhost:2222/t_login";
            let postData = {
                headers:{"content-type":"application/json"},
                method:"post",
                body:JSON.stringify(input)
            }
    
            fetch(url, postData)
            .then(res=>res.json())
            .then(userInfo=>{
                setMessage(userInfo.message)
                if(userInfo.status=="PASS"){
                    localStorage.setItem("token", userInfo.id);
                    localStorage.setItem("userName", userInfo.fullname);
                    window.location.reload(); // reload the current page;
                }
            })
        }
    }

    return(
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                    <form onSubmit={LoginCheck}>
                    <div className="card">
                        <div className="card-header bg-primary">
                            <h4 className="text-center text-white"> <i className="fa fa-lock"></i> Login Page </h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-3">
                                <i className="fa-regular fa-5x fa-user"></i>
                                <p className="text-center text-danger mt-2"> {msg} </p>
                            </div>
                            <div className="mb-3">
                                <label> User Name </label>
                                <input onChange={obj=>pickUser(obj.target.value)} value={uName} type="text" className="form-control"/>
                                <small><em className="text-danger"> {uNameError} </em></small>
                            </div>
                            <div className="mb-3">
                                <label> Password </label>
                                <input onChange={obj=>pickPassword(obj.target.value)} value={password} type="password" className="form-control"/>
                                <small><em className="text-danger"> {passwordError} </em></small>
                            </div>
                        </div>
                        <div className="card-footer text-center">
                            <button className="btn btn-primary" type="submit"> Login <i className="fa fa-arrow-right"> </i> </button>
                        </div>
                    </div>
                    </form>
                </div>
                <div className="col-lg-4"></div>
            </div>
        </div>
    )
}

export default UserLogin;