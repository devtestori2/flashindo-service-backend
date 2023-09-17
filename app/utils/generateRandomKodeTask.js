const generateRandomKodeTask = (length) => {
  // Define the characters from which to generate the code.
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Create a buffer to store the generated code.
  let code = "";

  // Generate random characters for the code.
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;

};

module.exports = generateRandomKodeTask
