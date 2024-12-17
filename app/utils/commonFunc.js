export const checkArrNull=(arr)=>{
    if(arr?.length == 0 ||arr == null || arr == []){
      return true
    }else{
      return false
    }
  }