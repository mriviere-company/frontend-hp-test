import {useState, useEffect} from 'react';
import axios from 'axios';
import Link from "next/link";
import OrderItems from '../components/OrderItems';
import '../app/styles/order.css';

export default function NewOrder() {
    const [needBy, setNeedBy] = useState('');
    const [items, setItems] = useState([{product_id: '', quantity: ''}]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + '/api/products', {
                    headers: {
                        'API_KEY': process.env.NEXT_PUBLIC_API_KEY
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching products', err);
            }
        };
        fetchProducts();
    }, []);

    const addItem = () => {
        setItems([...items, {product_id: '', quantity: ''}]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

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

            await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + '/api/order', dataToSend, {
                headers: {
                    'API_KEY': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            setSuccess('Order created successfully!');
            setNeedBy('');
            setItems([{product_id: '', quantity: ''}]);


        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error creating order');
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
            <h1>Create a New Order</h1>
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
                buttonText="Create Order"
            />
        </div>
    );
}
