// Importing the config object and characters array from the config.js file
// The config object contains the configuration options for the password generator
import { config, characters } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements from the DOM
  const btnGenerate = document.querySelector(".btn-generate");
  const passwordTexts = document.querySelectorAll(".btn-pw-text");
  const btnSetters = document.querySelectorAll(".btn-setter");
  const pwLength = document.querySelector(".pw-length");
  const checkboxElements = document.querySelectorAll(".checkBox");

  // Setting the initial password length
  let passwordLength = config.MIN_PASSWORD_LENGTH;

  // Helper functions
  const setPasswordLengthText = (passwordLength) => {
    pwLength.textContent = passwordLength;
  };

  const generateRandomNumber = (numberLength) => {
    return Math.floor(Math.random() * numberLength);
  };

  // Function to get the characters based on the user's selection
  const getPasswordCharacters = (charactersArray) => {
    if (!config.symbols && !config.numbers) {
      return charactersArray.filter((char) => /^[a-zA-Z]$/.test(char));
    } else if (!config.symbols) {
      return charactersArray.filter((char) => /^[a-zA-Z0-9]$/.test(char));
    } else if (!config.numbers) {
      return charactersArray.filter((char) => /^[a-zA-Z\W]$/.test(char));
    } else {
      return charactersArray;
    }
  };

  const generatePasswords = (charArray, charLength) => {
    let characters = getPasswordCharacters(charArray);
    const passwords = [[], []];

    while (
      passwords[0].length !== charLength &&
      passwords[1].length !== charLength
    ) {
      let randomNumber1 = generateRandomNumber(characters.length);
      let randomNumber2 = generateRandomNumber(characters.length);
      passwords[0].push(characters[randomNumber1]);
      passwords[1].push(characters[randomNumber2]);
    }

    return passwords;
  };

  const setPasswords = (passwordElements, passwords) => {
    passwordElements.forEach((pwEl, index) => {
      pwEl.textContent = passwords[index].join("");
    });
  };

  // Event listeners
  const checkCharactersOptions = () => {
    checkboxElements.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        config[e.target.id] = !config[e.target.id];
      });
    });
  };

  const setPasswordLength = () => {
    btnSetters.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (
          btn.id === "decrease" &&
          passwordLength > config.MIN_PASSWORD_LENGTH
        ) {
          passwordLength--;
          setPasswordLengthText(passwordLength);
        } else if (
          btn.id === "increase" &&
          passwordLength < config.MAX_PASSWORD_LENGTH
        ) {
          passwordLength++;
          setPasswordLengthText(passwordLength);
        }
      });
    });
  };

  const handleGeneratePasswords = () => {
    btnGenerate.addEventListener("click", () => {
      let passwords = generatePasswords(characters, passwordLength);
      setPasswords(passwordTexts, passwords);
    });
  };

  const handleCopyPassword = () => {
    document.querySelector(".btn-container").addEventListener("click", (e) => {
      if (e.target.closest(".btn-pw")) {
        const button = e.target.closest(".btn-pw");
        const btnText = button.querySelector(".btn-pw-text").textContent;

        navigator.clipboard.writeText(btnText).then(() => {
          button.classList.add("copied");
          setTimeout(() => button.classList.remove("copied"), 1500);
        });
      }
    });
  };

  // Initialize the app
  const init = () => {
    setPasswordLength();
    checkCharactersOptions();
    handleGeneratePasswords();
    handleCopyPassword();
    setPasswordLengthText(passwordLength);
  };

  init();
});
