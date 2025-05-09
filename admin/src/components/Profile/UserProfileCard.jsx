"use client";

export default function UserProfileCard({ user }) {
    const defaultUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Administrator',
      avatar: 'https://via.placeholder.com/150/007bff/FFFFFF?text=A', // Placeholder avatar
      bio: 'Oversees all administrative tasks and ensures the smooth operation of the dashboard.',
    };
  
    const currentUser = user || defaultUser;
  
    return (
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-0 md:mr-6 mb-4 md:mb-0 border-4 border-blue-500"
            src={currentUser.avatar}
            alt={`${currentUser.name}'s avatar`}
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{currentUser.name}</h2>
            <p className="text-md text-blue-600">{currentUser.email}</p>
            <p className="text-sm text-gray-500 mt-1 bg-gray-100 px-2 py-1 inline-block rounded">
              {currentUser.role}
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Bio</h3>
          <p className="text-gray-600 leading-relaxed">
            {currentUser.bio}
          </p>
        </div>
        <div className="mt-6">
          <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Edit Profile
          </button>
        </div>
      </div>
    );
  }