import React, {useState, useEffect} from 'react'
import './Orders.css'

import Order from './Order'
import {db} from './firebase'
import { useStateValue} from './StateProvider'

function Orders() {
    const [{ basket, user}, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log(user)
        if(user){
            db.collection('users')
            .doc(user?.uid)
            .collection('orders')
            .orderBy('created','desc')
            .onSnapshot(snapshot =>(
                setOrders(snapshot.docs.map( (doc )=> ({
                    id: doc.id,
                    data: doc.data()
                })))
            ))
        }else{
            setOrders([]);
        }
        console.log(orders);
    }, [])
    return (
        <div className="orders">
            <div className="orders__order">
                {orders?.map(order => (
                    <Order order={order}/>
                ))}
            </div>
        </div>
    )
}

export default Orders
