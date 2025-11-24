# App UI Plan: Safety Device Monitor

The app should primarily focus on presenting real-time status and providing alerts based on the data received from your FastAPI backend.

## 1. 🏠 Main Dashboard (Home Screen)
This screen provides an at-a-glance overview of the device's status. It should be the first thing the user sees.

### Header:

*   **Device Name/Status:** Clearly display the name (e.g., "Main Sensor Unit") and a large, color-coded status indicator (e.g., Green: OK, Yellow: Warning/Anomaly, Red: Alert).
*   **Last Update Time:** A small timestamp showing when the data was last received from the backend.

### Safety Status Cards (Primary Focus):

Use large, tappable cards for the most critical immediate safety readings. These should change appearance (color/icon) when an alert is active.

| Card,Sensor/Model               | Data Display                                                                                  | Alert Indication                      |
| :------------------------------ | :-------------------------------------------------------------------------------------------- | :------------------------------------ |
| 🔥 Fire/Flame                   | IR Flame Sensor                                                                               | """Clear"" or ""Flame Detected!"""    | Bright RED background on alert.       |
| 💨 Gas/Smoke                    | MQ2 Sensor                                                                                    | "PPM (Parts Per Million) reading or ""Low/Medium/High""" | ORANGE or RED background if levels are unsafe. |
| 🔊 Audio Status                 | Audio Classification Model (Backend)                                                          | """Normal Noise Level"" or ""Alert: [Model Classification]"" (e.g., ""Glass Break,"" ""Siren,"" ""Shout"")" | YELLOW background for recognized anomalies. |

### Secondary Sensor Status:

A smaller, dedicated section for environmental readings.

| Reading                 | Sensor        | Data Display                                          |
| :---------------------- | :------------ | :---------------------------------------------------- |
| 🌡️ Temperature          | DHT11         | "Current temperature reading (e.g., 25.5°C)"          |
| 💧 Humidity             | DHT11         | "Current humidity reading (e.g., $55 	ext{%}$)"       |
| 📏 Proximity/Distance   | Ultrasonic Sonar | "Current distance reading (e.g., 1.2 meters)"         |
| 🎤 Ambient Noise        | INMP411 (Raw) | "dB level or a simple ""Low/Normal/Loud"" indicator." |

## 🚨 Alerts & History Screen
This screen is dedicated to reviewing past and active events.

### Active Alerts Section:

*   A prominent banner at the top listing any currently unresolved alerts (e.g., "Gas detected since 17:30").

### Alert Log (Chronological List):

*   List all logged events, with clear details.
*   Each entry should include: Time/Date, Source Sensor/Model, Event Description (e.g., "Glass Break detected by Audio Model"), and a Severity Tag (e.g., "Critical," "Warning").
*   Filter/Sort options (e.g., by Date, Severity, Sensor Type).