# Sentence Construction Quiz App

A web application that helps users practice sentence construction by filling in blanks with appropriate words.

## Features

- Interactive sentence completion with multiple word options
- 30-second timer per question
- Auto-navigation when timer ends
- Next button enabled only when all blanks are filled
- Score tracking and feedback
- Detailed results with correct and incorrect answers

## Tech Stack

- React.js
- TailwindCSS
- Vite

## Getting Started

### Prerequisites

Make sure you have Node.js (v14 or later) and npm installed.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sentence-correction.git
   cd sentence-correction
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `src/components/` - React components
- `src/data/` - Sample question data
- `src/services/` - API and data services

## API Integration

The app is designed to work with a JSON API that provides sentence construction questions. The current implementation uses local data, but it can be easily connected to a real API by updating the `questionService.js` file.

## License

MIT
