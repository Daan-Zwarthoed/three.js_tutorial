const userFunction = (userScript: string, hintBefore?: string, hintAfter?: string, paramNames?: string[], params?: any[], )=>{
    try {
        if (userScript && params && paramNames){
          return Function(...paramNames, hintBefore + userScript + hintAfter)(...params);
        } else if(userScript){
            return Function(hintBefore + userScript + hintAfter);
        }
      } catch (error) {
        console.log("incorrect");
      }
}

export default userFunction