import {useState, useEffect} from 'react';
import api from '../utils/axios';
import Link from "next/link";
import '../app/styles/schedule.css';

export default function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/schedule', {
            headers: {
                'API_KEY': process.env.NEXT_PUBLIC_API_KEY
            }
        }).then(response => {
            setSchedule(response.data);
            setLoading(false);
        }).catch(err => {
                setError('The backend is offline for now...' + err.message);
                setLoading(false);
            });
    }, []);

    function formatTime(minutes) {
        const MINUTES_IN_AN_HOUR = 60;
        const HOURS_IN_A_DAY = 24;
        const DAYS_IN_A_MONTH = 30;

        let remainingMinutes = minutes;
        const months = Math.floor(remainingMinutes / (MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY * DAYS_IN_A_MONTH));
        remainingMinutes %= MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY * DAYS_IN_A_MONTH;

        const days = Math.floor(remainingMinutes / (MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY));
        remainingMinutes %= MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY;

        const hours = Math.floor(remainingMinutes / MINUTES_IN_AN_HOUR);
        remainingMinutes %= MINUTES_IN_AN_HOUR;

        const mins = Math.floor(remainingMinutes);
        const seconds = Math.round((remainingMinutes - mins) * 60);

        let result = '';
        if (months > 0) result += `${months} month${months > 1 ? 's' : ''}, `;
        if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
        if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
        if (mins > 0) result += `${mins} minute${mins > 1 ? 's' : ''}, `;
        if (seconds > 0) result += `${seconds} second${seconds > 1 ? 's' : ''}`;

        return result.trim().replace(/,\s*$/, '');
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="page-container">
                <Link href="/new-order">
                    <span className="nav-link">Create New Order</span>
                </Link>
                <Link href="/">
                    <span className="nav-link">Orders</span>
                </Link>
            </div>
            <h1>Schedule of production</h1>
            <ul className="schedule-list">
                {schedule.map((order, index) => {
                    const endTime = new Date(order.end_time);
                    const needBy = new Date(order.need_by);

                    const needByStyle = endTime > needBy ? "red-text" : "green-text";

                    return (
                        <li key={index}>
                            <p>Order ID: {order.order_id}</p>
                            <p>Product : {order.product_name}</p>
                            <p>Quantity : {order.quantity.toLocaleString()}</p>
                            <p>Start: {order.start_time}</p>
                            <p>End: {order.end_time}</p>
                            <p className={needByStyle}>Need by: {order.need_by}</p>
                            <p>Time needed: {formatTime(order.production_time)}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}