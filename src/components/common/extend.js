
export default {
  // 存localStorage
  setItem(key, value) {
    let storage = localStorage.getItem('storage');
    if (!storage){
      storage = {}
    }else{
      storage = JSON.parse(storage);
    }
    storage[key] = value;
    localStorage.setItem('storage',JSON.stringify(storage));
  },
  // 取localStorage
  getItem(key){
    let storage = localStorage.getItem('storage');
    if (!storage){
      return undefined
    }
    storage = JSON.parse(storage);
    return storage[key];
  }
}
