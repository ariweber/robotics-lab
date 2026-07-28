# Robotics Lab

School robotics lab management system — students and lab sessions.

Built with Node.js + Express, using two separate databases:

- **Students** — MongoDB
- **Lab sessions & registrations** — PostgreSQL (Supabase)

## Project Structure

```
robotics-lab/
├── src/
│   ├── app.js                  # Express app, routers and error handler
│   ├── DB/
│   │   ├── mongoDB.js          # MongoDB connection (students)
│   │   └── supabase.js         # Supabase client (sessions)
│   ├── DAL/
│   │   ├── users.dal.js        # Students data access (MongoDB)
│   │   └── sessions.dal.js     # Sessions data access (Supabase)
│   ├── services/
│   │   ├── users.service.js    # Students business logic
│   │   └── sessions.service.js # Sessions logic incl. registration
│   ├── controllers/
│   │   ├── users.controller.js
│   │   └── sessions.controller.js
│   ├── routes/
│   │   ├── users.router.js
│   │   └── sessions.router.js
│   ├── middlewares/
│   │   └── validate.middleware.js  # Zod validation (body + params)
│   ├── validations/
│   │   ├── users.validation.js
│   │   └── sessions.validation.js
│   └── utils/
│       └── createError.js
├── dockerfile
├── package.json
└── README.md
```

## API Endpoints

| Method | Path                            | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | `/users`                        | Create a student               |
| GET    | `/users/:userId`                | Get student details            |
| POST   | `/sessions/:sessionId/register` | Register a student to a session|
| GET    | `/sessions/:sessionId`          | Get session details            |

## Database Choices

**Students — MongoDB.** A student is a single self-contained document (details
plus a `labSessionsIds` array), updated one record at a time with atomic
operators like `$addToSet`. No cross-record transactions are needed, so a
relational DB would only add a join table without giving anything back.

**Lab Sessions — PostgreSQL (Supabase).** The capacity limit must hold even
under parallel registrations, and that's a relational DB's job: a
`registrations` table with a composite primary key `(session_id, student_id)`
blocks duplicate registrations at the DB level, and `registeredCount` is just a
row count. A document DB can't enforce constraints across documents — the
capacity check would move to JS code, where two parallel requests could both
see "one spot left" and both register.

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables — the project connects to cloud databases
   (MongoDB Atlas + Supabase), so no local database setup is needed:

   - **Graders:** the `.env` file is provided separately with the submission.
     Place it in the project root.
   - **Others:** copy `.env.example` to `.env` and fill in your own
     MongoDB and Supabase credentials.

3. Start the server:

   ```bash
   npm start
   ```

   The server runs on `http://localhost:3000` (or the port set in `PORT`).
