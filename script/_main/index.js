const receivedMessage = 'Access received';
const throwEmptyFieldError = property => new Error(`No field ${property} in target`);

const hideProperties = (target, prefix = '_') => {
   return new Proxy(target, {
      has: (target, property) => {
         return property in target && !property.startsWith(prefix);
      },
      ownKeys: target => Reflect.ownKeys(target)
         .filter(key => !key.startsWith(prefix)),
      get: (target, property, receiver) => {
         if (property in target) {
            const value = Reflect.get(target, property, receiver);

            return typeof property === 'function'
               ? property.startsWith(prefix)
                  ? receivedMessage
                  : value.apply(receiver)
               : property.startsWith(prefix)
                  ? receivedMessage
                  : value;
         }
         throw throwEmptyFieldError(property);
      },
      set: (target, property, newValue, receiver) => {
         if (property in target) {
            if (property.startsWith(prefix)) {
               console.log(receivedMessage)
               return false;
            }
            Reflect.set(target, property, newValue, receiver);
            return true;
         }
         throw throwEmptyFieldError(property);
      }
   });
}

mainUser = hideProperties({
   type: 'admin',
   name: 'SGHG',
   age: 13,
   gender: 'male',
   _password: '123456',
   sayHi: (user) => `Hello, ${user.name}`,
   _sayPassword: () => this._password
});