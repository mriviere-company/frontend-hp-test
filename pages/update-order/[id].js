import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import Link from "next/link";
import OrderItems from '../../components/OrderItems';
import '../../app/styles/order.css';

export default function Id() {
    const [needBy, setNeedBy] = useState('');
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + `/api/get-order/${id}`, {
                headers: {
                    'API_KEY': process.env.NEXT_PUBLIC_API_KEY
                }
            }).then(response => {
                const order = response.data;
                setNeedBy(order.need_by);
                if (Array.isArray(order.order_items)) {
                    setItems(order.order_items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                    })));
                } else {
                    setItems([]);
                }
                setLoading(false);
            })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        router.push('/orders');
                    } else {
                        setError('Error fetching order details');
                    }
                });
        }

        axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + '/api/products', {
            headers: {
                'API_KEY': process.env.NEXT_PUBLIC_API_KEY
            }
        }).then(response => {
            setProducts(response.data);
        })
            .catch(err => {
                setError('Error fetching products', err);
            });
    }, [id]);


    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === 'product_id' && value) {
            const selectedProduct = products.find(product => product.id === Number(value));
            const selectedProductType = selectedProduct ? selectedProduct.type : null;

            if (selectedProductType) {
                const existingProductType = items
                    .map(item => {
                        const product = products.find(p => p.id === Number(item.product_id));
                        return product ? product.type : null;
                    })
                    .find(type => type !== null);

                if (existingProductType && existingProductType !== selectedProductType) {
                    newItems[index].error = `Product type mismatch. Current type is ${existingProductType}.`;
                } else {
                    newItems[index].error = null;
                }
            }
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {product_id: '', quantity: ''}]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = [];

        setError(null);
        setSuccess(null);

        const selectedDate = new Date(needBy);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            formErrors.push('Date must be a date in the future.');
        }

        const invalidItem = items.find(item => item.quantity <= 0 || isNaN(item.quantity));
        if (invalidItem) {
            formErrors.push('All quantities must be greater than or equal to 1.');
        }

        const invalidProduct = items.find(item => item.product_id < 1 || item.product_id > 6);
        if (invalidProduct) {
            formErrors.push('Product ID must be in the list.');
        }

        const productTypes = items
            .map(item => {
                const product = products.find(p => p.id === Number(item.product_id));
                return product ? product.type : null;
            })
            .filter(type => type !== null);

        if (new Set(productTypes).size > 1) {
            formErrors.push('All items in an order must have the same product type.');
        }

        if (formErrors.length > 0) {
            setError(formErrors);
            return;
        }
        try {
            const dataToSend = {
                need_by: needBy,
                items: items
                    .filter(item => item.product_id && item.quantity)
                    .map(item => ({
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity)
                    }))
            };

            await axios.put(process.env.NEXT_PUBLIC_BACKEND_URI + `/api/order/${id}`, dataToSend, {
                headers: {
                    'API_KEY': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            setSuccess('Order updated successfully!');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating order');
        }
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete order ID ${id}?`)) {
            try {
                await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URI + `/api/order/${id}`, {
                    headers: {
                        'API_KEY': process.env.NEXT_PUBLIC_API_KEY
                    }
                })
                alert('Order deleted successfully!');
                await router.push('/orders');
            } catch (err) {
                setError(`Error deleting order: ${err.response ? err.response.data.message : 'Unknown error'}`);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className="page-container">
                <Link href="/orders">
                    <span className="nav-link">Get back to Orders list</span>
                </Link>
            </div>
            <div>
                <h2>Order Items</h2>
                <OrderItems
                    items={items}
                    needBy={needBy}
                    setNeedBy={setNeedBy}
                    products={products}
                    handleItemChange={handleItemChange}
                    addItem={addItem}
                    removeItem={removeItem}
                    error={error}
                    success={success}
                    handleSubmit={handleSubmit}
                    buttonText="Update Order"
                />
            </div>
            <button
                onClick={handleDelete}
                className="delete-btn">
                Delete Order
            </button>
        </div>
    );
}
