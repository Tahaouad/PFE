import React, { useState } from 'react';
import { loginUser } from '../Api/api';
import { Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = formData;
        try {
            const identifiant = { username, password };
            await loginUser(identifiant);
            alert('Login successful');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Error during login');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <h3 className="text-2xl font-bold mb-4 text-blue-700">Login</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Enter your username" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Enter your password" />
                    </div>
                    {error && <p className="text-red-500">{error}</p>} 
                    <button type="submit" className="p-2 rounded w-1/3 text-white bg-blue-700">Login</button>
                    <p className="mt-4 text-sm text-center">
                        Don't have an account? <Link to="/signUp" className="text-blue-500">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
