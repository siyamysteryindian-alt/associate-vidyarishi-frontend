const generatePassword = (name, email, phone) => {
  // Define a set of special characters
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  // Generate a random special character
  const randomSpecialChar =
    specialChars[Math.floor(Math.random() * specialChars.length)];

  // Name ka first 3 characters
  const namePart = name.substring(0, 3);

  // Email ka first 3 characters aur domain ka first 2 characters
  const emailUser = email.split("@")[0].substring(0, 3);
  const emailDomain = email.split("@")[1].substring(0, 2);

  // Phone number ke last 4 digits
  const phonePart = phone.slice(-4);

  // Special character ko add karo
  const password = `${namePart}${emailUser}${phonePart}${randomSpecialChar}${emailDomain}`;

  return password;
};

module.exports = generatePassword;
