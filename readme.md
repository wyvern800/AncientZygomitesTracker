# Anachronia Zygomite Tracker - Alt1 Plugin

An Alt1 Toolkit plugin for RuneScape 3 that automatically tracks Ancient Zygomites of Anachronia. This plugin uses OCR to detect when you click on NPCs and automatically marks captured zygomites when their dialogue titles match.

## Features

- 🔍 **Automatic Detection**: Automatically detects and marks zygomites when you interact with NPCs
- 📋 **Visual Tracking**: Beautiful interface showing all 60 ancient zygomites with their capture status
- 🌍 **Multi-language Support**: Available in English (default) and Portuguese
- 📝 **Event Log**: Complete event history with timestamps and categorization
- 🎵 **Achievement Sound**: Plays congratulations sound when all 60 zygomites are captured
- 💾 **Persistent Storage**: Saves your progress automatically using localStorage
- 🎨 **Modern UI**: Built with Tailwind CSS and Bootstrap Icons for a clean, modern interface

## How to Use

1. **Installation**
   ```sh
   npm install
   npm run build
   ```

2. **Adding to Alt1**
   - Open the `dist` folder in Alt1 Toolkit
   - Click "Add App" to install the plugin
   - Grant pixel capture permissions when prompted

3. **Usage**
   - Click "▶ Start Monitoring" to begin tracking
   - Click on NPCs in-game to open their dialogue
   - The plugin automatically detects if the NPC is an ancient zygomite and marks it as captured
   - You can also manually mark/unmark zygomites by clicking on their names in the list
   - View all events in the "Events" tab
   - Use the language toggle button (EN/PT) to switch between English and Portuguese

## Controls

- **▶/⏸ Play/Pause Button**: Starts or stops automatic monitoring
- **🔄 Reset Button**: Resets all zygomites (requires confirmation)
- **EN/PT Language Toggle**: Switches between English and Portuguese
- **Status Tab**: View all 60 zygomites with their capture status
- **Events Tab**: View complete event log with timestamps

## Technical Details

- **Framework**: Alt1 Toolkit
- **Languages**: TypeScript, HTML, CSS
- **UI Libraries**: Tailwind CSS, Bootstrap Icons
- **OCR**: Uses Alt1's DialogReader for dialogue title detection
- **Build Tool**: Webpack
- **Storage**: Browser localStorage

## Development

### Build
```sh
npm run build
```

### Watch Mode (Auto-rebuild)
```sh
npm run watch
```

### Project Structure
```
src/
  ├── index.ts          # Main application logic
  ├── index.html        # HTML template
  ├── appconfig.json    # Alt1 app configuration
  ├── icon.png          # App icon
  └── songs/            # Audio files (congratulations.mp3)
```

## Requirements

- Alt1 Toolkit installed and running
- Pixel capture permissions enabled
- Modern browser with localStorage support

## Notes

- The plugin requires Alt1 to be running in-game to function
- Automatic detection works by reading dialogue titles using OCR
- The plugin remembers your progress between sessions
- Audio file (congratulations.mp3) is optional - the plugin works without it but won't play sound

## License

This project is provided as-is for educational and personal use.
