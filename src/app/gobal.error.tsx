"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
   
    <html lang="en">
      <body>
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>Application Error</h2>
          <p style={{ color: "gray" }}>{error.message}</p>
          <button onClick={() => reset()} style={{ marginTop: "16px", padding: "8px 16px" }}>
            try again
          </button>
        </div>
      </body>
    </html>
  );
}