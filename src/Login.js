import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [productinfo, setProductinfo] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [hash, setHash] = useState('');
    const [txnid, setTxnid] = useState('');

    const generateTxnid = () => {
        // Generate a random transaction ID
        const randomValue = Math.random() + Date.now();
        return hash(randomValue.toString()).substring(0, 20); // Use substring instead of substr
    };
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate inputs
        if (!amount || !firstname || !email || !phone || !productinfo) {
            setError('Please fill in all mandatory fields.');
            return;
        }

        // Generate transaction ID if not provided
        const transactionId = txnid || generateTxnid();
        setTxnid(transactionId);

        // Construct the data to send for hash generation
        const hashData = {
            key: "M9pjB9",
            txnid: transactionId,
            amount: amount,
            firstname: firstname,
            email: email,
            phone: phone,
            productinfo: productinfo,
            salt: "OSjMCo9tRSKXC6Il5ZeWZwPZUelRJld9",
        };

        try {
            // Request hash from your backend
            const response = await axios.post('http://localhost:8080/api/checkout/generateHash', hashData);
            setHash(response.data.hash); // Assume the response contains the hash

            // Now submit to PayU
            const paymentResponse = await axios.post('https://test.payu.in/_payment', {
                ...hashData,
                hash: response.data.hash,
                service_provider: 'payu_paisa',
                surl: 'http://localhost/payumoney/success.php',
                furl: 'http://localhost/payumoney/failure.php',
            });

            setMessage(paymentResponse.data); // Adjust based on your API response
            // Clear fields after successful submission
            setAmount('');
            setFirstname('');
            setEmail('');
            setPhone('');
            setProductinfo('');
            setHash('');
        } catch (err) {
            if (err.response) {
                setError('Payment failed: ' + err.response.data);
            } else {
                setError('Payment failed. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>Payment Form</h2>
            <form onSubmit={handlePaymentSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="productinfo">Product Info:</label>
                    <textarea
                        id="productinfo"
                        value={productinfo}
                        onChange={(e) => setProductinfo(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <div style={styles.error}>{error}</div>}
                <button type="submit" style={styles.button}>Submit Payment</button>
                {message && <div style={styles.success}>{message}</div>}
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    inputGroup: {
        marginBottom: '15px',
        width: '100%',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
    success: {
        color: 'green',
        marginTop: '15px',
    },
};

export default PaymentForm;
