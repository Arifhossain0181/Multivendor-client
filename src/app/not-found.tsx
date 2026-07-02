import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "48px" }}>404</h1>
      <p>The page you are looking for could not be found.</p>

     
      <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go back to Home
      </Link>
    </div>
  );
}