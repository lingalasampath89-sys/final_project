# 🧬 Neural XML Intelligence Lab

A high-performance, AI-driven XML analysis and visual dashboard. This system flattens hierarchical XML structures, predicts missing data using Deep ML (GNNs/Transformers), and identifies structural anomalies.

## 🚀 Key Features
- **Neural Flattening Engine**: Automatically transforms complex XML into searchable, sortable Grid Views.
- **Deep ML Reasoning**: Predicts missing tags and values using advanced machine learning models (GNN, Transformer logic).
- **Structure Analysis**: Real-time detection of XML schema anomalies and structural inconsistencies.
- **Glassmorphic UI**: Premium, state-of-the-art dashboard built with React and Tailwind CSS.

## 🛠 Tech Stack
- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui.
- **Backend**: Python, FastAPI, XML Parsing Engines, ML Prediction Core.
- **Data**: Supabase for persistent storage and real-time features.

## 📦 Setup Instructions

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies (ensure you have Python 3.10+):
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```bash
   python api_server.py
   ```

### Frontend Setup
1. From the project root, install Node dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Running Tests
To verify the ML reasoning logic:
```bash
python backend/test_deep_ml_reasoning.py
```

---
Built with ❤️ for Neural XML Analysis.
