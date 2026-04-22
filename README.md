# 🧩 HR Workflow Designer (React + React Flow)

## 📌 Overview

This project is a **visual workflow designer** that allows HR administrators to create, configure, and simulate internal workflows such as onboarding, leave approvals, and automated processes.

The application provides a **drag-and-drop canvas** where users can design workflows using different node types and test their execution in a sandbox environment.

---

## 🚀 Features

### 1. Workflow Canvas

* Drag-and-drop interface for building workflows
* Connect nodes with edges to define flow
* Select and delete nodes/edges
* Interactive canvas with zoom, pan, and minimap

### 2. Custom Node Types

* **Start Node** – Entry point of workflow
* **Task Node** – Human task (e.g., document collection)
* **Approval Node** – Approval step with role-based logic
* **Automated Node** – System-triggered actions
* **End Node** – Workflow completion

### 3. Dynamic Node Configuration

* Context-based form panel for editing selected node
* Controlled components for real-time updates
* Supports dynamic fields (e.g., action parameters for automated nodes)

### 4. Mock API Integration

* `GET /automations` → Fetch available automated actions
* `POST /simulate` → Simulate workflow execution

### 5. Workflow Simulation

* Serializes workflow graph (nodes + edges)
* Displays step-by-step execution output
* Provides a sandbox environment for testing workflows

---

## 🏗️ Architecture

The application is designed with **clear separation of concerns**:

```text
src/
  components/      → UI components (Canvas, Panels, Sidebar)
  nodes/           → Custom node implementations
  store/           → Global state management (Zustand)
  api/             → Mock API layer
  types/           → TypeScript interfaces and types
```

---

## 🧠 Core Concepts

### 1. Graph-Based Workflow

The workflow is represented as a **graph**:

* Nodes → workflow steps
* Edges → connections between steps

---

### 2. State Management (Zustand)

Global state is managed using Zustand:

* `nodes` → all workflow nodes
* `edges` → connections between nodes
* `selectedNode` → currently active node

This allows:

* centralized state
* predictable updates
* clean separation from UI

---

### 3. Data Flow

```text
User Action (drag/click)
        ↓
Event Handler (onDrop / onNodeClick)
        ↓
State Update (Zustand store)
        ↓
React Flow re-renders UI
```

---

### 4. Node Creation Flow

```text
Drag from sidebar
    ↓
Drop on canvas
    ↓
Create node with default data
    ↓
Add to global state
    ↓
Render via React Flow
```

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite + TypeScript)
* **Graph Engine:** React Flow (@xyflow/react)
* **State Management:** Zustand
* **Styling:** Tailwind CSS
* **API Layer:** Mock API (local abstraction)

---

## ▶️ How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🧪 Design Decisions

### Why React Flow?

Provides built-in support for:

* node-based UI
* edge connections
* zoom/pan controls

---

### Why Zustand?

* Lightweight and simple
* Avoids prop drilling
* Better suited for global graph state

---

### Why TypeScript?

* Ensures type safety for node data
* Improves maintainability and scalability

---

## ⚠️ Assumptions

* No backend persistence required (as per assignment)
* Mock APIs simulate real backend behavior
* Workflow validation is basic and can be extended

---

## 🚀 Future Improvements

* Graph validation (cycle detection, disconnected nodes)
* Export/Import workflows as JSON
* Undo/Redo functionality
* Enhanced simulation with detailed logs
* Role-based access for approvals

---

## 📌 Conclusion

This project demonstrates:

* Strong understanding of **React architecture**
* Ability to work with **graph-based systems**
* Clean **state management and component design**
* Practical handling of **dynamic forms and APIs**

---
