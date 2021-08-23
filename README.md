![client_banner](https://user-images.githubusercontent.com/49595640/130368393-8f5a1d8d-eee1-4955-85ac-46718e1a21b4.png)

# Client

## Related Projects

- [tria-frontend](https://github.com/WhySoBad/tria-frontend)
- [tria-backend](https://github.com/WhySoBad/tria-backend)

## Usage

### Installation

```cmd
npm install https://github.com/WhySoBad/tria-client
```

### Create Client Instance

```typescript
const client: Client = new Client({ log: true, credentials: { username: MAIL_ADDRESS, password: PASSWORD });
```

or

```typescript
const client: Client = new Client({ log: true, credentials: { token: AUTH_JWT });
```

## License 

MIT © [WhySoBad](https://github.com/WhySoBad)
