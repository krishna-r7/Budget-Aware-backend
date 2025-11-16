# Budget‐Aware-backend

# Expense Tracker Application

A full-stack expense tracking application with budget management, real-time budget status, and monthly summaries.

## Features

- 🔐 **Authentication** - Sign up and log in with email/password
- 📊 **Category Management** - Create custom spending categories with colors
- 💰 **Budget Tracking** - Set monthly limits for each category
- ➕ **Expense Recording** - Add expenses and instantly see budget status
- 📈 **Monthly Summaries** - View spending vs budget reports for any month
- ⚠️ **Over Budget Alerts** - Visual indicators when spending exceeds limits

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React
- Tailwind CSS
- Lucide React Icons
- LocalStorage for session management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

3. Create a `.env` file (see `.env.example`):
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

4. Start the server:
```bash
node server.js or npm start
```

The API will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install react react-dom lucide-react
```

3. Update the API URL in `src/App.jsx` if needed:
```javascript
const API_URL = 'http://localhost:5000/api';
```

4. Start the development server:
```bash
npm run dev
```

The app will be running at `http://localhost:5000`

## Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js          # Express API server
│   ├── .env               # Environment variables
│   ├── .env.example       # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.jsx        # React application
│   ├── public/
│   └── package.json
└── README.md
```

## API Documentation

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": { ... }
}
```

### Categories

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer {token}

Response:
[
  {
    "_id": "category-id",
    "userId": "user-id",
    "name": "Food",
    "color": "#FF5733",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### Create Category
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Food",
  "color": "#FF5733",
  "icon": "🍔"
}
```

#### Update Category
```http
PUT /api/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Groceries",
  "color": "#00FF00"
}
```

#### Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer {token}
```

### Budgets

#### Get Budgets for Month
```http
GET /api/budgets/:year/:month
Authorization: Bearer {token}

Example: GET /api/budgets/2025/11

Response:
[
  {
    "_id": "budget-id",
    "userId": "user-id",
    "categoryId": { ... },
    "month": 11,
    "year": 2025,
    "limit": 500
  }
]
```

#### Create/Update Budget
```http
POST /api/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "category-id",
  "month": 11,
  "year": 2025,
  "limit": 500
}
```

#### Delete Budget
```http
DELETE /api/budgets/:id
Authorization: Bearer {token}
```

### Expenses

#### Add Expense
```http
POST /api/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "category-id",
  "amount": 45.50,
  "description": "Grocery shopping",
  "date": "2025-11-15"
}

Response:
{
  "expense": { ... },
  "budgetStatus": {
    "spent": 145.50,
    "limit": 500,
    "remaining": 354.50,
    "isOverBudget": false
  }
}
```

#### Get Expenses
```http
GET /api/expenses?year=2025&month=11
Authorization: Bearer {token}

Response:
[
  {
    "_id": "expense-id",
    "userId": "user-id",
    "categoryId": { ... },
    "amount": 45.50,
    "description": "Grocery shopping",
    "date": "2025-11-15T00:00:00.000Z",
    "month": 11,
    "year": 2025
  }
]
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer {token}
```

### Monthly Summary

#### Get Monthly Summary
```http
GET /api/summary/:year/:month
Authorization: Bearer {token}

Example: GET /api/summary/2025/11

Response:
{
  "year": 2025,
  "month": 11,
  "categories": [
    {
      "categoryId": "cat-id",
      "categoryName": "Food",
      "categoryColor": "#FF5733",
      "budget": 500,
      "spent": 145.50,
      "remaining": 354.50,
      "isOverBudget": false,
      "expenseCount": 3
    }
  ],
  "totals": {
    "totalBudget": 2200,
    "totalSpent": 1845.75
  }
}
```

## UI Pages

### 1. Auth Page
- Tabs for Sign Up and Log In
- Email and password fields
- Error handling
- Redirects to dashboard on success

### 2. Dashboard
- Header with current month and month selector
- Category cards showing:
  - Category name and color
  - Progress bar (spent/limit)
  - Remaining amount
  - "OVER BUDGET" badge if applicable
- Monthly summary totals
- Floating "Add Expense" button

### 3. Expense Form (Modal)
- Category dropdown
- Amount input
- Description (optional)
- Date picker (defaults to today)
- Shows "Within budget" or "Over budget" toast after saving

### 4. Settings → Categories
- List of existing categories with color dots
- Edit and delete buttons for each category
- "Add Category" dialog with name and color picker

### 5. Settings → Budgets
- List categories with budget input fields
- Auto-saves on blur
- Shows current month's budgets

## Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# JWT Secret (change this to a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
```

## Deployment


### Frontend Deployment 

1. Update API_URL in `.env` to your backend URL


## Demo Credentials

After signing up, you can create:
- Categories: Food, Rent, Entertainment, Transportation
- Set monthly budgets for each
- Add expenses and see real-time budget tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.