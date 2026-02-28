const PincodeDecode = async (pincode) => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "An error occurred. Please try again."
    );
    return null;
  }
};

export default PincodeDecode;
