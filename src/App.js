import React, { useEffect } from 'react';
import './App.css';
import Header from './Header'
import Home from './Home'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from './Checkout'
import Login from './Login'
import { auth } from './firebase'
import { useStateValue } from './StateProvider';
import Payment from './Payment'
import Orders from './Orders'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
//@stripe/react-stripe-js //This is 
//@stripe/stripe-js


const promise = loadStripe(
  "pk_test_51HgifMEysDRGA73lNEg1jT9IMOLHKLIxe5Agu1xHarlUaYzZicg8q1rNt7Ivh4T7WCmq6ZgMVGokGJWf0gQAO8kO002GKivJnk"
)

function App() {
  const [ {}, dispatch] = useStateValue();
  useEffect(() =>{
    auth.onAuthStateChanged(authUser => {
      if(authUser){
        //The user just logged in/ the user was logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        //the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null,
        })
      }
    } )
  },[]) 
  return (
    <Router>
      <div className="App">
      

        <Switch>
          <Route path="/checkout">
            <Header />
              <Checkout  />
          </Route>
          
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/payment">
            <Header />
            <Elements stripe={promise} >
              <Payment />
            </Elements>
          </Route>

          <Route path="/orders">
            <Header />
            <Orders />
          </Route>

            {/**This must be at the end :) */}
          <Route path="/">
              <Header />
              <Home />
          </Route>
          
          

        </Switch>
        
      </div>
    </Router>
  );
}

export default App;
