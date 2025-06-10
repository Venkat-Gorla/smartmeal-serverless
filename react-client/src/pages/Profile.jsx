const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
};

export default function Profile() {
  const { name, email } = mockUser;

  return (
    <div className="container mt-1">
      <div
        className="card mx-auto text-center shadow-sm"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-body">
          <h2 className="card-title mb-3">Your Profile</h2>
          <p className="text-muted">Welcome back to Smart Meals!</p>
          <hr />
          <div className="text-start">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
