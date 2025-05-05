import { useNavigate } from 'react-router-dom';

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginValues),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Login failed");
                return;
            }

            console.log("Login success:", data);
            navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login.");
        }
    };

    return (
        <div>
            <h2>Login user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={loginValues.email}
                                onChange={(e) =>
                                    setLoginValues(prevValues => ({...prevValues, email: e.target.value}))}
                                required
                                placeholder="Please enter your email *"
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="text"
                                value={loginValues.password}
                                onChange={(e) =>
                                    setLoginValues(prevValues => ({...prevValues, password: e.target.value}))}
                                required
                                placeholder="Please enter your password *"
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginUser;