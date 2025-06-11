const mockUser = {
  name: "Venkat Gorla",
  email: "Venkat.Gorla@example.com",
};

export default function Profile() {
  const { name, email } = mockUser;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow-lg text-center"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "1rem" }}
      >
        <div className="mb-3">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
            style={{
              width: "80px",
              height: "80px",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {initials}
          </div>
        </div>

        <p className="text-muted">Welcome back to Smart Meals!</p>
        <hr />
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>
    </div>
  );
}
