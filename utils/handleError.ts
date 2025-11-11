  export const handleError = (err) => {
    console.log("🔥 Full Error Object:", err);

    if (err.response) {
      // ✅ Server responded with error (400, 500, etc.)
      console.log(
        "❌ Response Data:",
        JSON.stringify(err.response.data, null, 2)
      );
      console.log("❌ Response Status:", err.response.status);

      return(
        err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data) ||
          "Signup failed. Please try again."
      );
      
    } else if (err.request) {
      // ✅ No response from server
      console.log("⚠️ No response received:", err.request);
      return("No response from server. Please check your API or internet.");
    } else {
      // ✅ Other setup or unknown errors
      console.log("🔥 Request Setup Error:", err.message);
      return(err.message || "Unexpected error occurred.");
    }
  };