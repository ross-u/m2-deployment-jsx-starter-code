const React = require('react');
const Layout = require('./Layout');


function Login (props) {
  return(
    <Layout title="Login Page">
      <form id="form" action="/auth/login" method="POST">
        <label>Email</label>
        <br />
        <input type="text" name="email" placeholder="Your Email" />

        <label>Password</label>
        <br />
        <input type="password" name="password" />

        <button type="submit">Login</button>
      </form>

      {
        props.errorMessage 
          ? <div className="error-message"> {props.errorMessage}</div>
          : null
      }

      <p className="account-message">
        Don't have an account? <a href="/auth/signup">Sign up</a>
      </p>
    </Layout>
  )
}


module.exports = Login;