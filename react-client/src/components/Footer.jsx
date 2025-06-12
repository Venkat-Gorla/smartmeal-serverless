export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5">VG</span>
          <span className="text-muted">&copy; {year} Company, Inc</span>
        </div>
        <div className="d-flex gap-3">
          <a href="#" className="text-muted fs-5">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="text-muted fs-5">
            <i className="bi bi-facebook"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
