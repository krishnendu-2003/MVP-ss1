
import React, { useState } from 'react';
import axios from 'axios';

function LinkGenerator() {
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('Boat');
  const [generatedLink, setGeneratedLink] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const ngrokUrl = 'https://7513-2405-201-8018-60b9-b927-e114-bcaf-47b2.ngrok-free.app'; // Your Ngrok URL

  const handleGenerateLink = async () => {
    try {
      // const response = await axios.post('/api/generate-link', { email, brand });
      const response = await axios.post(`${ngrokUrl}/api/generate-link`, { email, brand }); // Use Ngrok URL here

      setGeneratedLink(response.data.link);
      setClickCount(0); // Reset click count when a new link is generated
    } catch (error) {
      console.error("Error generating link", error);
    }
  };

  // Function to handle link clicks
  const handleLinkClick = async (e) => {
    e.preventDefault(); // Prevent the default link behavior
    if (generatedLink) {
      const customLink = generatedLink.split('/').pop(); // Extract the custom link part
      console.log("Generated Link:", generatedLink);
      console.log("Custom Link:", customLink); // Log the custom link
      try {
        // const response = await axios.get(`/api/click/${customLink}`);
        const response = await axios.get(`${ngrokUrl}/api/click/${generatedLink}`); // Use Ngrok URL here

        setClickCount(response.data.clickCount); // Update the click count
      } catch (error) {
        console.error("Error updating click count", error);
      }
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="Boat">Boat</option>
        <option value="Fossil">Fossil</option>
        <option value="Lenovo">Lenovo</option>
      </select>
      <button onClick={handleGenerateLink}>Generate Link</button>
      {generatedLink && (
        <div>
          <p>Your custom link: <a href={generatedLink} onClick={handleLinkClick}>{generatedLink}</a></p>
          <p>Link Click Count: {clickCount}</p>
        </div>
      )}
    </div>
  );
}

export default LinkGenerator;
