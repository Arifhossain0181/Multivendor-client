"use client";

export default function Error({
    error,
    reset,
}:{
    error: Error;
    reset: () => void;
}){
    return(
        <div style={{ textAlign: "center", padding: "60px" }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: "gray" }}>{error.message}</p>

     
      <button
        onClick={() => reset()}
        style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
      >
        try again
      </button>
    </div>
  );
    
}