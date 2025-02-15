
export const saveSelectedAddress = (address) => {
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };
  
  export const getSelectedAddress = () => {
    return JSON.parse(localStorage.getItem("selectedAddress")) || null;
  };