# CrackSafe Thailand

A web application to help people in Thailand evaluate house damage after an earthquake, focusing on crack types and structural safety assessment.

## Features

- Input form for crack details (type, width, location, length)
- Risk level assessment (Low, Moderate, High)
- Guidance based on risk level
- Mobile-friendly interface
- Real-time feedback

## Tech Stack

- React with TypeScript
- Vite
- Chakra UI
- Framer Motion

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/craksafe.git
cd craksafe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select the crack type from the dropdown menu
2. Adjust the crack width using the slider
3. Choose the location of the crack
4. Select the length of the crack
5. Check if the crack is new since the earthquake
6. Indicate if the crack is growing
7. Click "Evaluate Risk" to get your assessment

## Risk Assessment Logic

The application uses a scoring system based on:

- Crack type severity
- Crack width
- Location (structural vs non-structural)
- Length
- Whether the crack is new or growing

## Disclaimer

This tool is for preliminary assessment only and should not be used as a substitute for professional structural engineering evaluation. Always consult with qualified professionals for accurate structural safety assessment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
