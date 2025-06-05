import { create } from "zustand";

const useFavouriteStore = create((set, get) => ({
  favourites: [],
  setter: (pairs) =>
    set(() => ({
      favourites: [...pairs],
    })),
  toggleLike: (pair) => {
      const { favourites } = get();
      const exist = favourites.some(
        (fav) =>
          fav.from === pair.from &&
          fav.to === pair.to &&
          fav.amount === pair.amount &&
          fav.date === pair.date 
      );

      if (exist) {

        set({favourites:favourites.filter(
          (fav) =>
            !(fav.from === pair.from &&
            fav.to === pair.to &&
            fav.amount === pair.amount &&
            fav.date === pair.date  )
        )})
      }else{
        set({
          favourites:[...favourites,{...pair}]
        })
      }
    },
  dislike:(id)=>set((state)=>({
    favourites:state.favourites.filter((fav)=>fav._id!==id)
  }))
}));

export default useFavouriteStore;
