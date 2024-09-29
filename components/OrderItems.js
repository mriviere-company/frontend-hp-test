import React from 'react';

function formatDateForInput(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    let hours = '' + d.getHours();
    let minutes = '' + d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const OrderItems = ({
                        items,
                        needBy,
                        setNeedBy,
                        products,
                        handleItemChange,
                        addItem,
                        removeItem,
                        error,
                        success,
                        handleSubmit,
                        buttonText
                    }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <label>Need By Date:</label>
                <input
                    type="datetime-local"
                    value={needBy ? formatDateForInput(needBy) : ''}
                    onChange={(e) => setNeedBy(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                />
            </div>

            <h2>Order Items</h2>
            {items.map((item, index) => (
                <div key={index} className="form-group">
                    <label>Product:</label>
                    <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>

                    {item.error && (
                        <span className="input-warning">
                            {item.error}
                        </span>
                    )}

                    <label className="quantity-label">Quantity:</label>
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        min="1"
                        className="input-field"
                    />

                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="remove-item-btn"
                        >
                            Remove Item
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addItem} className="add-item-btn">
                Add Another Item
            </button>

            <br/>

            <button type="submit" className="add-item-btn">{buttonText}</button>

            {error && Array.isArray(error) && (
                <div className="error-list">
                    <ul>
                        {error.map((errMsg, index) => (
                            <li key={index}>{errMsg}</li>
                        ))}
                    </ul>
                </div>
            )}

            {success && <p className="success-message">{success}</p>}
        </form>
    );
};

export default OrderItems;
