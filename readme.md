CC22-FAKEBOOK-API
===
### env guide
PORT=8899  
DATABASE_URL=  
JWT_SECRET=

---

### Service

|path |method |authen |params |query |body |
|:-- |:-- |:-- |:-- |:-- |:-- |
|/api/auth/login|post |- |- |- | {identity, passowrd} |
|/api/auth/register |post |- |- |- |{identity, firstName, lastName, passwor, confirmPassword} |
|/api/auth/me|get|y|-|-|-|
|/api/post|get|y|-|-|-|
|/api/post|post|y|-|-|{message, image(file)}
|/api/post|put|y|:id|-|{message, image(file)}
|/api/post|delete|y|:id|-|-
|/api/comment|post|y|-|-|{message, postId}
|/api/like|post|y|-|-|{postId}
|/api/like|delete|y|:id|-|-
