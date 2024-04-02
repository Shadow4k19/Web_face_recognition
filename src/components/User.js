class User {
    static instance = null;
  
    constructor() {
      if (User.instance) {
        throw new Error('Only one instance of User is allowed');
      }
  
      this.setUserFromStorage();
  
      User.instance = this;
    }
  
    setUserFromStorage() {
      this.setUsername(localStorage.getItem('username'));
      this.setLoginStatus(localStorage.getItem('status'));
    }
  
    setUsername(username) {
      localStorage.setItem('username', username);
    }
  
    setLoginStatus(status) {
      localStorage.setItem('status', status);
    }
    getUsername() {
      return localStorage.getItem('username');
    }
  
    getStatus() {
      return localStorage.getItem('status');
    }
  
    deleteUser() {
      localStorage.removeItem('username');
      this.setLoginStatus(false);
    }
  }
  
  const userInstance = new User();
  
  export default userInstance;