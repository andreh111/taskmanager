import jwtDecode from "jwt-decode";

export const getUserId = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id; // Replace 'user_id' with the actual key used in your JWT payload
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
