import { useEffect, useState } from "react";

const TypingEffect = () => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const texts = [
      "U get Value?? No Fear, Na this Platform go Blow YOU!!",
      "And even if you no get, As long as you can LEARN",
    ];

    const handleTyping = () => {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText((prev) => prev + currentText.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
          setSpeed(150);
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
          setSpeed(100);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    const typingTimer = setTimeout(handleTyping, speed);

    return () => clearTimeout(typingTimer);
  }, [charIndex, isDeleting, speed, textIndex]);

  return <p className="text-sm text-left text-[#8cfa93] mt-4">{displayText}</p>;
};

export default TypingEffect;
