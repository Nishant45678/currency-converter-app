import { create } from "zustand";
import userStore from "./useUserStore";

const useUtil = create((set) => ({
  header: "Home",
  setHeader: (heading, requireLogin = false) => {
    const isLoggedin = userStore.getState().user.isLoggedin;
    set(() => ({
      header: requireLogin && !isLoggedin ? "Login" : heading,
    }));
  },
  currencies:{},
  setCurrencies:(values)=>set(()=>({
    currencies:values
  }))
}));

export default useUtil;
