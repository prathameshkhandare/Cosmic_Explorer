# Cosmic_Explorer
*A Full-Stack Astronomy Picture of the Day Viewer (React + Node.js)*

A modern, fully-responsive web application to explore NASA’s **Astronomy Picture of the Day (APOD)**.  
Built with a stunning **cyan/blue cosmic theme**, a caching-optimized backend, and smooth UI components.

---

## 🌌 Features

### 🔭 View Today’s APOD  
Shows the daily NASA APOD with HD support, metadata & description.

### 📅 Search by Single Date  
Retrieve any specific APOD since **June 16, 1995**.

### 📆 Search by Date Range  
Load multiple APODs at once and browse them in grid format.

### 🖼️ Gallery with Filters  
Quickly load past APODs using:
- Last **10 days**  
- Last **15 days**  
- Last **20 days**

### ⚡ Fast Backend Caching  
- NASA API responses get cached  
- Future requests become instant  
- Reduces API calls and speeds up UX

### 💫 Modal View  
- Large preview  
- HD download  
- Open original link

### 📱 Fully Responsive Design  
Optimized for desktops, tablets, and mobile devices.

---

## 🛠 Tech Stack

### **Frontend**
- React (Vite)
- TailwindCSS
- Axios
- React Router
- Lucide React Icons

### **Backend**
- Node.js
- Express.js
- NASA APOD API
- dotenv
- Local Cache (in-memory)

---

## 📁 Project Structure

### **Frontend**

```
client/
 ├── src/
 │   ├── api/api.js
 │   ├── pages/
 │   │    ├── Home.jsx
 │   │    ├── Gallery.jsx
 │   ├── components/apod/
 │   ├── utils/
 │   ├── App.jsx
 │   └── main.jsx
 └── .env
```

### **Backend**

```
server/
 ├── routes/apod.routes.js
 ├── controllers/apod.controller.js
 ├── services/nasa.service.js
 ├── utils/cache.js
 ├── index.js
 └── .env
```

---

## ⚙️ Environment Variables

### **Frontend `.env`**

```
VITE_API_BASE_URL=http://localhost:4000
```

### **Backend `.env`**

```
PORT=4000
NASA_API_KEY=your_nasa_api_key_here
```

Get your NASA API key here:  
👉 https://api.nasa.gov/

---

## 🚀 Running the Project

### **Backend**

```bash
cd server
npm install
npm start
```

### **Frontend**

```bash
cd client
npm install
npm run dev
```

Then open:  
👉 http://localhost:5173/

---

## 🔥 API Endpoints

### 1. Today’s APOD or APOD by Date
```
GET /api/apod?date=YYYY-MM-DD
```

### 3. Recent APODs
```
GET /api/apod/recent?count=10
```

### 4. Date Range
```
GET /api/apod/range?start=YYYY-MM-DD&end=YYYY-MM-DD
```

---

## 🧠 Backend Caching Strategy

- Every APOD fetched is cached using a **date-based key**
- If a date is requested again → **served instantly**
- Range and recent queries reuse cached items
- No duplicate NASA fetches for the same date

---

## 🎨 UI / UX Highlights

- Dynamic cyan/blue glowing backgrounds  
- Smooth hover animations  
- Modern gradients and rounded layouts  
- Clean card system for APODs  
- Elegant modal with HD links  
- Date tabs and filters  
- Responsive grid layouts  

---


## 👨‍💻 Author  
**Prathmesh** — Full Stack Web Developer  
Building sleek interfaces & optimized backends 🚀🌌
