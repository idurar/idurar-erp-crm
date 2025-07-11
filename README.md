# Fullstack CRM Project (Django + React + SQLite)

## 📝 Overview

A full-stack CRM application built with Django (REST API backend), SQLite (database), and React (frontend). Supports CRUD operations on customer queries and their notes.

---

## 📁 Project Structure

```
fullstack-crm/
├── backend/             # Django backend (DRF)
│   ├── backend/         # Django settings
│   ├── core/            # App for Queries & Notes
│   ├── db.sqlite3
│   └── manage.py
├── frontend/            # React frontend
│   ├── public/
│   └── src/
│       ├── components/  # QueryList, QueryForm, NoteSection
│       └── App.js
|
├── README.md
└── API_Guide.txt        # API usage and testing guide
```

---

## ⚙️ Backend Setup (Django + DRF)

### 1. Create and activate virtual environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install dependencies and start project

```bash
pip install django djangorestframework django-filter django-cors-headers
```

### 3. Start Django project and app

```bash
django-admin startproject backend
cd backend
python manage.py startapp core
```

### 4. Update `settings.py`

* Add to `INSTALLED_APPS`:

```python
'rest_framework',
'django_filters',
'corsheaders',
'core',
```

* Add to `MIDDLEWARE`:

```python
'corsheaders.middleware.CorsMiddleware',
```

* Add CORS:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

* Add DRF config:

```python
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend']
}
```

### 5. Add models, serializers, views, and urls (see project code)

### 6. Migrate & run server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend available at: `http://localhost:8000/api/`

---

## 🌐 Frontend Setup (React)

### 1. Create app

```bash
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
```

### 2. Add components:

Create:

* `QueryList.js`
* `QueryForm.js`
* `NoteSection.js`
  Paste the code from the provided files.

### 3. Update `App.js`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QueryList from './components/QueryList';
import QueryForm from './components/QueryForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QueryList />} />
        <Route path="/add" element={<QueryForm />} />
        <Route path="/edit/:id" element={<QueryForm />} />
      </Routes>
    </Router>
  );
}
export default App;
```

### 4. Run app

```bash
npm start
```

Frontend available at: `http://localhost:3000`

---

## 🔍 Features

* Add, edit, and list customer queries
* Filter by status and paginate results
* Add/delete notes per query
* Responsive UI with internal CSS styling
* Django REST API with proper status codes and error messages

---

## 📬 API Testing

See `API_Guide.txt` for full list of:

* Endpoints
* Sample JSON
* cURL examples


---

## ✅ Technologies Used

* **Frontend**: React, Axios, React Router
* **Backend**: Django, Django REST Framework
* **Database**: SQLite
* **Other**: CORS, Pagination, Filtering

---

## 🧪 Testing Tips

* Use browser and Postman to test API endpoints

---

Happy coding! 🚀
