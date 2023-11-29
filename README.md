# Time Tracker

Time Tracker, A swift and user-friendly tool for teams to log hours, tasks, and projects, with automatic date/time recording and weekly work summaries.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Clone the repository](#clone-the-repository)
  - [Install dependencies](#install-dependencies)
    - [Server - Backend (Django)](#server---backend-django)
    - [Web - Frontend (React.js)](#web---frontend-reactjs)
  - [Setup database](#setup-database)
  - [Run the server](#run-the-server)
  - [Run the web](#run-the-web)
  - [Create a superuser (admin account)](#create-a-superuser-admin-account)

## Technologies Used

- Frontend

![https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)


- Backend

![https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
![https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white](https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white)

## Installation

### Clone the repository

```bash
git clone https://github.com/noeyislearning/time-tracker.git
```

### Install dependencies

#### Server - Backend (Django)

- First go to the `server` directory

```bash
cd server
```

- Create a virtual environment

```bash
python -m venv venv
```

- Activate the virtual environment

```bash
venv\Scripts\activate
```

- Install the dependencies

```bash
pip install -r requirements.txt
```

#### Web - Frontend (React.js)

- Go to the `web` directory

```bash
cd web
```

- Install the dependencies

```bash
npm install
```

### Setup database

- Go to the `server` directory

```bash
cd server
```

- Make migrations

```bash
python manage.py makemigrations
```

- Migrate

```bash
python manage.py migrate
```

### Run the server

- Go to the `server` directory

```bash
cd server
```

- Run the server

```bash
python manage.py runserver
```

### Run the web

- Go to the `web` directory

```bash
cd web
```

- Run the web

```bash
npm run dev
```

### Create a superuser (admin account)

- Go to the `server` directory

```bash
cd server
```

- Create a superuser

```bash
python manage.py createsuperuser
```
