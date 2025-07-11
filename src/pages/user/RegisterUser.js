import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUser } from "../../comunication/FetchUser";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({ loginValues, setLoginValues }) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        admin: "false",  // Default auf "false" setzen
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (credentials.password !== credentials.passwordConfirmation) {
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(credentials.password)) {
            setErrorMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }

        if (credentials.admin !== "true" && credentials.admin !== "false") {
            setErrorMessage("Please select a role.");
            return;
        }

        try {
            await postUser(credentials);
            setLoginValues({ userName: credentials.email, password: credentials.password });
            setCredentials(initialState);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Firstname:</label>
                            <input
                                type="text"
                                value={credentials.firstName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, firstName: e.target.value }))}
                                required
                                placeholder="Please enter your firstname *"
                            />
                        </div>
                        <div>
                            <label>Lastname:</label>
                            <input
                                type="text"
                                value={credentials.lastName}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, lastName: e.target.value }))}
                                required
                                placeholder="Please enter your lastname *"
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({ ...prevValues, email: e.target.value }))}
                                required
                                placeholder="Please enter your email"
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={credentials.admin === "true"}
                                    onChange={(e) =>
                                        setCredentials(prev => ({ ...prev, admin: e.target.checked ? "true" : "false" }))
                                    }
                                />
                                Admin role?
                            </label>
                            <p style={{ marginTop: '0.5rem' }}>
                                Selected: <strong>{credentials.admin === "true" ? 'Admin' : 'User'}</strong>
                            </p>
                        </div>
                    </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                required
                                placeholder="Please enter your pwd *"
                            />
                        </div>
                        <div>
                            <label>Password confirmation:</label>
                            <input
                                type="password"
                                value={credentials.passwordConfirmation}
                                onChange={(e) => setCredentials(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                                required
                                placeholder="Please confirm your pwd *"
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit">Register</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;