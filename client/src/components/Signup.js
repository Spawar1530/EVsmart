import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../fetchingData/api_calls";

const Signup = () => {
  const [values, setValues] = useState({
    firstname: "Vardaan",
    lastname: "Magon",
    email: "vardaanmagon@yahoo.com",
    phone: "9999640326",
    password: "hellohello",
    error: "",
    success: false,
  });

  const { firstname, lastname, email, phone, password, error, success } = values;

  const handleChange = (firstname) => (event) => {
    setValues({ ...values, error: false, [firstname]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ firstname, lastname, email, phone, password })
    .then((data) => {
      const details = data.json();  
      if (!data.ok) {
        console.log(details);
        setValues({ ...values, error: data.status, success: false });
      } else {
        setValues({
          ...values,
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          error: "",
          success: true,
        });
        console.log("SignUp Successfully");
      }
    });
  };

  const signUpForm = () => (
    <form>
      <h3>Sign Up</h3>

      <div className="form-group">
        <label>First name</label>
        <input
          onChange={handleChange("firstname")}
          type="text"
          className="form-control"
          placeholder="First name"
          value={firstname}
        />
      </div>

      <div className="form-group">
        <label>Last name</label>
        <input
          onChange={handleChange("lastname")}
          type="text"
          className="form-control"
          placeholder="Last name"
          value={lastname}
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          onChange={handleChange("phone")}
          type="number"
          className="form-control"
          placeholder="Enter phone number"
          value={phone}
        />
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
        />
      </div>

      <button
        onClick={clickSubmit}
        type="submit"
        className="btn btn-primary btn-block"
      >
        Sign Up
      </button>
      <p className="forgot-password text-right">
        Already registered{" "}
        <Link className="nav-link" to={"/sign-in"}>
          sign in?
        </Link>
      </p>
    </form>
  );
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      New account is created. Please <Link to="/signin">Signin</Link>
    </div>
  );
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  return (
    <div>
      {showSuccess()}
      {showError()}
      {signUpForm()}
    </div>
  );
};

export default Signup;
