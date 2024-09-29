import {useState, useEffect} from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../app/styles/orders.css';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + '/api/orders', {
            headers: {
                'API_KEY': process.env.NEXT_PUBLIC_API_KEY
            }
        }).then(response => {
            if (response.data.message === "No order found") {
                setOrders([]);
                setError(null);
            } else if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else {
                setOrders([]);
                setError("Unexpected response format");
            }
            setLoading(false);
        }).catch(err => {
            setError('The backend is offline for now...' + err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="link-container">
                <Link href="/new-order">
                    <span className="link">Create New Order</span>
                </Link>
                <Link href="/schedule">
                    <span className="link">Schedule</span>
                </Link>
            </div>

            <h1>Orders List</h1>
            {orders.length === 0 ? (
                <p>No order found, create a new one</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        order && (
                            <li key={order.id} className="order-list-item">
                                <p>Order ID: {order.id}</p>
                                <p>Number of Items: {order.order_items_count}</p>
                                <p>Deadline: {order.need_by}</p>
                                <Link href={`/update-order/${order.id}`}>
                                    <span className="update-link">Update Order</span>
                                </Link>
                            </li>
                        )
                    ))}
                </ul>
            )}
        </div>
    );
}
