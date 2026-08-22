# 🍽️ Menu Web Page Automation

An automated menu web-page project that converts restaurant menu information into a modern, visually appealing digital menu.

The project combines a **React + Vite frontend** with a **Python + Gemini menu extraction pipeline** to extract food items, prices, categories, vegetarian information, and images from a photographed menu.

## ✨ Features

* 📋 Digital restaurant menu interface
* 🍔 Organized food and beverage categories
* 💰 Displays item prices clearly
* 🥗 Vegetarian / non-vegetarian classification
* 🖼️ Food image support
* 🤖 AI-powered menu extraction using Google Gemini
* 📸 Extracts dish images directly from menu photographs when available
* 🔎 Optional stock-photo fallback for menu items
* 📦 Generates structured JSON menu data
* ⚡ Fast development using Vite and React
* 🎨 Tailwind CSS styling
* 🧩 Lucide React icons

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Lucide React
* ESLint

The project uses Vite with React and Tailwind CSS through the Vite configuration.

### AI / Backend Utilities

* Python
* Google Gemini API
* `google-genai`
* Pillow
* Requests
* JSON

The extraction script uses Gemini to analyze a photographed menu and return structured information such as name, description, price, category, vegetarian status, and photo coordinates.

## 📁 Project Structure

```text
vendorimage/
│
├── frontend/
│   ├── public/
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   └── vite.config.js
│
├── extract_menu.py
├── test_gemini.py
├── menu_test.jpg
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aryanbiju67-dot/Menu-web-page-automation.git
```

### 2. Open the project

```bash
cd Menu-web-page-automation
```

### 3. Go to the frontend

```bash
cd frontend
```

### 4. Install dependencies

```bash
npm install
```

The project defines `dev`, `build`, `lint`, and `preview` scripts in `package.json`.

### 5. Start the development server

```bash
npm run dev
```

Vite will provide a local URL, usually similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

## 🤖 Menu Image Extraction

The project includes a Python script that can analyze a photographed menu and convert it into structured data.

The extraction pipeline produces information in this format:

```json
{
  "id": 1,
  "name": "Spicy Chicken",
  "description": "A flavorful chicken dish",
  "price": 7.50,
  "category": "nonveg-main",
  "veg": false,
  "photo": "/photos/test-vendor/spicy-chicken.jpg"
}
```

### Supported Categories

The AI extraction pipeline classifies menu items into:

* `veg-starter`
* `nonveg-starter`
* `veg-main`
* `nonveg-main`
* `dessert`
* `beverage`

These categories are defined directly in the extraction prompt.

## 🔑 Gemini API Setup

The extraction script requires a Google Gemini API key.

On Windows Command Prompt:

```cmd
set GOOGLE_API_KEY=your-api-key-here
```

The script checks for `GOOGLE_API_KEY` before creating the Gemini client.

**Do not commit your API key to GitHub.**

Use environment variables instead of placing the key directly inside Python or JavaScript source code.

## 📸 Extract a Menu

Example:

```bash
python extract_menu.py menu_test.jpg --vendor-slug test-vendor
```

The script accepts the menu image and a vendor slug, then creates an output directory containing the generated menu JSON and any extracted food photos.

The generated menu JSON is saved using the vendor slug:

```text
output/
├── test-vendor-menu.json
└── photos/
    └── test-vendor/
```

## 🖼️ Image Processing

When Gemini detects a photograph of a specific dish on the menu, the script can use its bounding box to crop that image from the original menu photograph.

If a suitable image cannot be extracted, the project can optionally use an Unsplash image search when an `UNSPLASH_ACCESS_KEY` is available.

## 🧪 Testing Gemini

A simple test script is also included:

```bash
python test_gemini.py
```

It uploads `menu_test.jpg` to Gemini and asks the model to identify food items and prices from the menu image.

## 📦 Build for Production

From the `frontend` directory:

```bash
npm run build
```

The production build will be generated in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## 🧹 Linting

Run ESLint with:

```bash
npm run lint
```

The project uses ESLint with React Hooks and React Refresh configurations.

## 🔐 Environment Variables

Never commit secrets such as:

```text
GOOGLE_API_KEY
UNSPLASH_ACCESS_KEY
```

A `.env` file can be used locally:

```env
GOOGLE_API_KEY=your-gemini-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

Make sure `.env` is included in `.gitignore`.

## 🎯 Project Goal

The goal of **Menu Web Page Automation** is to reduce the manual work required to convert a restaurant's physical menu into a digital web menu.

### Basic workflow

```text
Restaurant Menu Image
        ↓
   Gemini AI Analysis
        ↓
Structured Menu Data
        ↓
Food Images + JSON
        ↓
React Web Interface
        ↓
Digital Restaurant Menu
```

## 🔮 Future Improvements

* 📱 Improve mobile responsiveness
* 🔍 Add menu search and filtering
* 🛒 Add online ordering functionality
* 🧾 Add cart and checkout
* 🌐 Add multiple languages
* 🏪 Support multiple restaurant vendors
* ☁️ Deploy the application online
* 🔐 Add proper backend authentication
* 🗄️ Store menus in a database
* 📊 Add restaurant/vendor dashboard

## 👨‍💻 Author

**Aryan Biju**

GitHub:
https://github.com/aryanbiju67-dot

---

⭐ If you find this project useful, consider giving the repository a star!
