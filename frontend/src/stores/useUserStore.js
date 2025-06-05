import { create } from "zustand";

const userStore = create((set) => ({
  user: { username: null, email: null, isLoggedin: false },
  login: ({username, email}) =>
    set((state) => ({
      user: { ...state.user, username, email, isLoggedin: true },
    })),
  logout: () =>
    set(() => ({ user: { username: null, email: null, isLoggedin: false } })),
}));

export default userStore;
