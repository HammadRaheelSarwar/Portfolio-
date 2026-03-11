# Hammad Raheel Sarwar - Developer Portfolio

A modern, dynamic, and fully responsive personal portfolio website built with React, Vite, Tailwind CSS, and Framer Motion. This portfolio showcases my skills, experience, projects, education, and achievements. It also features a fully functional Admin Panel connected to Supabase, allowing for real-time content updates without needing to edit the codebase.

## 🌟 Key Features

- **Modern & Dynamic CSS**: Glassmorphism, animated gradients, and 3D tilt effects.
- **Responsive Design**: Works perfectly across all devices (mobile, tablet, and desktop).
- **Backend Integration**: Supabase is used to fetch and store details dynamically, such as skills, projects, and site settings.
- **Admin Dashboard**: Secure admin route (`/admin/login`) to manage portfolio content via a highly intuitive interface.
- **Framer Motion Animations**: Smooth page transitions, scrolling animations, and interactive elements.
- **Live "Quote of the Day"**: Rotates daily quotes fetched live and stored in the database.

---

## 📸 Screenshots

*(You can add your actual screenshot images into a `public/screenshots/` folder so they appear here!)*

### Home Section
![Home Screen](./public/screenshots/home.png)
*The landing page featuring a dynamic aurora background, a floating code editor, and typewriter-effect titles.*

### About Section
![About Screen](./public/screenshots/about.png)
*A brief introduction, contact quick links, floating tech icons, and quick stats mapping my journey.*

### Skills Section
![Skills Screen](./public/screenshots/skills.png)
*A grid exhibiting technical skills, categorized and stylized with beautiful glowing progress bars.*

### Projects Section
![Projects Screen](./public/screenshots/projects.png)
*A masonry-like or grid layout of personal and professional projects, integrating links to live demos and GitHub repositories.*

### Experience & Education Sections
![Experience Screen](./public/screenshots/experience.png)
![Education Screen](./public/screenshots/education.png)
*Detailed timelines of my professional work experience and academic milestones.*

### Achievements Section
![Achievements Screen](./public/screenshots/achievements.png)
*A showcase of certificates, awards, and hackathon wins displayed via interactive 3D tilt-cards.*

### Contact Section
![Contact Screen](./public/screenshots/contact.png)
*A fully functional contact layout with WhatsApp/Phone integrations and direct message sending.*

### Admin Dashboard
![Admin Dashboard](./public/screenshots/admin.png)
*The secure backend panel where the portfolio's content can be created, updated, and deleted directly.*

---

## 🛠️ Technologies Used

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (for styling & utility classes)
- **Framer Motion** (for complex animations & transitions)
- **Lucide React** (for beautiful, consistent icon sets)
- **React Router DOM** (for page routing & protected Admin routes)
- **React Hot Toast** (for elegant notification popups)

### Backend & Database
- **Supabase** (PostgreSQL database, Row Level Security, and Storage)

---

## 🚀 Getting Started

To run this project locally, simply follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HammadRaheelSarwar/your-portfolio-repo.git
   cd your-portfolio-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 🔒 Admin Access

To access the management panel and update your portfolio:
1. Navigate to `/admin/login` on your live or local site.
2. Log in using your Supabase authentication credentials.
3. Manage settings, add new projects, update experiences, or read contact messages directly from the dashboard!

---

## ✍️ Author
**Hammad Raheel Sarwar**
- https://hammadraheelsarwarportfolio.vercel.app/
- [LinkedIn](https://www.linkedin.com/in/hammad-raheel-sarwar-884745317)
- [GitHub](https://github.com/HammadRaheelSarwar)
- [Kaggle](https://www.kaggle.com/hammadraheelsarwar)
