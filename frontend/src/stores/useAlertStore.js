import { create } from "zustand";
import {v4 as uuidv4} from "uuid"


const alertStore = create((set,get)=>({
   alerts:[],
   setter : (pairs)=>set(()=>({
      alerts:[...pairs]
   })),
  addAlert:(pair)=>{
    const { alerts} = get();
    const exist = alerts.some((alert)=>
      alert.from === pair.from &&
      alert.to === pair.to &&
      alert.condition === pair.condition &&
      alert.threshold === pair.threshold &&
      alert.wantDailyUpdates === pair.wantDailyUpdates
    )
    if(!exist){
      set((state)=>({
        alerts:[...state.alerts,{...pair,id:uuidv4()}]
      }))
    }
  } 
  
  
}))

export default alertStore;