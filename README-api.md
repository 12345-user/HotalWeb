# catocycle-api

Express + MySQL API for Catocycle web.

## Quick Start

```bash
cp .env.example .env
# edit .env
npm install
npm run dev
```

## API

- `GET /api/activities`
- `POST /api/activities`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`
- `GET /api/people`
- `POST /api/people`
- `PUT /api/people/:id`
- `DELETE /api/people/:id`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/upload` (`multipart/form-data`, field: `file`)
