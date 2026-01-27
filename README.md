# Kollab ⚡

**The Operating System for Content Creators.**

![Kollab Dashboard Screenshot](https://github.com/simmrraann/kollab/issues/1)


## 📖 The Story: Why I Built This
As a content creator, I personally struggled with the "business" side of creativity. 

I used to manually write down brand deals in a physical diary. I had no way to track which payments were pending, I missed follow-up dates, and my data was scattered across Instagram DMs and emails. It was chaotic.

I realized I needed a dedicated database "Second Brain", specifically for collaborations. So, I built **Kollab**. It transforms scattered DMs into a structured workflow, helping creators like me stop worrying about admin work and focus on creating content.

## 🚀 Key Features

* **🤖 AI-Powered Data Entry:** Integrated **Google Gemini AI** to parse messy Instagram DMs. It automatically extracts Brand Name, Deliverables, Price, and Deadlines into structured data.
* **📊 Financial Analytics:** Visual dashboards to track Monthly Earnings, Payment Status (Paid vs. Pending), and Brand Analytics.
* **🎨 Dynamic Theming:** Features 3 distinct mood themes (Royal Muse, Steel Valor, Sage Studio) with a fully functional **Dark Mode**.
* **Kanban Workflow:** A Trello-style board to drag-and-drop collaborations from "Pending" to "Paid."
* **📅 Content Calendar:** Visual timeline to manage upcoming posting deadlines.
* **🔐 Secure Authentication:** Full login/signup system powered by Supabase.

## 🛠️ Tech Stack

* **Frontend:** React.js, TypeScript, Vite
* **Styling:** Tailwind CSS, Shadcn UI
* **Backend & Auth:** Supabase (PostgreSQL)
* **AI Integration:** Google Gemini API (LLM)
* **Charts:** Recharts
* **State Management:** React Context API

## 📸 Screenshots

| collaborations | Dark Mode |
|:---:|:---:|
| ![Collaborations](https://github.com/simmrraann/kollab/issues/4) | ![Dark Mode](https://github.com/simmrraann/kollab/issues/5) |

| AI Tools | Analytics |
|:---:|:---:|
| ![AI Tools](https://github.com/simmrraann/kollab/issues/2) | ![Analytics](https://github.com/simmrraann/kollab/issues/3) |

*(Note: I will update these placeholders with actual screenshots of the app running locally)*

## ⚡ Getting Started

1.  **Clone the repository**
    ```bash
    git clone (https://github.com/simmrraann/kollab.git)
    cd kollab
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    VITE_GEMINI_API_KEY=your_gemini_key
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```

## 🤝 Contributing
Built with ❤️ by **Simran**. Connect with me on [LinkedIn](https://www.linkedin.com/in/simran-builds/) 