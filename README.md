# CrackSafe Thailand

เครื่องมือประเมินความปลอดภัยโครงสร้างบ้านหลังเหตุการณ์แผ่นดินไหว

## การติดตั้ง

1. ติดตั้ง dependencies:

```bash
npm install
```

## การพัฒนา

รันเซิร์ฟเวอร์สำหรับการพัฒนา:

```bash
npm run dev
```

## การ Build

สร้างไฟล์สำหรับ Production:

```bash
npm run build
```

## การใช้งาน

1. อัปโหลดรูปภาพรอยร้าว
2. เลือกรูปแบบรอยร้าว
3. ระบุความกว้างของรอยร้าว
4. เลือกตำแหน่งที่พบรอยร้าว
5. ระบุตำแหน่งที่ตั้งบนแผนที่ (คลิกที่แผนที่เพื่อเลือกตำแหน่ง)
6. ระบุว่าเป็นรอยร้าวใหม่หรือกำลังขยายตัวหรือไม่
7. กดปุ่ม "ตรวจสอบ" เพื่อรับผลการประเมิน

## เทคโนโลยีที่ใช้

- React + TypeScript
- Vite
- Chakra UI
- Leaflet (แผนที่แบบ Open Source)

## คำเตือน

เครื่องมือนี้ใช้สำหรับการประเมินเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการตรวจสอบโดยผู้เชี่ยวชาญได้

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
