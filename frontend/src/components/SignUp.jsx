import React, { useState } from 'react';
import { createUser } from '../Api/api';
import {useNavigate} from 'react-router-dom'
export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const nav = useNavigate()

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, username, email, phoneNumber} = formData;
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const newUser = { username, email, password, phoneNumber };
            await createUser(newUser);
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
            });
            alert('Sign up successful');
            nav('/home')

        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Error submitting form');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <h3 className="text-2xl font-bold mb-4 text-blue-700">Sign Up</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Enter your username" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Enter your email" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Password:</label>
                        <input type="password" name="password" value={  formData.password} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Enter your password" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Confirm Password:</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1" placeholder="Confirm your password" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">Phone Number:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="input-field w-60 border m-auto my-1 p-1 border-b-2" placeholder="Enter your phone number" />
                    </div>
                    {error && <p className="text-red-500">{error}</p>} 
                    <button type="submit" className="p-2 rounded w-1/3 text-white bg-blue-700">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
