import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailId, setEmail] = useState(''); // New state for email
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
    
        if (!username || !password) {
            setError('Please fill in both fields.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:8080/public', {
                auth: {
                    username,
                    password,
                },
            });
    
            setMessage(response.data);
    
            // Clear fields after successful login
            setUsername('');
            setPassword('');
        } catch (err) {
            if (err.response) {
                setError('Login failed ');
            } else {
                setError('Login failed. Please try .');
            }
        }
    };
    
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !password || !emailId) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                password,
                emailId,
            });

            setMessage(response.data);
        } catch (err) {
            if (err.response) {
                setError('Sign-up failed: ' + err.response.data);
            } else {
                setError('Sign-up failed. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {isSignup && (
                    <div style={styles.inputGroup}>
                        <label htmlFor="emailId">Email:</label>
                        <input
                            type="emailId"
                            id="emailId"
                            value={emailId}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                )}
                {error && <div style={styles.error}>{error}</div>}
                <button type="submit" style={styles.button}>{isSignup ? 'Sign Up' : 'Login'}</button>
                {message && <div style={styles.success}>{message}</div>}
            </form>
            <div style={styles.switchContainer}>
                <button onClick={() => setIsSignup(!isSignup)} style={styles.switchButton}>
                    {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                </button>
            </div>
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
    switchContainer: {
        marginTop: '10px',
    },
    switchButton: {
        background: 'none',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0',
    },
};

export default Login;
