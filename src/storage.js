//storage.js

const STORAGE_KEY = "taski:v1";

//save state to localStorage
const save = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save to localStorage", error);
  }
};

//load state from localStorage; returns null if missing or corrupt
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Could not read from localStorage", error);
    return null;
  }
};

export { save, load };
