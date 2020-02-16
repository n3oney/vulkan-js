# vulkan-js
##### A library for working with Vulkan's UONET+ school register.

### Instalation
```
npm install vulkan-js
```
or
```
yarn add vulkan-js
```

### Usage

Import the package 
```typescript
import Vulkan from "vulkan-js";
```
Initialize a new instance of the client
```typescript
const client = new Vulkan();
```
Register a new device on UONET+
```typescript
client.getCertificate(token, pin, symbol, deviceName, androidVersion).then(certificate => {
    // save the certificate to somewhere, in this case I'm saving it to a json file
    fs.writeFileSync("./config.json", JSON.stringify(certificate), "utf8");
});
```
Get the students of the account and start the app
```typescript
client.getStudents(certificate).then(students => {
    client.startApp(certificate, students);
});
```
After that you can explore the source or TypeScript IntelliSense and use the rest of the features (more will be implemented). 

