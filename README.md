# 📝 Task Management App

A full-stack task management web app built with **Node.js**, **PostgreSQL**, **GraphQL**, and **Next.js**. Users can register, log in, and manage tasks across statuses (like a Kanban board).

---

## 🌐 Live Links

- **Frontend (Next.js)**: [https://leafywoodz.com](https://leafywoodz.com)  
- **Backend (Express + GraphQL)**: [https://backend-l9gz.onrender.com](https://backend-l9gz.onrender.com)

---

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Apollo Client, Tailwind CSS
- **Backend**: Node.js, Express.js, GraphQL (Apollo Server), Sequelize ORM
- **Database**: PostgreSQL (hosted or local)
- **Authentication**: Sessions + Secure Cookies (with optional JWT support)
- **Hosting**: Vercel (frontend), Render (backend)

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/EdensWood/task-manager-frontend.git
cd task-manager-frontend
```

## Install Dependanices
```bash
npm install
```

## Configure envrionmental varibale
```bash
DATABASE_URL=postgres://username:password@localhost:5432/taskdb
SESSION_SECRET=supersecretvalue
JWT_SECRET=superjwtsecret
CORS_ORIGIN=https://leafywoodz.com
```

## Start the development server
```bash
npm run dev
```
Your server will start on http://localhost:4000


---

## 📘 GraphQL API Documentation
### 🔎Queries
me
```bash
query {
  me {
    id
    name
    email
  }
}
```
users
```bash
query {
  users {
    id
    name
    email
  }
}
```

tasks
```bash
query {
  tasks {
    id
    title
    status
    user {
      id
      name
    }
  }
}
```

myTasks
```bash
query {
  myTasks {
    id
    title
    status
    description
  }
}
```

##✍️ Mutations

register
```bash
mutation {
  register(name: "John Doe", email: "john@example.com", password: "password123") {
    user {
      id
      name
    }
    token
    message
  }
}
```

login
```bash
mutation {
  login(email: "john@example.com", password: "password123") {
    user {
      id
      name
    }
    token
    message
  }
}
```
## 🧪 Testing
You can use GraphQL Playground or any GraphQL client like Postman or Insomnia.

Make sure to include the session cookie or JWT token when making authenticated requests.
