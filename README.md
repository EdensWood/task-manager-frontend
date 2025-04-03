!)# Task Manager App 🚀

A full-stack task management application with Next.js frontend and Express/GraphQL backend.

![App Screenshot](/!)
) <!-- Add your screenshot if available -->

## Features ✨
- User authentication (login/signup)
- Create, read, update, and delete tasks
- Task status tracking (Pending/In Progress/Completed)
- Responsive dashboard with task statistics

## Tech Stack 🛠️
**Frontend**:
Next.js, Apollo Client, Tailwind CSS 

**Backend**:
Express, GraphQL, PostgreSQL, Sequelize  

**Deployment**:
Vercel (frontend), Render (backend)

---

## Project Setup 🛠️

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm/yarn

### Frontend Installation
git clone https://github.com/your-username/task-manager-frontend.git
cd task-manager-frontend
npm install

### Backend Installation
git clone https://github.com/your-username/task-manager-backend.git
cd task-manager-backend
npm install

## Running Locally
Start backend:
cd task-manager-backend
npm run dev


Start frontend:
cd task-manager-frontend
npm run dev

API Documentation 📚
GraphQL Schema

type Task {
  id: ID!
  title: String!
  description: String
  status: TaskStatus!
  createdAt: String!
}



enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}




type Query {
  myTasks: [Task!]!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  register(name: String!, email: String!, password: String!): AuthPayload!
  createTask(title: String!, description: String, status: TaskStatus!): Task!
  updateTask(id: ID!, title: String, description: String, status: TaskStatus): Task!
  deleteTask(id: ID!): Boolean!
}




Example Queries
USER LOGIM

mutation Login {
  login(email: "user@example.com", password: "password123") {
    token
    user {
      id
      email
    }
  }
}




Create Task:

mutation CreateTask {
  createTask(
    title: "Complete project", 
    description: "Finish the README file",
    status: IN_PROGRESS
  ) {
    id
    title
    status
  }
}




Get Tasks:

query GetTasks {
  myTasks {
    id
    title
    status
    createdAt
  }
}




Deployment Links 🌐

Frontend: https://task-manager-frontend.vercel.app

Backend API: https://task-manager-backend.herokuapp.com/graphql

GraphQL Playground: https://task-manager-backend.herokuapp.com/graphql
