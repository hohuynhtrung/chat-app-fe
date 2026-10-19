# Bot

A small React chatbot UI with `/chat`, `/login`, and `/register` pages.

## Development

```sh
npm install
npm run dev
```

Set `VITE_BASE_API` in `.env` to the API base URL. Axios is configured in `src/utils/api.js`; successful responses are unwrapped from the API's `data` property. A 401 response triggers a shared refresh request to `POST /auth/refesh`, sending the locally stored `refresh_token` as `refesh_token`.

Chat messages are local mock data. Login and registration forms are UI-only.
