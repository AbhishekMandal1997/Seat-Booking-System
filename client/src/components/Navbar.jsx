import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    TrainMate
                </Link>
                <div className="space-x-6">
                    {token ? (
                        <>
                            <Link to="/booking" className="hover:text-indigo-200 transition">
                                Book Seats
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-200 transition">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;