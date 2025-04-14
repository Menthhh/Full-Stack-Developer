"use client";

const UserDetailView = ({ user, onBack }) => {
  if (!user) {
    return <div className="text-center p-4 text-gray-500">No user data available.</div>;
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">User Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="mt-1 text-base text-gray-800">{user.email}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Username</label>
          <p className="mt-1 text-base text-gray-800">{user.username}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <p className="mt-1 text-base text-gray-800">{user.full_name || "-"}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500 mr-4">Status</label>
          <p
            className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          className="btn btn-secondary px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UserDetailView;
