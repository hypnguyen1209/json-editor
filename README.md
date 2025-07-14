# JSON Editor & Visualizer

A modern, feature-rich JSON data visualization and manipulation tool built with Vue 3, TypeScript, and D3.js. Process and visualize JSON, YAML, CSV, XML, and TOML data with interactive visualizations, all running locally in your browser.

![JSON Editor](https://img.shields.io/badge/Vue.js-3.4.15-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat&logo=vite&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-7.8.5-F9A03C?style=flat&logo=d3.js&logoColor=white)

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Format Support**: JSON, YAML, CSV, XML, and TOML parsing and formatting
- **Live Editor**: Monaco Editor with syntax highlighting and auto-completion
- **File Operations**: Upload files via button or drag-and-drop
- **Data Validation**: Real-time validation with error reporting
- **Format Conversion**: Convert between any supported formats
- **Export Options**: Download data or export visualizations as images

### 📊 Interactive Visualizations
- **Tree View** (Default): Hierarchical data structure with expandable nodes
- **Card View**: Modern card-based interface with type badges
- **Graph View**: Network visualization with interactive physics simulation
- **Zoom & Pan**: Navigate large datasets with precision controls
- **Dark/Light Theme**: Toggle between themes with instant visualization updates

### 🎨 Modern UI/UX
- **Split-Pane Layout**: Side-by-side editor and visualization
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Theme Support**: Beautiful dark and light modes
- **Professional Typography**: Monospace code fonts for better readability
- **Smooth Animations**: Hover effects and transitions throughout

### 🔧 Developer Tools
- **JSON Path Generation**: Right-click any element to copy its JSON path
- **Data Export**: Multiple export formats (PNG, JSON, etc.)
- **Sample Data**: Built-in examples to get started quickly
- **Type Indicators**: Color-coded badges for different data types
- **Error Handling**: Comprehensive validation and error reporting

### 🔒 Privacy-First
- **100% Local Processing**: All data stays in your browser
- **No Server Communication**: Works completely offline
- **No Data Storage**: Nothing is saved or transmitted

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/hypnguyen1209/json-editor
cd json-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 💡 Usage

### Basic Usage
1. **Upload Data**: Click "Upload" or drag-and-drop any supported file format
2. **Edit Data**: Use the Monaco editor with syntax highlighting
3. **Visualize**: Switch between Tree, Card, or Graph views
4. **Export**: Download formatted data or export visualizations

### Advanced Features
- **Format Conversion**: Select a different format from the dropdown to convert data
- **JSON Path Copying**: Right-click any element in visualizations to copy its path
- **Zoom Controls**: Use zoom buttons or mouse wheel in visualization panel
- **Theme Toggle**: Switch between light and dark modes instantly

### Supported File Formats
- **JSON** (`.json`) - JavaScript Object Notation
- **YAML** (`.yaml`, `.yml`) - YAML Ain't Markup Language
- **CSV** (`.csv`) - Comma-Separated Values
- **XML** (`.xml`) - eXtensible Markup Language
- **TOML** (`.toml`) - Tom's Obvious Minimal Language

## 🏗️ Technical Architecture

### Frontend Stack
- **Vue 3** with Composition API for reactive UI components
- **TypeScript** for type-safe development
- **Vite** for fast development and optimized builds
- **SCSS** for advanced styling capabilities
- **Pinia** for state management

### Visualization Libraries
- **D3.js v7** for interactive graph and tree visualizations
- **Monaco Editor** for advanced code editing capabilities
- **html2canvas** for image export functionality

### Data Processing
- **js-yaml** for YAML parsing and stringification
- **papaparse** for CSV parsing with type inference
- **xml2js** for XML to JSON conversion
- **@ltd/j-toml** for TOML format support

## 📁 Project Structure

```
json-editor/
├── src/
│   ├── components/
│   │   ├── layout/           # Header, Footer components
│   │   ├── ui/              # Reusable UI components
│   │   └── visualizations/   # Tree, Card, Graph views
│   ├── stores/              # Pinia store for state management
│   ├── styles/              # Global SCSS styles
│   └── utils/               # Data parsing and export utilities
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Coding
- **Strings**: Green (`#7ee787`) - Text data
- **Numbers**: Orange (`#ffa657`) - Numeric values  
- **Booleans**: Red (`#ff7b72`) - True/false values
- **Arrays**: Purple (`#d2a8ff`) - List structures
- **Objects**: Blue (`#79c0ff`) - Key-value pairs
- **Null/Undefined**: Gray (`#8b949e`) - Empty values

### Typography
- **Code Font**: SF Mono, Monaco, Cascadia Code (monospace)
- **UI Font**: System font stack for optimal performance
- **Consistent Spacing**: 8px grid system throughout

## 🔄 Key Features in Detail

### File Upload & Drag-Drop
- **Multiple Upload Methods**: Button click or drag-and-drop anywhere on the editor
- **Auto-Format Detection**: Automatically selects correct parser based on file extension
- **Error Handling**: Clear feedback for unsupported formats or parsing errors
- **File Info Display**: Shows current filename and validation status

### Monaco Editor Integration
- **Syntax Highlighting**: Language-specific highlighting for all supported formats
- **Auto-Completion**: Intelligent suggestions while typing
- **Error Indicators**: Real-time error highlighting and tooltips
- **Theme Synchronization**: Editor theme matches application theme

### Interactive Visualizations

#### Tree View (Default)
- **Hierarchical Structure**: Shows data nesting levels clearly
- **Expandable Nodes**: Click to expand/collapse any level
- **Type Badges**: Visual indicators for data types
- **Path Navigation**: Easy traversal of complex data structures

#### Card View
- **Modern Layout**: Card-based interface similar to popular tools
- **Responsive Grid**: Automatically adjusts to container size
- **Type Indicators**: Color-coded badges for immediate recognition
- **Hover Effects**: Smooth animations for better user experience

#### Graph View  
- **Network Visualization**: Shows relationships between data elements
- **Interactive Physics**: Drag nodes, enable/disable physics simulation
- **Zoom & Pan**: Navigate large datasets with mouse controls
- **Node Selection**: Click nodes to see detailed information

### Export Capabilities
- **Image Export**: High-quality PNG export of visualizations
- **Data Download**: Export formatted data in any supported format
- **JSON Path Copy**: Right-click any element to copy its path
- **Clipboard Integration**: One-click copying to clipboard

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

### Environment Setup
- **Node.js**: Version 16 or higher recommended
- **Package Manager**: npm or yarn
- **Browser**: Modern browsers with ES2020 support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include browser version and error messages

## 🎯 Roadmap

### Planned Features
- **Schema Validation**: JSON Schema validation support
- **Code Generation**: Generate code templates from data structures
- **JWT Decoding**: Built-in JWT token decoder
- **JSONPath Queries**: Advanced data querying capabilities
- **Diff Viewer**: Compare two JSON structures
- **Bookmark System**: Save and organize frequently used data

### Performance Improvements
- **Virtual Scrolling**: Handle extremely large datasets
- **Worker Threads**: Background data processing
- **Caching**: Intelligent data caching for better performance

---

**Made with ❤️ using Vue 3, TypeScript, and D3.js**

*Transform your data into beautiful, interactive visualizations with zero server dependencies.*
