import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUser } from "../../comunication/FetchUser";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({ loginValues, setLoginValues }) {
    const navigate = useNavigate();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    };

    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!executeRecaptcha) {
            setErrorMessage("ReCAPTCHA not yet available.");
            return;
        }

        if (credentials.password !== credentials.passwordConfirmation) {
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        try {
            const token = await executeRecaptcha('register_user');
            console.log("Captcha token:", token); // Debug check

            const payload = {
                ...credentials,
                captchaToken: token
            };

            await postUser(payload);
            setLoginValues({ userName: credentials.email, password: credentials.password });
            setCredentials(initialState);
            navigate('/');
        } catch (error) {
            console.error('Failed to register user:', error.message);
            setErrorMessage(error.message || 'Registration failed.');
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
                                onChange={(e) => setCredentials(prev => ({ ...prev, firstName: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label>Lastname:</label>
                            <input
                                type="text"
                                value={credentials.lastName}
                                onChange={(e) => setCredentials(prev => ({ ...prev, lastName: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
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
                            />
                        </div>
                        <div>
                            <label>Password confirmation:</label>
                            <input
                                type="password"
                                value={credentials.passwordConfirmation}
                                onChange={(e) => setCredentials(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                                required
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