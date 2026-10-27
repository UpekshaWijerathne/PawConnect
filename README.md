# 🐾 PawConnect — Pet Adoption Platform

PawConnect is a full-stack web application designed to connect people looking to adopt pets with animal shelters. The platform allows users to explore available pets, view pet details, submit adoption requests, and manage pet listings through role-based dashboards.

The project aims to make the pet adoption process more accessible, organized, and user-friendly.

## ✨ Features

### 🏠 Pet Browsing
- Browse available pets.
- View detailed information about individual pets.
- Search and filter pets using available criteria.
- View pet information, including species, breed, age, gender, vaccination status, and location.

### 👤 User Authentication
- User login and authentication.
- Role-based dashboard navigation.
- Separate experiences for adopters and shelters.

### ❤️ Adopter Dashboard
- View and manage saved favorite pets.
- Submit adoption requests.
- View adoption request statuses.
- Access pet information from the dashboard.

### 🏡 Shelter Dashboard
- Add new pet listings.
- Update existing pet information.
- Delete pet listings.
- Manage pets available for adoption.

### 🔧 Additional Capabilities
- REST API integration between the frontend and backend.
- MongoDB database integration using Mongoose.
- Responsive and reusable React components.
- Organized frontend services and backend routes.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| CSS | Styling and layouts |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Git and GitHub | Version control and collaboration |

## 📋 Prerequisites

Before running PawConnect locally, install:

- [Node.js](https://nodejs.org/) and npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas database
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/UpekshaWijerathne/PawConnect.git
cd PawConnect
```

### 2. Set up the backend

Open a terminal in the backend directory.

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by your server.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Use the actual variable names expected by your backend code. The example above must be adjusted if your application uses different names.

Start the backend using the script defined in the backend's `package.json`. For example:

```bash
npm start
```

If the project uses a development script, you may instead run:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

**Note:** The commands above assume the project has separate `frontend` and `backend` directories. Adjust the paths if your repository uses a different structure.

## 🗂️ Main Application Areas

The application is organized around these functional areas:

- **Home:** Introduction to the platform and pet discovery.
- **Pet Listings:** Browse and filter available pets.
- **Pet Details:** View information about a selected pet.
- **Login:** Authenticate users.
- **Adopter Dashboard:** Manage favorites and adoption requests.
- **Shelter Dashboard:** Manage pet listings.

## 🔌 API Overview

The backend exposes REST API endpoints for pet data and adoption-related operations.

| Endpoint | Purpose |
|---|---|
| `GET /api/pets` | Retrieve pet listings, with supported filters |
| `GET /api/pets/:id` | Retrieve details for a specific pet |
| `POST /api/pets` | Create a pet listing |
| `PUT /api/pets/:id` | Update a pet listing |
| `DELETE /api/pets/:id` | Delete a pet listing |

Additional authentication and adoption-request endpoints support user login and adoption workflows. Refer to the backend source code for their exact paths and request formats.

## 🔐 Environment Variables and Security

- Keep database credentials and authentication secrets in environment variables.
- Do not commit `.env` files or other secrets to GitHub.
- Configure appropriate `.gitignore` rules.
- Use valid authentication tokens for protected API operations.
- Enforce role-based authorization on the backend, not only in the frontend.
- Use strong, unique secrets and store passwords securely using a suitable password-hashing mechanism.

## 🧪 Testing

Test the main workflows before deploying:

- User login and role-based navigation.
- Pet browsing and detail views.
- Adding, updating, and deleting pet listings.
- Saving and removing favorite pets.
- Submitting and viewing adoption requests.
- Handling invalid input and API errors.
- Verifying protected routes and permissions.

## 🔮 Future Improvements

Potential future enhancements include:

- Online deployment and production configuration.
- Pet image upload and storage improvements.
- Advanced search and filtering.
- Email notifications for adoption request updates.
- Improved automated testing.
- Enhanced mobile responsiveness and accessibility.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the updated functionality.
5. Commit your changes with a descriptive commit message.
6. Submit a pull request.

## 📄 License

No license has been specified yet. Add an appropriate license file if you intend to permit others to reuse, modify, or distribute the project.

## 👩‍💻 Project Repository

GitHub: [UpekshaWijerathne/PawConnect](https://github.com/UpekshaWijerathne/PawConnect)

---

**PawConnect — Connecting loving homes with pets in need.** 🐾