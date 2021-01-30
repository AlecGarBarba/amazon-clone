import React, { useState, useEffect} from 'react'
import './Payment.css'
import {useStateValue } from "./StateProvider"
import CheckoutProduct from './CheckoutProduct'
import { Link, useHistory } from "react-router-dom"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; 
import CurrencyFormat from 'react-currency-format'
import { getBasketTotal } from './reducer'
import axios from './axios'
import {db} from './firebase'

function Payment() {
    const [{ basket, user}, dispatch] = useStateValue();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);
    const history= useHistory();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        //Generate the client stripe secret which allows us to charge a customer;
        //whenever the basket changes, we need to charge something different :);

        //This is how to run an async on a useEffect
        const getClientSecret = async()=>{
            if(getBasketTotal(basket) > 0){
                    const response = await axios({
                method: 'post',
                //Stripe expects the total in a currencies subunits (if dollars, expects it in cents.)
                url: `/payments/create?total=${ Math.round(getBasketTotal(basket)*100) }` //times 100 because of cents :)
            });
            setClientSecret(response.data.clientSecret);
            }
            
        }
        if(getBasketTotal(basket) >0){
            getClientSecret();
            console.log('The secret is >>>>>>', clientSecret)
        }
        
        
    }, [basket])
    
    
    const handleChange =  (event) =>{
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }


    const handleSubmit = async(event) =>{
        //Do all the fancy Stripe stuff
        event.preventDefault();
            setProcessing(true);
            //Listen for changes in the CardElement
            //and display any errors as the customer types their card details
            
            const payload = await stripe.confirmCardPayment(clientSecret,{
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            }).then( ({paymentIntent}) =>{
                //paymentIntent = paymentConfirmation or so
                console.log(paymentIntent);
                console.log(basket);
                 db
                    .collection('users')
                    .doc(user?.uid)
                    .collection('orders')
                    .doc(paymentIntent.id)
                    .set({
                        basket: basket,
                        amount: paymentIntent.amount,
                        created: paymentIntent.created,
                    })

                setSucceeded(true);
                setError(null);
                setProcessing(false);

                dispatch({
                    type: 'EMPTY_BASKET',
                })
                history.replace('/orders')
            })
            
    }
    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>
                {/**Review Items */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review Items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {/**Show all the products */
                        basket.map(item => (
                            <CheckoutProduct 
                                id ={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}

                    </div>
                </div>
                {/**Payment methood */}
                <div className="payment__section">
                <div className="payment__title">
                        <h3>Payment method</h3>
                    </div>
                    <div className="payment__details">
                        {/**Stripe magicc */}
                        <form onSubmit ={handleSubmit}>
                            <CardElement onChange={handleChange}/>

                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value)=>(
                                        <h3>Order Total : {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>

                            {/*errors¨*/}
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
