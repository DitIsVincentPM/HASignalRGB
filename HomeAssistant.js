/* ---------- */
/*   DEVICE   */
/* ---------- */
export function Name() { return "HomeAssistant"; }
export function Version() { return "0.0.1"; }
export function Type() { return "network"; }
export function Publisher() { return "DitIsVincent"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() {return [0, 70]; }
export function DefaultScale(){return 1.0;}
export function ControllableParameters()
{
	return [
		{"property":"lightingMode", "group":"settings", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"settings", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
		{"property":"turnOff", "group":"settings", "label":"On shutdown", "type":"combobox", "values":["Do nothing", "Single color", "Turn device off"], "default":"Turn device off"},
        {"property":"shutDownColor", "group":"settings", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"#8000FF"}
	];
}

import * as hass from 'home-assistant-js-websocket';

// Home Assistant WebSocket URL
const websocketUrl = 'ws://homeassistant:8123/api/websocket';

// Access Token (generated from Home Assistant)
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyNjA4MzU2ZGUwNDI0ZjNkYjc2YWZiOWQxOTBmYjNhMSIsImlhdCI6MTcxNDMxMTg4MiwiZXhwIjoyMDI5NjcxODgyfQ.LBZzudYT8Yk4P0y-NjPZiJT_49UCyk7GuHHAlyOayR8';

// Create a connection object
const connection = new hass.Connection({ url: websocketUrl, accessToken });

// Initialize variables for managing light state
let lightingMode = 'Canvas';
let forcedColor = '#009bde';
let turnOffMode = 'Turn device off';
let shutDownColor = '#8000FF';

// Function to handle rendering based on Home Assistant data
function renderBasedOnHomeAssistantData(data) {
    // Update lightingMode, forcedColor, turnOffMode, shutDownColor based on data
    lightingMode = data.lightingMode || lightingMode;
    forcedColor = data.forcedColor || forcedColor;
    turnOffMode = data.turnOff || turnOffMode;
    shutDownColor = data.shutDownColor || shutDownColor;

    // Render the lights based on updated state
    renderLights();
}

// Function to render lights based on current state
function renderLights() {
    // Implement your rendering logic here based on lightingMode, forcedColor, etc.
    // Example: Update LED colors based on settings
    if (lightingMode === 'Canvas') {
        // Render lights in Canvas mode
        // Example: Set LED color to forcedColor
        const rgbColor = hexToRgb(forcedColor);
        setLedColor(0, rgbColor[0], rgbColor[1], rgbColor[2]);
    } else if (lightingMode === 'Forced') {
        // Render lights in Forced mode
        // Example: Handle different turnOff modes
        if (turnOffMode === 'Single color') {
            const rgbColor = hexToRgb(forcedColor);
            setLedColor(0, rgbColor[0], rgbColor[1], rgbColor[2]);
        } else if (turnOffMode === 'Turn device off') {
            // Turn off the lights (not implemented in this example)
            // Implement shutdown logic here
        }
    }
}

// Function to convert hex color to RGB array
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

// Initialize function (called when the device is initialized)
export function Initialize() {
    // Connect to Home Assistant WebSocket
    connection.connect().then(() => {
        console.log('Connected to Home Assistant WebSocket');
        
        // Subscribe to state changes for the light entity (adjust entity_id as needed)
        connection.subscribeEvents((event) => {
            if (event.event_type === 'state_changed' && event.data.entity_id === 'light.my_light_entity') {
                renderBasedOnHomeAssistantData(event.data.new_state.attributes);
            }
        });
    }).catch((error) => {
        console.error('Error connecting to Home Assistant:', error);
    });
}

// Function to set LED color (example)
function setLedColor(ledIndex, r, g, b) {
    // Implement your LED control logic here
    // Example: Update the LED color at the specified index
    console.log(`Setting LED ${ledIndex + 1} color to (${r}, ${g}, ${b})`);
}

// Shutdown function (called when the device is shutdown)
export function Shutdown() {
    // Clean up resources (e.g., disconnect from Home Assistant WebSocket)
    connection.close();
}
