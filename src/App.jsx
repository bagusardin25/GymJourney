import React, { useState, useEffect, useRef } from 'react';
import { authAPI, classesAPI, bookingsAPI, paymentsAPI, testimonialsAPI } from './services/api';

// // --- MOCK DATA ---
// // In a real application, this data would come from your backend API
// const mockData = {
//   classes: [
//     { id: 1, name: 'Ashtanga Yoga', instructor: 'Sarah Lee', time: 'Mon 6:00 AM - 7:00 AM', spots: 15, booked: 12, category: 'Yoga', description: '' },
//     { id: 2, name: 'HIIT Circuit', instructor: 'John David', time: 'Mon 7:00 PM - 8:00 PM', spots: 20, booked: 20, category: 'Cardio', description: '' },
//     { id: 3, name: 'Powerlifting 101', instructor: 'Mike Ross', time: 'Tue 5:00 PM - 6:30 PM', spots: 10, booked: 7, category: 'Strength', description: '' },
//     { id: 4, name: 'Zumba Dance', instructor: 'Maria Garcia', time: 'Wed 6:30 PM - 7:30 PM', spots: 25, booked: 18, category: 'Cardio', description: '' },
//     { id: 5, name: 'Indoor Cycling', instructor: 'Chris Allen', time: 'Thu 7:00 AM - 7:45 AM', spots: 18, booked: 18, category: 'Cardio', description: '' },
//     { id: 6, name: 'Advanced Pilates', instructor: 'Emily Chen', time: 'Fri 12:00 PM - 1:00 PM', spots: 12, booked: 5, category: 'Flexibility', description: '' },
//     { id: 7, name: 'Boxing Basics', instructor: 'David Rodriguez', time: 'Sat 11:00 AM - 12:00 PM', spots: 16, booked: 14, category: 'Strength', description: '' },
//     { id: 8, name: 'Restorative Yoga', instructor: 'Sarah Lee', time: 'Sun 4:00 PM - 5:00 PM', spots: 15, booked: 9, category: 'Yoga', description: '' },
//   ],
//   trainers: [
//     { id: 1, name: 'Sarah Lee', specialty: 'Yoga & Flexibility', bio: 'With over 10 years of experience in vinyasa and ashtanga yoga, Sarah helps members find balance and peace.', image: 'https://placehold.co/400x400/orange/white?text=SL' },
//     { id: 2, name: 'John David', specialty: 'HIIT & Cardio', bio: 'John is a certified personal trainer known for his high-energy, motivational classes that push you to your limits.', image: 'https://placehold.co/400x400/orange/white?text=JD' },
//     { id: 3, name: 'Mike Ross', specialty: 'Strength & Powerlifting', bio: 'A competitive powerlifter, Mike specializes in proper form and strength progression for all fitness levels.', image: 'https://placehold.co/400x400/orange/white?text=MR' },
//     { id: 4, name: 'Maria Garcia', specialty: 'Dance & Zumba', bio: 'Maria brings the party to the gym with her infectious energy and fun-filled Zumba routines.', image: 'https://placehold.co/400x400/orange/white?text=MG' },
//   ],
//   testimonials: [
//     { id: 1, name: 'Jessica M.', quote: 'SetiaKawan changed my life! The trainers are so supportive and the community is amazing. I\'ve never felt stronger or more confident.', rating: 5, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=JM' },
//     { id: 2, name: 'David L.', quote: 'The variety of classes keeps me engaged. I can do HIIT one day and relaxing yoga the next. The facilities are always clean and top-notch.', rating: 5, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=DL' },
//     { id: 3, name: 'Samantha B.', quote: 'As a beginner, I was intimidated, but the "Powerlifting 101" class was perfect. Mike is a fantastic coach who prioritizes safety and form.', rating: 4, image: 'https://placehold.co/60x60/1F2937/FFFFFF?text=SB' },
//   ],
//   members: [
//       { id: 101, name: 'Bagus Ardin', email: 'member@test.com', membership: 'Gold', status: 'Active', joinDate: '2023-05-15' },
//       { id: 102, name: 'Ben Carter', email: 'ben.c@test.com', membership: 'Silver', status: 'Active', joinDate: '2023-08-20' },
//       { id: 103, name: 'Chloe Davis', email: 'chloe.d@test.com', membership: 'Bronze', status: 'Inactive', joinDate: '2022-11-10' },
//   ],
//   paymentHistory: [
//       { id: 1, date: '2024-07-01', amount: 99.00, plan: 'Gold Membership', status: 'Paid' },
//       { id: 2, date: '2024-06-01', amount: 99.00, plan: 'Gold Membership', status: 'Paid' },
//       { id: 3, date: '2024-05-01', amount: 99.00, plan: 'Gold Membership', status: 'Paid' },
//   ],
//   bookedClasses: [
//       { id: 2, name: 'HIIT Circuit', instructor: 'John David', time: 'Mon 7:00 PM' },
//       { id: 7, name: 'Boxing Basics', instructor: 'David Rodriguez', time: 'Sat 11:00 AM' },
//   ]
// };

// --- GEMINI API SIMULATION ---
const callGeminiAPI = async (prompt) => {
    console.log("Calling Gemini API with prompt:", prompt);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (prompt.includes("workout plan")) {
        return `
Here is a sample workout plan based on your goals:

Monday: Upper Body Strength
* Bench Press: 3 sets of 8-10 reps
* Pull-ups: 3 sets to failure
* Dumbbell Shoulder Press: 3 sets of 10-12 reps
* Barbell Rows: 3 sets of 8-10 reps

**Wednesday: Lower Body Power**
* Squats: 4 sets of 6-8 reps
* Deadlifts: 3 sets of 5 reps
* Leg Press: 3 sets of 12-15 reps
* Calf Raises: 4 sets of 15 reps

**Friday: Full Body Conditioning**
* Kettlebell Swings: 4 sets of 20 reps
* Box Jumps: 3 sets of 10 reps
* Battle Ropes: 3 sets of 30 seconds
* Plank: 3 sets, hold as long as possible
        `;
    }
    if (prompt.includes("meal plan")) {
        return `
Here is a sample one-day meal plan to complement your workout:

* **Breakfast:** Scrambled eggs with spinach and a side of oatmeal.
* **Lunch:** Grilled chicken salad with mixed greens, vegetables, and a light vinaigrette.
* **Dinner:** Baked salmon with quinoa and steamed broccoli.
* **Snacks:** Greek yogurt, almonds, or a protein shake.
        `;
    }
    if (prompt.includes("class description")) {
        return "Get ready to sweat and have fun in this high-energy class! Led by our amazing instructor, this session is perfect for all fitness levels. Join us and push your limits!";
    }

    return "Sorry, I couldn't generate a response for that request.";
};

// --- AUTH MOCK DATA ---
const DEFAULT_USERS = [
    {
        id: 'admin-1',
        name: 'Admin SetiaKawan',
        email: 'admin@setiakawan.com',
        password: 'admin123',
        role: 'admin',
        membership: 'Platinum'
    },
    {
        id: 'member-1',
        name: 'Member SetiaKawan',
        email: 'member@setiakawan.com',
        password: 'member123',
        role: 'member',
        membership: 'Gold'
    },
    {
        id: 'member-2',
        name: 'Yoga Enthusiast',
        email: 'yoga@setiakawan.com',
        password: 'yoga123',
        role: 'member',
        membership: 'Silver'
    }
];

const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
};

// --- HELPER COMPONENTS ---

const GeminiLoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-300">Generating with AI...</p>
    </div>
);

const Notification = ({ message, type, onDismiss }) => {
    if (!message) return null;
    const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 flex items-center max-w-sm';
    const typeClasses = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [onDismiss]);
    
    return (
        <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-800'} animate-fadeIn`}>
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-4 text-xl font-bold hover:text-gray-300 transition-colors">&times;</button>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className={`bg-gray-800 rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} m-4 relative text-white animate-scaleIn`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors">&times;</button>
                <h3 className="text-xl font-bold mb-4 text-orange-500">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const RatingStars = ({ rating, maxRating = 5 }) => {
    return (
        <div className="flex">
            {[...Array(maxRating)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// --- LAYOUT COMPONENTS ---

const Header = ({ setPage, user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', page: 'home' },
        { name: 'About', page: 'about' },
        { name: 'Schedule', page: 'schedule' },
        { name: 'Trainers', page: 'trainers' },
        { name: 'Pricing', page: 'pricing' },
        { name: 'Contact', page: 'contact' },
    ];

    return (
        <header className="bg-gray-900/90 backdrop-blur-sm text-white sticky top-0 z-30 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => setPage('home')} className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors">
                            Setia Kawan
                        </button>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <button 
                                key={link.page} 
                                onClick={() => setPage(link.page)} 
                                className="hover:text-orange-500 transition-colors duration-300 py-2"
                            >
                                {link.name}
                            </button>
                        ))}
                    </nav>
                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-300 hidden lg:block">
                                    {user?.name ? `Selamat Datang, ${user.name}` : 'Selamat Datang'}
                                </div>
                                <button onClick={() => setPage('dashboard')} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">Dashboard</button>
                                <button onClick={onLogout} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">Logout</button>
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <button onClick={() => setPage('login')} className="px-4 py-2 text-white rounded-md hover:bg-gray-700 transition-colors">Login</button>
                                <button onClick={() => setPage('register')} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">Join Now</button>
                            </div>  
                        )}
                    </div>
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-white focus:outline-none p-2"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 animate-fadeIn">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <button 
                                key={link.page} 
                                onClick={() => { setPage(link.page); setIsMenuOpen(false); }} 
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="border-t border-gray-700 pt-4 mt-2">
                            {user ? (
                                <>
                                    <button 
                                        onClick={() => { setPage('dashboard'); setIsMenuOpen(false); }} 
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { setPage('login'); setIsMenuOpen(false); }} 
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => { setPage('register'); setIsMenuOpen(false); }} 
                                        className="block w-full text-left px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition-colors"
                                    >
                                        Join Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-orange-500 mb-4">SetiaKawan</h3>
                    <p className="mb-4">Your journey to a stronger, healthier you starts here. Join our community and unleash your potential.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-orange-500 transition-colors" aria-label="Facebook">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" className="hover:text-orange-500 transition-colors" aria-label="Instagram">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                        <a href="#" className="hover:text-orange-500 transition-colors" aria-label="Twitter">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-orange-500 transition-colors">About Us</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-orange-500 transition-colors">Classes</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-orange-500 transition-colors">Pricing</button></li>
                        <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-orange-500 transition-colors">Contact</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Contact Us</h4>
                    <div className="space-y-2">
                        <p className="flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            123 Fitness Lane, Gymtown, USA
                        </p>
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            contact@SetiaKawan.com
                        </p>
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            (123) 456-7890
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Opening Hours</h4>
                    <div className="space-y-2">
                        <p className="flex justify-between"><span>Monday - Friday:</span> <span>5:00 AM - 11:00 PM</span></p>
                        <p className="flex justify-between"><span>Saturday:</span> <span>7:00 AM - 9:00 PM</span></p>
                        <p className="flex justify-between"><span>Sunday:</span> <span>8:00 AM - 8:00 PM</span></p>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                <p>&copy; {new Date().getFullYear()} SetiaKawan. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

// --- PAGE COMPONENTS ---

const HomePage = ({ setPage, classes, testimonials }) => {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gray-900 text-white relative min-h-screen flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                    alt="Gym background" 
                    className="absolute inset-0 w-full h-full object-cover" 
                />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center relative z-10 py-32">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeIn">Unleash Your <span className="text-orange-500">Inner Strength</span></h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-300">State-of-the-art facilities, expert trainers, and a vibrant community. Your fitness journey begins now.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setPage('pricing')} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-md hover:bg-orange-600 transition-colors duration-300 text-lg">Become a Member</button>
                        <button onClick={() => setPage('schedule')} className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md hover:bg-white hover:text-gray-900 transition-colors duration-300 text-lg">View Classes</button>
                    </div>
                </div>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">World-Class Facilities</h2>
                    <p className="text-gray-400 mb-12">Designed for performance, comfort, and results.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Cardio Zone', desc: 'Treadmills, ellipticals, bikes, and more to get your heart pumping.', icon: '🏃' },
                            { title: 'Strength Area', desc: 'A vast selection of free weights, machines, and power racks.', icon: '💪' },
                            { title: 'Functional Fitness', desc: 'Open space with turf, sleds, kettlebells, and battle ropes.', icon: '🔥' }
                        ].map((facility, idx) => (
                            <div key={idx} className="bg-gray-900 p-8 rounded-lg transition-transform duration-300 hover:transform hover:scale-105">
                                <div className="text-4xl mb-4">{facility.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-orange-500">{facility.title}</h3>
                                <p className="text-gray-300">{facility.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gym Classes Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">Explore Our Classes</h2>
                    <p className="text-gray-400 mb-12">Find your motivation in our group fitness classes.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Gunakan 'classes' dari props dan key={c._id} */}
                        {classes.slice(0, 4).map(c => (
                             <div key={c._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                                <img 
                                    src={`https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80`} 
                                    alt={c.name} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-orange-500">{c.name}</h3>
                                    <p className="text-gray-400">with {c.instructor}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-sm text-gray-400">{c.time}</span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${c.spots - c.booked > 5 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {c.spots - c.booked} spots left
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button onClick={() => setPage('schedule')} className="mt-12 bg-orange-500 text-white font-bold py-3 px-8 rounded-md hover:bg-orange-600 transition-colors duration-300">View Full Schedule</button>
                </div>
            </section>

            {/* Testimonials Section */}
             <section className="py-20 bg-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-12">What Our Members Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Gunakan 'testimonials' dari props dan key={t._id} */}
                        {testimonials.map(t => (
                            <div key={t._id} className="bg-gray-900 p-8 rounded-lg text-left transition-transform duration-300 hover:transform hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <p className="font-bold text-orange-500">{t.name}</p>
                                        <RatingStars rating={t.rating} />
                                    </div>
                                </div>
                                <p className="italic">"{t.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-20 bg-orange-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of members who have already started their fitness journey with us.</p>
                    <button onClick={() => setPage('pricing')} className="bg-white text-orange-500 font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors duration-300 text-lg">Get Started Today</button>
                </div>
            </section>
        </div>
    );
};

const AboutPage = () => (
    <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-orange-500">Our Story</h1>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                <div className="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1075&q=80" alt="Our Gym" className="rounded-lg shadow-xl w-full h-96 object-cover"/>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">More Than Just a Gym</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        SetiaKawan was founded in 2015 with a simple mission: to create a fitness environment that is welcoming, motivating, and equipped with the best tools for success. We believe that fitness is a journey, not a destination, and we're here to support you every step of the way.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Our philosophy is built on three pillars: community, quality, and results. We foster a strong community of members and trainers who uplift each other. We invest in top-of-the-line equipment and maintain pristine facilities. And most importantly, we are dedicated to helping you achieve tangible, life-changing results.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-5xl font-bold text-orange-500 mb-2">8+</div>
                    <div className="text-xl font-semibold mb-2">Years Experience</div>
                    <p className="text-gray-400">Helping people achieve their fitness goals since 2015</p>
                </div>
                <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-5xl font-bold text-orange-500 mb-2">15+</div>
                    <div className="text-xl font-semibold mb-2">Expert Trainers</div>
                    <p className="text-gray-400">Certified professionals with years of experience</p>
                </div>
                <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-5xl font-bold text-orange-500 mb-2">2000+</div>
                    <div className="text-xl font-semibold mb-2">Happy Members</div>
                    <p className="text-gray-400">Who have transformed their lives with us</p>
                </div>
            </div>
        </div>
    </div>
);

const SchedulePage = ({ setPage, user, classes }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [bookingModal, setBookingModal] = useState({ isOpen: false, class: null });
    
    const categories = ['All', ...new Set(classes.map(c => c.category))];
    
    const filteredClasses = selectedCategory === 'All' 
        ? classes 
        : classes.filter(c => c.category === selectedCategory);
    
    const handleBookClass = (classItem) => {
        if (!user) {
            setPage('login');
            return;
        }
        setBookingModal({ isOpen: true, class: classItem });
    };
    
    const confirmBooking = () => {
        // In a real app, this would make an API call
        setBookingModal({ isOpen: false, class: null });
        // Show success notification would happen here
    };

    return (
        <div className="bg-gray-900 text-white py-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-orange-500">Class Schedule</h1>
                <p className="text-gray-400 text-center mb-12">Find and book your favorite classes</p>
                
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                selectedCategory === category 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* Classes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map(classItem => {
                        const isBooked = user && mockData.bookedClasses.some(bc => bc.id === classItem.id);
                        const isFull = classItem.booked >= classItem.spots;
                        
                        return (
                            <div key={classItem.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                                <img 
                                    src={`https://images.unsplash.com/photo-1549060279-7e168fce7090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80`} 
                                    alt={classItem.name} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-orange-500">{classItem.name}</h3>
                                        <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{classItem.category}</span>
                                    </div>
                                    <p className="text-gray-400 mb-2">with {classItem.instructor}</p>
                                    <p className="text-sm mb-4">{classItem.time}</p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm">
                                            {classItem.booked}/{classItem.spots} spots filled
                                        </span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            classItem.spots - classItem.booked > 5 
                                                ? 'bg-green-500/20 text-green-300' 
                                                : 'bg-red-500/20 text-red-300'
                                        }`}>
                                            {classItem.spots - classItem.booked} left
                                        </span>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleBookClass(classItem)}
                                        disabled={isBooked || isFull}
                                        className={`w-full py-2 rounded-md font-semibold transition-colors ${
                                            isBooked 
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                                : isFull 
                                                    ? 'bg-red-600 text-red-200 cursor-not-allowed'
                                                    : 'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                    >
                                        {isBooked ? 'Already Booked' : isFull ? 'Class Full' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Booking Modal */}
            <Modal 
                isOpen={bookingModal.isOpen} 
                onClose={() => setBookingModal({ isOpen: false, class: null })}
                title={`Book ${bookingModal.class?.name}`}
            >
                {bookingModal.class && (
                    <div className="space-y-4">
                        <p>You're about to book <span className="text-orange-500">{bookingModal.class.name}</span> with {bookingModal.class.instructor}.</p>
                        <p>Time: {bookingModal.class.time}</p>
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => setBookingModal({ isOpen: false, class: null })}
                                className="flex-1 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmBooking}
                                className="flex-1 py-2 bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

const TrainersPage = ({ trainer }) => (
    <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-4 text-orange-500">Meet Our Expert Trainers</h1>
            <p className="text-gray-400 text-center mb-12">Our certified professionals are here to guide you on your fitness journey</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {trainers.map(trainer => (
                    <div key={trainer.id} className="bg-gray-800 rounded-lg text-center p-6 shadow-lg transition-transform hover:scale-105">
                        <img src={trainer.image} alt={trainer.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-orange-500 object-cover" />
                        <h2 className="text-2xl font-bold">{trainer.name}</h2>
                        <p className="text-orange-500 font-semibold mb-2">{trainer.specialty}</p>
                        <p className="text-gray-400 mb-4">{trainer.bio}</p>
                        <div className="flex justify-center space-x-2">
                            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </button>
                            <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PricingPage = ({ setPage }) => {
    const [selectedPlan, setSelectedPlan] = useState('Gold');
    
    const plans = [
        {
            name: 'Bronze',
            price: 39,
            features: [
                'Access to all equipment',
                'Basic gym floor access',
                'Locker room access',
                'Free fitness assessment',
                'Group classes not included',
                'Personal training extra'
            ],
            recommended: false
        },
        {
            name: 'Gold',
            price: 99,
            features: [
                'Access to all equipment',
                'Unlimited group classes',
                '2 free personal training sessions',
                'Access to sauna & spa',
                'Nutrition consultation',
                'Priority class booking',
                'Bring a friend once a month'
            ],
            recommended: true
        },
        {
            name: 'Silver',
            price: 69,
            features: [
                'Access to all equipment',
                'Unlimited group classes',
                'Locker room access',
                'Free fitness assessment',
                'Personal training extra',
                'Sauna & spa extra'
            ],
            recommended: false
        }
    ];

    return (
        <div className="bg-gray-900 text-white py-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-orange-500">Membership Plans</h1>
                <p className="text-gray-400 text-center mb-12">Choose the plan that's right for you. All plans include access to our state-of-the-art facilities.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map(plan => (
                        <div 
                            key={plan.name}
                            className={`relative rounded-lg p-8 border-2 flex flex-col transition-all ${
                                plan.recommended 
                                    ? 'border-orange-500 scale-105 bg-gray-800' 
                                    : 'border-transparent hover:border-orange-500 bg-gray-800'
                            }`}
                        >
                            {plan.recommended && (
                                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">Most Popular</span>
                            )}
                            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                            <p className="text-4xl font-extrabold mb-4">
                                ${plan.price}<span className="text-lg text-gray-400">/mo</span>
                            </p>
                            <ul className="mb-8 space-y-3 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className={feature.startsWith('-') ? 'text-gray-500' : ''}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => {
                                    setSelectedPlan(plan.name);
                                    setPage('register');
                                }}
                                className={`mt-auto w-full py-3 rounded-md font-bold transition-colors ${
                                    plan.recommended
                                        ? 'bg-orange-500 hover:bg-orange-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {plan.recommended ? 'Get Started' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 bg-gray-800 rounded-lg p-8 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-center text-orange-500">Not Sure Which Plan is Right For You?</h2>
                    <p className="text-gray-300 text-center mb-6">Schedule a free consultation with one of our fitness experts to find the perfect plan for your goals.</p>
                    <div className="text-center">
                        <button className="bg-transparent border-2 border-orange-500 text-orange-500 font-bold py-3 px-8 rounded-md hover:bg-orange-500 hover:text-white transition-colors">
                            Schedule Consultation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would submit the form data
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-gray-900 text-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-orange-500">Get In Touch</h1>
                <p className="text-gray-400 text-center mb-12">Have questions? We're here to help!</p>
                
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2">
                        <div className="bg-gray-800 p-8 rounded-lg mb-8">
                            <h3 className="text-xl font-bold mb-6 text-orange-500">Contact Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-orange-500 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Address</h4>
                                        <p className="text-gray-300">123 Fitness Lane, Gymtown, USA 54321</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="bg-orange-500 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Phone</h4>
                                        <p className="text-gray-300">(123) 456-7890</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className="bg-orange-500 p-3 rounded-full mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Email</h4>
                                        <p className="text-gray-300">contact@SetiaKawan.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-orange-500">Opening Hours</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span>5:00 AM - 11:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>7:00 AM - 9:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>8:00 AM - 8:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2">
                        <div className="bg-gray-800 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                    <textarea 
                                        id="message" 
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- AUTH & DASHBOARD PAGES ---



// --- AUTH & DASHBOARD PAGES ---

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin({ email, password });
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-12">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Member Login</h1>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3" 
                            placeholder="you@example.com" 
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3" 
                            placeholder="••••••••" 
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Demo credentials:</p>
                    <p>Admin: admin@setiakawan.com / admin123</p>
                    <p>Member: member@setiakawan.com / member123</p>
                </div>
            </div>
        </div>
    );
};

const RegisterPage = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        membership: 'Gold'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            await onRegister({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                membership: formData.membership
            });
        } catch (err) {
            const errorMessage = err.response?.data?.msg || err.message || 'Registration failed. Please try again.';
            setErrors({ api: errorMessage });
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-12">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Create Account</h1>
                {errors.api && <p className="mb-4 text-center text-red-400">{errors.api}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3`}
                            placeholder="John Doe"
                            disabled={isLoading}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3`}
                            placeholder="you@example.com"
                            disabled={isLoading}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3`}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3`}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- NOTE: On SchedulePage, replace mockData with classes props ---
// Example:
// const filteredClasses = selectedCategory === 'All' ? classes : classes.filter(c => c.category === selectedCategory);

export { LoginPage, RegisterPage };


// --- DASHBOARD COMPONENTS ---

const AIWorkoutPlanner = ({ showNotification }) => {
    const [goal, setGoal] = useState('build_muscle');
    const [level, setLevel] = useState('intermediate');
    const [days, setDays] = useState('3');
    const [isLoading, setIsLoading] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState('');
    const [mealPlan, setMealPlan] = useState('');
    const [isMealPlanLoading, setIsMealPlanLoading] = useState(false);

    const handleGenerateWorkout = async () => {
        setIsLoading(true);
        setWorkoutPlan('');
        setMealPlan('');
        const prompt = `Create a ${days}-day weekly workout plan for an ${level} athlete whose goal is to ${goal.replace('_', ' ')}.`;
        const response = await callGeminiAPI(prompt);
        setWorkoutPlan(response);
        setIsLoading(false);
        showNotification('Your workout plan is ready!', 'success');
    };
    
    const handleGenerateMealPlan = async () => {
        setIsMealPlanLoading(true);
        setMealPlan('');
        const prompt = `Create a one-day sample meal plan to support a goal of ${goal.replace('_', ' ')}.`;
        const response = await callGeminiAPI(prompt);
        setMealPlan(response);
        setIsMealPlanLoading(false);
        showNotification('Your meal plan is ready!', 'info');
    };

    const formatResponse = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={index} className="text-lg font-bold text-orange-400 mt-4 mb-2">{line.replaceAll('**', '')}</h4>;
            }
            if (line.startsWith('*')) {
                return <p key={index} className="ml-4 mb-1 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {line.replace('* ', '')}
                </p>;
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index} className="mb-1">{line}</p>;
        });
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">✨ Personal AI Coach anda</h3>
            <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold mb-4">Create a New Workout Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tujuan Utama</label>
                        <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-gray-600 p-2 rounded-md">
                            <option value="build_muscle">Membangun otot</option>
                            <option value="lose_weight">Menurunkan berat badan</option>
                            <option value="increase_endurance">Tingkatan ketahanan</option>
                            <option value="improve_flexibility">Tingkatkan Fleksibilitas</option>
                            <option value="general_fitness">Kebugaran umum</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Level Pengalaman</label>
                        <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-gray-600 p-2 rounded-md">
                            <option value="beginner">Pemula</option>
                            <option value="intermediate">menengah</option>
                            <option value="advanced">Top</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Hari per minggu</label>
                        <select value={days} onChange={e => setDays(e.target.value)} className="w-full bg-gray-600 p-2 rounded-md">
                            <option value="2">2 Hari</option>
                            <option value="3">3 Hari</option>
                            <option value="4">4 Hari</option>
                            <option value="5">5 Hari</option>
                            <option value="6">6 Hari</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleGenerateWorkout} disabled={isLoading} className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-500 flex items-center justify-center">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : '✨ Buat Rencana Latihan Saya'}
                </button>
            </div>

            {isLoading && <GeminiLoadingSpinner />}
            
            {workoutPlan && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-orange-500">Rencana Latihan Kustom Anda</h3>
                        <button 
                            onClick={() => navigator.clipboard.writeText(workoutPlan)}
                            className="text-sm text-gray-300 hover:text-white flex items-center"
                            title="Copy to clipboard"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </button>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300 bg-gray-800 p-4 rounded-lg">
                        {formatResponse(workoutPlan)}
                    </div>
                    
                    <div className="mt-6 border-t border-gray-600 pt-6">
                         <button onClick={handleGenerateMealPlan} disabled={isMealPlanLoading} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 flex items-center">
                            {isMealPlanLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : '✨ Suggest a Meal Plan'}
                         </button>
                         {isMealPlanLoading && <GeminiLoadingSpinner />}
                         {mealPlan && (
                             <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                                 <h4 className="text-lg font-bold mb-2 text-blue-400">Rencana Makanan Contoh</h4>
                                 <div className="prose prose-invert max-w-none text-gray-300">
                                     {formatResponse(mealPlan)}
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
};

const MemberDashboard = ({ user, showNotification, classes: allClasses }) => {
    const [activeTab, setActiveTab] = useState('status');
    const [bookedClasses, setBookedClasses] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch user's bookings and payments
    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, paymentsRes] = await Promise.all([
                bookingsAPI.getMyBookings(),
                paymentsAPI.getMyPayments()
            ]);
            setBookedClasses(bookingsRes.data.bookings || []);
            setPaymentHistory(paymentsRes.data.payments || []);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClass = async (classId) => {
        try {
            const response = await bookingsAPI.bookClass(classId);
            setBookedClasses(prev => [...prev, response.data.class]);
            showNotification('Class booked successfully!', 'success');
            fetchUserData();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to book class';
            showNotification(message, 'error');
        }
    };

    const handleCancelBooking = async (classId) => {
        try {
            await bookingsAPI.cancelBooking(classId);
            setBookedClasses(prev => prev.filter(b => b.id !== classId));
            showNotification('Booking cancelled successfully', 'info');
            fetchUserData();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to cancel booking';
            showNotification(message, 'error');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'status':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Membership Status</h3>
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-3 text-orange-500">Personal Information</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-bold">Name:</span> {user?.name || 'N/A'}</p>
                                        <p><span className="font-bold">Email:</span> {user?.email || 'N/A'}</p>
                                        <p><span className="font-bold">Member Since:</span> Jan 15, 2023</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold mb-3 text-orange-500">Membership Details</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-bold">Plan:</span> <span className="text-orange-400 font-bold">{user?.membership || 'N/A'}</span></p>
                                        <p><span className="font-bold">Status:</span> <span className="text-green-400 font-bold">Active</span></p>
                                        <p><span className="font-bold">Renewal Date:</span> Aug 1, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-500">{bookedClasses.length}</div>
                                <div className="text-sm">Booked Classes</div>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-500">12</div>
                                <div className="text-sm">Workouts This Month</div>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-500">94%</div>
                                <div className="text-sm">Attendance Rate</div>
                            </div>
                        </div>
                    </div>
                );
            case 'schedule':
                 return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">My Booked Classes</h3>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="text-gray-400 mt-2">Loading your bookings...</p>
                            </div>
                        ) : bookedClasses.length === 0 ? (
                            <div className="bg-gray-700 p-8 rounded-lg text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-400">You haven't booked any classes yet.</p>
                                <button
                                    onClick={() => setActiveTab('book')}
                                    className="mt-4 bg-orange-500 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Browse Classes
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookedClasses.map(c => (
                                    <div key={c.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-orange-400">{c.name}</p>
                                            <p className="text-sm text-gray-300">{c.instructor} - {c.time}</p>
                                        </div>
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-colors"
                                            onClick={() => handleCancelBooking(c.id)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'book':
                return (
                     <div>
                        <h3 className="text-2xl font-bold mb-4">Book a New Class</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                                    <p className="text-gray-400 mt-2">Loading classes...</p>
                                </div>
                            ) : (allClasses || []).map(c => {
                                const isBooked = bookedClasses.some(bc => bc.id === c.id);
                                const isFull = c.booked >= c.spots;

                                return (
                                <div key={c.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{c.name}</p>
                                        <p className="text-sm text-gray-300">{c.instructor} - {c.time}</p>
                                        <p className="text-xs text-gray-400">{c.spots - c.booked} spots remaining</p>
                                    </div>
                                    <button
                                        onClick={() => handleBookClass(c.id)}
                                        disabled={isBooked || isFull}
                                        className={`px-4 py-2 text-sm rounded-md font-semibold transition-colors ${
                                            isBooked ? 'bg-gray-500 cursor-not-allowed' :
                                            isFull ? 'bg-red-800 text-red-300 cursor-not-allowed' :
                                            'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                    >
                                        {isBooked ? 'Booked' : isFull ? 'Full' : 'Book Now'}
                                    </button>
                                </div>
                            )})}
                        </div>
                    </div>
                );
            case 'payment':
                 return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Payment History</h3>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="text-gray-400 mt-2">Loading payments...</p>
                            </div>
                        ) : paymentHistory.length === 0 ? (
                            <div className="bg-gray-700 p-8 rounded-lg text-center">
                                <p className="text-gray-400">No payment history found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                   <thead className="bg-gray-700">
                                       <tr>
                                           <th className="p-3">Date</th>
                                           <th className="p-3">Plan</th>
                                           <th className="p-3">Amount</th>
                                           <th className="p-3">Status</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {paymentHistory.map(p => (
                                           <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700">
                                               <td className="p-3">{p.payment_date || p.date}</td>
                                               <td className="p-3">{p.plan}</td>
                                               <td className="p-3">${parseFloat(p.amount || 0).toFixed(2)}</td>
                                               <td className="p-3">
                                                   <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">{p.status}</span>
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                 return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
                         <form className="bg-gray-700 p-6 rounded-lg space-y-4">
                            <div>
                               <label className="text-sm text-gray-300">Name</label>
                               <input type="text" defaultValue={user?.name || ''} className="mt-1 block w-full bg-gray-600 rounded-md p-2"/>
                            </div>
                            <div>
                               <label className="text-sm text-gray-300">Email</label>
                               <input type="email" defaultValue={user?.email || ''} className="mt-1 block w-full bg-gray-600 rounded-md p-2"/>
                            </div>
                            <div>
                               <label className="text-sm text-gray-300">Phone Number</label>
                               <input type="tel" placeholder="(123) 456-7890" className="mt-1 block w-full bg-gray-600 rounded-md p-2"/>
                            </div>
                             <div>
                               <label className="text-sm text-gray-300">Change Password</label>
                               <input type="password" placeholder="New Password" className="mt-1 block w-full bg-gray-600 rounded-md p-2"/>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => showNotification('Profile updated!', 'info')} 
                                className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-bold transition-colors"
                            >
                                Save Changes
                            </button>
                         </form>
                    </div>
                );
            case 'ai_coach':
                return <AIWorkoutPlanner showNotification={showNotification} />;
            default: return null;
        }
    }

    const tabs = [
        { id: 'status', label: 'Dashboard', icon: '📊' },
        { id: 'ai_coach', label: 'AI Coach', icon: '✨' },
        { id: 'schedule', label: 'Jadwal Saya', icon: '📅' },
        { id: 'book', label: 'Book Class', icon: '➕' },
        { id: 'payment', label: 'Pembayaran', icon: '💳' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    return (
        <div className="flex flex-col md:flex-row">
            <nav className="w-full md:w-48 bg-gray-800 p-2 md:p-4 space-y-2 flex-shrink-0">
                {tabs.map(tab => (
                    <button key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                            activeTab === tab.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>
            <main className="flex-1 p-4 md:p-8 bg-gray-900 rounded-lg md:rounded-l-none">
                {renderContent()}
            </main>
        </div>
    );
};

const AdminDashboard = ({ showNotification }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: null });

    const openModal = (title, content) => {
        setModalContent({ title, content });
        setIsModalOpen(true);
    };

    const MemberForm = ({ member }) => (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showNotification('Member saved!', 'success'); setIsModalOpen(false); }}>
            <input type="text" placeholder="Name" defaultValue={member?.name} className="w-full bg-gray-700 p-2 rounded" />
            <input type="email" placeholder="Email" defaultValue={member?.email} className="w-full bg-gray-700 p-2 rounded" />
            <select defaultValue={member?.membership || 'Silver'} className="w-full bg-gray-700 p-2 rounded">
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
            </select>
            <select defaultValue={member?.status || 'Active'} className="w-full bg-gray-700 p-2 rounded">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
            </select>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-bold transition-colors">Save</button>
        </form>
    );
    
    const ClassForm = ({ classInfo }) => {
        const [className, setClassName] = useState(classInfo?.name || '');
        const [instructor, setInstructor] = useState(classInfo?.instructor || '');
        const [description, setDescription] = useState(classInfo?.description || '');
        const [isGenerating, setIsGenerating] = useState(false);

        const handleGenerateDesc = async () => {
            if (!className) {
                showNotification('Please enter a class name first.', 'error');
                return;
            }
            setIsGenerating(true);
            const prompt = `Write a short, energetic, and motivating class description for a gym class called "${className}" led by "${instructor}".`;
            const response = await callGeminiAPI(prompt);
            setDescription(response);
            setIsGenerating(false);
        };

        return (
             <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showNotification('Class saved!', 'success'); setIsModalOpen(false); }}>
                <input type="text" placeholder="Class Name" value={className} onChange={e => setClassName(e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                <input type="text" placeholder="Instructor" value={instructor} onChange={e => setInstructor(e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                <div>
                    <textarea placeholder="Description" rows="4" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                    <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md font-semibold disabled:bg-gray-500 transition-colors">
                       {isGenerating ? 'Generating...' : '✨ Generate Description'}
                    </button>
                </div>
                <input type="text" placeholder="Time (e.g., Mon 6:00 AM)" defaultValue={classInfo?.time} className="w-full bg-gray-700 p-2 rounded" />
                <input type="number" placeholder="Spots" defaultValue={classInfo?.spots} className="w-full bg-gray-700 p-2 rounded" />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-bold transition-colors">Save</button>
            </form>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Gym Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <p className="text-4xl font-bold text-orange-400">150</p>
                                <p>Active Members</p>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <p className="text-4xl font-bold text-orange-400">85%</p>
                                <p>Class Capacity</p>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <p className="text-4xl font-bold text-orange-400">$12k</p>
                                <p>Revenue This Month</p>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <p className="text-4xl font-bold text-orange-400">92%</p>
                                <p>Member Retention</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <h4 className="text-xl font-bold mb-4">Recent Activity</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                                    <div>
                                        <p className="font-semibold">New member registration</p>
                                        <p className="text-sm text-gray-400">Bagus Ardin joined with Gold plan</p>
                                    </div>
                                    <span className="text-sm text-gray-400">2 hours ago</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                                    <div>
                                        <p className="font-semibold">Class fully booked</p>
                                        <p className="text-sm text-gray-400">HIIT Circuit with John David is full</p>
                                    </div>
                                    <span className="text-sm text-gray-400">5 hours ago</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                                    <div>
                                        <p className="font-semibold">Payment received</p>
                                        <p className="text-sm text-gray-400">Monthly payment from Samantha B.</p>
                                    </div>
                                    <span className="text-sm text-gray-400">1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'members':
                 return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Member Management</h3>
                            <button onClick={() => openModal('Add New Member', <MemberForm />)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-bold transition-colors">Add Member</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
                               <thead className="bg-gray-800">
                                   <tr>
                                       <th className="p-3">Name</th>
                                       <th className="p-3">Email</th>
                                       <th className="p-3">Membership</th>
                                       <th className="p-3">Status</th>
                                       <th className="p-3">Join Date</th>
                                       <th className="p-3">Actions</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {mockData.members.map(m => (
                                       <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-600">
                                           <td className="p-3">{m.name}</td>
                                           <td className="p-3">{m.email}</td>
                                           <td className="p-3">{m.membership}</td>
                                           <td className="p-3">
                                               <span className={`px-2 py-1 rounded-full text-xs ${m.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                   {m.status}
                                               </span>
                                           </td>
                                           <td className="p-3">{m.joinDate}</td>
                                           <td className="p-3 space-x-2">
                                               <button onClick={() => openModal(`Edit ${m.name}`, <MemberForm member={m} />)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                               <button className="text-red-400 hover:text-red-300 text-sm">Deactivate</button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'classes':
                  return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Class Management</h3>
                            <button onClick={() => openModal('Add New Class', <ClassForm />)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-bold transition-colors">Add Class</button>
                        </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left bg-gray-700 rounded-lg overflow-hidden">
                               <thead className="bg-gray-800">
                                   <tr>
                                       <th className="p-3">Class</th>
                                       <th className="p-3">Instructor</th>
                                       <th className="p-3">Time</th>
                                       <th className="p-3">Category</th>
                                       <th className="p-3">Bookings</th>
                                       <th className="p-3">Actions</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {mockData.classes.map(c => (
                                       <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-600">
                                           <td className="p-3 font-semibold">{c.name}</td>
                                           <td className="p-3">{c.instructor}</td>
                                           <td className="p-3">{c.time}</td>
                                           <td className="p-3">
                                               <span className="px-2 py-1 bg-gray-600 rounded-full text-xs">{c.category}</span>
                                           </td>
                                           <td className="p-3">{c.booked} / {c.spots}</td>
                                           <td className="p-3 space-x-2">
                                                <button onClick={() => openModal(`Edit ${c.name}`, <ClassForm classInfo={c} />)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                                <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                            </table>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const tabs = [
        { id: 'stats', label: 'Statistics', icon: '📈' },
        { id: 'members', label: 'Members', icon: '👥' },
        { id: 'classes', label: 'Classes', icon: '🏋️' }
    ];

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                {modalContent.content}
            </Modal>
            <div className="flex flex-col md:flex-row">
                <nav className="w-full md:w-48 bg-gray-800 p-2 md:p-4 space-y-2 flex-shrink-0">
                     {tabs.map(tab => (
                        <button key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                                activeTab === tab.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <main className="flex-1 p-4 md:p-8 bg-gray-900 rounded-lg md:rounded-l-none">
                    {renderContent()}
                </main>
            </div>
        </>
    );
};

const DashboardPage = ({ user, showNotification, classes }) => {
    // Pastikan user ada sebelum render
    if (!user) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">{user?.name ? `Selamat Datang, ${user.name}` : 'Dashboard'}</h1>
                        <p className="text-gray-400">{(user?.role === 'admin') ? 'Manage your gym operations.' : 'Berikut adalah dasbor kebugaran anda'}</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {(user?.role === 'admin') ?
                        <AdminDashboard showNotification={showNotification} /> :
                        <MemberDashboard user={user} showNotification={showNotification} classes={classes} />}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const topOfPageRef = useRef(null);

    // State untuk menyimpan data dari API
    const [classes, setClasses] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [bookedClasses, setBookedClasses] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect untuk mengambil data dari API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, testimonialsRes] = await Promise.all([
                    classesAPI.getAll(),
                    testimonialsAPI.getAll()
                ]);

                setClasses(classesRes.data.classes || []);
                setTestimonials(testimonialsRes.data.testimonials || []);
                
                // Mock trainers data (can be added to backend later)
                setTrainers([
                    { id: 1, name: 'Sarah Lee', specialty: 'Yoga & Flexibility', bio: 'With over 10 years of experience in vinyasa and ashtanga yoga, Sarah helps members find balance and peace.', image: 'https://placehold.co/400x400/orange/white?text=SL' },
                    { id: 2, name: 'John David', specialty: 'HIIT & Cardio', bio: 'John is a certified personal trainer known for his high-energy, motivational classes that push you to your limits.', image: 'https://placehold.co/400x400/orange/white?text=JD' },
                    { id: 3, name: 'Mike Ross', specialty: 'Strength & Powerlifting', bio: 'A competitive powerlifter, Mike specializes in proper form and strength progression for all fitness levels.', image: 'https://placehold.co/400x400/orange/white?text=MR' },
                    { id: 4, name: 'Maria Garcia', specialty: 'Dance & Zumba', bio: 'Maria brings the party to the gym with her infectious energy and fun-filled Zumba routines.', image: 'https://placehold.co/400x400/orange/white?text=MG' },
                ]);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                showNotification('Gagal memuat data dari server.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Check for saved user session
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (err) {
                    console.error("Failed to parse saved user:", err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        };
        checkAuth();
    }, []);

    // Redirect to dashboard after login/register
    useEffect(() => {
        if (user && page === 'login') {
            setPage('dashboard');
        } else if (user && page === 'register') {
            setPage('dashboard');
        }
    }, [user, page]);

    // Scroll to top on page change
    useEffect(() => {
        topOfPageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [page]);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const handleLogin = async ({ email, password }) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            setPage('dashboard');
            showNotification(`Welcome back, ${userData.name || 'User'}!`, 'success');
            
            return userData;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            throw new Error(message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setPage('home');
        showNotification('You have been logged out.', 'info');
    };

    const handleRegister = async ({ name, email, password, membership }) => {
        try {
            const response = await authAPI.register({ name, email, password, membership });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            setPage('dashboard');
            showNotification(`Registration successful! Welcome to SetiaKawan, ${userData.name || 'User'}.`, 'success');
            
            return userData;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(message);
        }
    };

    // Fungsi renderPage (Ini sudah benar)
    const renderPage = () => {
        switch (page) {
            case 'home': 
                return <HomePage setPage={setPage} classes={classes} testimonials={testimonials} />;
            case 'about': 
                return <AboutPage />;
            case 'schedule': 
                return <SchedulePage setPage={setPage} user={user} classes={classes} />;
            case 'trainers': 
                return <TrainersPage trainers={trainers} />;
            case 'pricing': 
                return <PricingPage setPage={setPage}/>;
            case 'contact': 
                return <ContactPage />;
            case 'login': 
                // Butuh handleLogin agar tombol login berfungsi
                return <LoginPage onLogin={handleLogin} />;
            case 'register': 
                // Butuh handleRegister agar tombol register berfungsi
                return <RegisterPage onRegister={handleRegister} />;
            case 'dashboard':
                if (!user) {
                    // Redirect ke login jika user tidak ada
                    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-xl mb-4">Please login to access dashboard</p>
                            <button 
                                onClick={() => setPage('login')} 
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>;
                }
                // Butuh showNotification agar dashboard berfungsi
                return <DashboardPage user={user} showNotification={showNotification} classes={classes} />;
            default:
                return <HomePage setPage={setPage} classes={classes} testimonials={testimonials} />;
        }
    };

    // Return JSX (Ini sudah benar)
    return (
        <div ref={topOfPageRef} className="bg-gray-900 font-sans min-h-screen flex flex-col">
            <Notification 
                message={notification.message} 
                type={notification.type} 
                onDismiss={() => setNotification({ message: '', type: '' })} 
            />
            {/* Butuh handleLogout agar tombol logout di header berfungsi */}
            <Header setPage={setPage} user={user} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
            
            {/* Add some custom styles for animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}