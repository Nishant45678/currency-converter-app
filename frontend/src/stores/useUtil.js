import { create } from "zustand";
import userStore from "./useUserStore";

const useUtil = create((set) => ({
  header: "Home",
  setHeader: (heading, requireLogin = false) => {
    const isLoggedin = userStore.getState().isLoggedin;
    set(() => ({
      header: requireLogin && !isLoggedin ? "Login" : heading,
    }));
  },
}));

export default useUtil;
