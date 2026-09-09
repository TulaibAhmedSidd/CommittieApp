# 15 — Near Me Proximity Discovery & Geo-Search

**Associated Route**: `/userDash/near-me`  
**Target Role**: Member / Participant  
**Associated Screenshot**: `public/screenshot/member/near-me.png`  

---

## 1. Geo-Spatial Discovery Architecture

In Pakistani communities, participants often prefer participating in committees where the organizer or fellow members live in the same neighborhood (*Mohalla / Area*).

![Near Me](/screenshot/member/near-me.png)

---

## 2. MongoDB 2dsphere Geo-Query Implementation

- **Location Schema**:
  Both `Admin` and `Member` models implement GeoJSON Point specifications:
  ```javascript
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [Longitude, Latitude]
  }
  ```
  With spatial index: `AdminSchema.index({ location: "2dsphere" })`.

- **Proximity Search API (`/api/discovery` or `/api/near-me`)**:
  Utilizes MongoDB `$near` or `$geoWithin` with `$maxDistance` in meters to filter committees within selected radiuses (e.g., 5km, 10km, 25km).

- **Fallback Graceful Degradation**:
  If the user denies GPS geolocation permissions in the browser, the interface falls back to city-level keyword filtering (*"Karachi"*, *"Lahore"*, *"Islamabad"*).
