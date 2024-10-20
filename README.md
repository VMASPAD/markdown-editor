# Markdown Editor

This project is a Markdown editor built with Electron and React, written in TypeScript. The editor supports GitHub Flavored Markdown (GFM), math expressions with KaTeX, and Mermaid diagrams for flowcharts, Gantt charts, and other graphical representations.

## Features

- **Markdown Editor**: Write and edit markdown content.
- **Mermaid Diagrams**: Supports rendering Mermaid syntax for diagrams.
- **KaTeX Support**: Display math expressions with KaTeX.
- **Component Management**: Save and manage reusable components for insertion into markdown.
- **LocalStorage**: Automatically saves markdown content and custom components to `localStorage`.
- **File Handling**: Import and export markdown files.
- **Carousel and Drawer UI**: Browse saved components and archives with an interactive UI.
- **Custom CSS**: Apply custom CSS styles to the editor.

![Editor](https://portfoliotavm.com/markdown-editor/(3).gif)
![Components](https://portfoliotavm.com/markdown-editor/(1).gif)
![CSS](https://portfoliotavm.com/markdown-editor/(2).gif)
![Mermaid Diagrams](https://portfoliotavm.com/markdown-editor/(4).gif)
![LaTeX Support](https://portfoliotavm.com/markdown-editor/(5).gif)
![External Archives](https://portfoliotavm.com/markdown-editor/(6).gif)
## Technologies Used

- **Electron**: Desktop application framework.
- **React**: Front-end JavaScript library.
- **TypeScript**: Strongly typed superset of JavaScript.
- **React Markdown**: Markdown renderer for React.
- **Mermaid**: Diagrams and flowcharts generation from markdown code blocks.
- **KaTeX**: Fast math typesetting for LaTeX expressions.
- **Lucide Icons**: Icons for actions like importing and saving.
- **Tailwind CSS**: Utility-first CSS framework.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VMASPAD/markdown-editor.git
   ```
2. Navigate to the project directory:

   ```bash
   cd electron-markdown-editor
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the Electron app:

   ```bash
   npm run start
   ```

## Usage

1. Write markdown code in the editor on the left side of the screen.
2. View the rendered markdown in the preview pane on the right.
3. Use the **Import** icon to load a markdown file or the **Save All** icon to export the content.
4. Add custom components with the "Components" button. Components can be reused in the editor.
5. Use the **CSS** sheet to apply custom styles in HSL.

### Mermaid Diagrams

To include Mermaid diagrams in your markdown, use a code block with the language set to `mermaid`:

```markdown
\`\`\`mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
\`\`\`
```

### Math Expressions

You can also include math expressions using KaTeX:

```markdown
Inline math: $E = mc^2$

Block math:
$$
\int_0^\infty x^2 dx
$$
```

## Components

You can save reusable components (with a name and description) to insert into your markdown later. Components are saved in `localStorage` and can be managed via the "Components" drawer.

## Development

To build and package the application, use:

```bash
npm run build
```
