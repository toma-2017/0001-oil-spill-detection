## 🛰️ Oil Spill Detection with Sentinel-1 SAR in Google Earth Engine

This repository presents a **JavaScript-based workflow for automated oil spill detection** using **Sentinel-1 synthetic-aperture radar (SAR)** imagery, processed in **Google Earth Engine (GEE)**. Designed for **environmental monitoring applications**, the script identifies oil spills based on **backscatter anomalies**, leveraging SAR’s ability to operate **independently of cloud cover and sunlight**.

In this specific case, oil spill detection is demonstrated for the **Corantijn River**, located in the **western part of Suriname**.

 🔧 Workflow Overview

To detect oil spills using this script, follow these steps:

1. **Define a Region of Interest (ROI)**
   Create a polygon manually or upload a shapefile containing the desired area.

2. **Load Sentinel-1 SAR Imagery**
   Access VV and/or VH polarization data.

3. **Filter Imagery**
   Filter by **date range**, **orbit direction**, and **instrument mode** (e.g., IW).

4. **Visualize Filtered Images**
   Display the filtered images in the GEE Map Panel.

5. **Analyze Data for Oil Spill Detection**
   Apply backscatter thresholds or change detection techniques to isolate potential oil spills.

6. **Calculate Oil Spill Area**
   Use pixel area calculations to estimate the affected surface.

7. **Export Results**
   Export detected oil spill regions as a shapefile or asset.

8. **Visualize Results**
   Display detected oil spill areas on the map.

 ## 🧭 Practical Tips

* You may customize the **filtering parameters** (e.g., date range, polarization mode) to suit your region and monitoring goals.
* **ASCENDING orbit mosaics** are recommended when your ROI is in open waters and has relatively stable atmospheric conditions.



## 📡 Sentinel-1 SAR Polarization Modes: VV vs. VH

Sentinel-1 SAR imagery provides two polarization modes:

* **VV (Vertical transmit, Vertical receive)**
* **VH (Vertical transmit, Horizontal receive)**

These modes interact differently with surface features:

* **VV polarization** is **more sensitive to surface scattering**, making it ideal for detecting smooth, oil-covered water surfaces.
* **VH polarization** is **more responsive to volume scattering**, which is useful for detecting vegetation or complex structures.

> For **oil spill detection**, VV is typically **preferred** due to its superior contrast between **clean and oil-affected water**. However, **combining VV and VH** can enhance detection in **complex or vegetated** environments.


