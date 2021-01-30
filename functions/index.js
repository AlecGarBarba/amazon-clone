const functions = require('firebase-functions');
const express = require('express');
const cors = require ('cors');
const stripe = require('stripe')('sk_test_51HgifMEysDRGA73lez6850ZBizKmksECufW9nTbZ0ySuuOuoaUQa9f5sjzM9CudLDst24Wq5n7dcQizmFhZyulKS00MTkFlpD9');

//API

// App config
const app = express();

//middlewares
app.use(cors({ origin: true}));
app.use(express.json());
//API routes
// //Post
app.post('/payments/create', async (req,res)=>{
    const total = req.query.total;

    console.log('Payment request Recieved for this amount: >>>' +total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, //This is in subints of the currency
        currency: "usd", //or mxn for mexican thingys (i think)
    }); 
    //201 is OK, something was created.
    res.status(201).send({
        clientSecret: paymentIntent.client_secret,

    })

})


app.get('/',(req,res)=>{
    res.status(200).send('hello world');
});

//Listen cmd


exports.api = functions.https.onRequest(app);

//example endpoint:

//http://localhost:5001/clone-app-5d8a4/us-central1/api

//deploy: firebase deploy --only functions