This folder contains PlantUML sources for diagrams representing the r-products project.

Files:
- erd.puml: Entity Relationship Diagram derived from Django models
- dfd.puml: Data Flow Diagram (context + level-1)

To render PDFs using PlantUML (needs Java + plantuml):

1. Install PlantUML and Graphviz. On Debian/Ubuntu:
   sudo apt update && sudo apt install plantuml graphviz -y

2. Render PDFs:
   plantuml -tpdf erd.puml
   plantuml -tpdf dfd.puml

This will create `erd.pdf` and `dfd.pdf` in this directory.

If you prefer, use the PlantUML VSCode extension to preview and export to PDF.



====================================================================================

Haan, tumi kono install na koreo **free online website** diye `.puml` theke **PDF** generate korte paro.

---

## 🌐 Free Websites to Convert `.puml` to PDF:

### ✅ 1. **PlantUML Live Editor (Kintu PDF export nei)**

🔗 [https://www.planttext.com/](https://www.planttext.com/)
🔗 [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)

* Ekhane `.puml` code paste kore **diagram preview** dekhte paro.
* But PDF export option nei — **PNG/SVG** export kora jai.
* PDF chai, tahole PNG/SVG download kore PDF banate hobe (browser or print-as-PDF diye).

---

### ✅ 2. **Kroki.io (SVG support)**

🔗 [https://kroki.io/](https://kroki.io/)

* Eita ekta powerful rendering server.
* CLI theke use kora jai, but **direct web interface nai**.
* Use with [Kroki Web Clients](https://kroki.io/#usage).

---

### ✅ 3. **PlantUML QEditor (Windows only, install needed)**

Offline tool, PDF export kore — but **install lagbe**.

---

## 🖨️ Workaround (Quickest Way):

1. **Go to:** [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)
2. Paste your `dfd-diagram.puml` code.
3. Diagram render hobe.
4. Right-click on diagram → **Save as PNG**.
5. Open the PNG and **Print as PDF**.

---

## 📌 Tips:

* Most free websites don’t directly give **PDF**, but you can convert **PNG to PDF** easily:

  * Browser theke `Print → Save as PDF`
  * Or use [https://pdf.online](https://pdf.online), [https://www.ilovepdf.com/jpg\_to\_pdf](https://www.ilovepdf.com/jpg_to_pdf)

---

Bolo jodi tumi ekta ready-made **script chai jeita `.puml` theke server use kore PDF banay.** Tahole ami Python script o dite pari.
