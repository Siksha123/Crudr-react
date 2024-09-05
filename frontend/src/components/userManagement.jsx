import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

const Button = ({ color = 'default', children, className = '', ...props }) => {
    const colors = {
        default: 'bg-gray-500 hover:bg-gray-700',
        green: 'bg-green-500 hover:bg-green-700',
        red: 'bg-red-500 hover:bg-red-700'
    };

    return (
        <button
            className={`text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105 ${colors[color]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, onSubmit, user, setUser }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <span className="font-medium block mb-1">Username</span>
                        <Input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <span className="font-medium block mb-1">Email</span>
                        <Input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <span className="font-medium block mb-1">Phone Number</span>
                        <Input
                            type="text"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <span className="font-medium block mb-1">Role</span>
                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Institute">Institute</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button color="red" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button color="green" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/users', {
                    withCredentials: true
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/user/user/${id}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user._id !== id));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete user');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:3000/api/v1/user/user/${editingUser._id}`, editingUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setUsers(users.map(user => user._id === response.data.data._id ? response.data.data : user));
            setEditingUser(null);
            setIsModalOpen(false);
            toast.success('User updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <table className="w-full border-separate border-spacing-2 border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Phone Number</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors text-center">
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.phoneNumber}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">
                                <Button color="green" onClick={() => handleEdit(user)} className="mr-2">
                                    Edit
                                </Button>
                                <Button color="red" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for editing user */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleUpdate}
                user={editingUser || {}}
                setUser={setEditingUser}
            />
        </div>
    );
};

export default UserManagement;
