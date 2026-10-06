:root {
  color-scheme: light;
  --ink: #353a32;
  --muted: #85877a;
  --olive: #536346;
  --olive-dark: #3a4931;
  --rose: #ead6cc;
  --cream: #f7f3ec;
  --line: #e6e3da;
  --white: #fffefa;
  --radius: 12px;
  --shadow: 0 8px 26px #353a3214;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 14px;
  color: var(--ink);
  background: var(--cream);
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 860px;
  height: 100vh;
  overflow: hidden;
}
button,
input,
select,
textarea {
  font: inherit;
}
button {
  color: inherit;
  cursor: pointer;
}
button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
canvas:focus-visible {
  outline: 3px solid #98a880;
  outline-offset: 3px;
}
button:disabled {
  opacity: .35;
  cursor: default;
}
button:disabled:hover {
  transform: none;
}
[hidden] {
  display: none !important;
}
h1,
h2,
h3,
p {
  margin-top: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.topbar {
  height: 88px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 28px;
  border-bottom: 1px solid var(--line);
  background: var(--white);
  position: relative;
  z-index: 2;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  color: var(--ink);
  text-decoration: none;
  font-family: Georgia, serif;
  font-size: 22px;
  letter-spacing: -.7px;
}
.brand-icon {
  font-family: Georgia, serif;
  font-size: 44px;
  color: var(--olive);
  line-height: 1;
}
.brand small {
  display: block;
  margin-top: 7px;
  font-family: "Segoe UI", sans-serif;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2.4px;
  color: var(--muted);
}
.project-heading {
  margin-left: auto;
  min-width: 130px;
  max-width: 260px;
  flex: 1;
}
.project-heading input {
  width: 100%;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  text-overflow: ellipsis;
  font-weight: 600;
}
.project-heading span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.button {
  min-height: 38px;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: background .16s, transform .16s;
  white-space: nowrap;
}
.button:hover {
  transform: translateY(-1px);
}
.primary {
  background: var(--olive);
  border-color: var(--olive);
  color: white;
}
.primary:hover {
  background: var(--olive-dark);
  border-color: var(--olive-dark);
}
.secondary {
  background: var(--white);
  border-color: var(--line);
  color: var(--ink);
}
.secondary:hover {
  background: #f0eee6;
}
.subtle {
  background: transparent;
  color: #737568;
}
.subtle:hover {
  background: #eeeee6;
}
.danger {
  background: #fcf0eb;
  color: #a15342;
  border-color: #efdad3;
}
.danger:hover {
  background: #f4dfd7;
}
.full-width {
  width: 100%;
}
.studio {
  display: grid;
  grid-template-columns: 286px minmax(280px, 1fr) 250px;
  height: calc(100vh - 88px);
}
.materials {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--line);
  background: var(--white);
  overflow-y: auto;
}
.panel-heading {
  padding: 30px 22px 22px;
}
.eyebrow {
  display: block;
  margin-bottom: 12px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--olive);
}
.panel-heading h1 {
  margin-bottom: 10px;
  font: 24px Georgia, serif;
  letter-spacing: -.5px;
}
.panel-heading p {
  margin-bottom: 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--muted);
}
.tabs {
  display: flex;
  margin: 0 16px;
  padding: 4px;
  gap: 2px;
  border-radius: 9px;
  background: #f2f0e9;
}
.tab {
  flex: 1;
  padding: 10px 4px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-size: 11px;
  color: #797c70;
}
.tab.active {
  background: var(--white);
  color: var(--olive);
  box-shadow: 0 2px 5px #343a3210;
  font-weight: 700;
}
.tab:hover {
  color: var(--olive-dark);
}
.material-panel {
  padding: 24px 20px;
}
.upload-zone {
  width: 100%;
  min-height: 177px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 10px;
  border: 1px dashed #b8bfaa;
  border-radius: var(--radius);
  background: #f6f7ef;
  transition: background .2s;
}
.upload-zone:hover {
  background: #ebefdf;
}
.upload-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8eddc;
  color: var(--olive);
  font-size: 28px;
}
.upload-zone strong {
  font-size: 12px;
  font-weight: 600;
}
.upload-zone > span:not(.upload-icon) {
  font-size: 11px;
  color: var(--muted);
}
.upload-zone small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 9px;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin: 24px 0 14px;
}
.section-title h2 {
  margin: 0;
  font-size: 12px;
  font-weight: 650;
}
.section-title > span {
  color: var(--muted);
  font-size: 9px;
}
.photo-library {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.empty-library {
  grid-column: 1 / -1;
  padding: 16px 10px;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
}
.photo-thumb {
  padding: 6px 6px 15px;
  border: 1px solid var(--line);
  background: white;
  box-shadow: 0 3px 8px #353a320a;
  transition: transform .2s;
}
.photo-thumb:hover {
  transform: rotate(-3deg);
}
.photo-thumb img {
  display: block;
  width: 100%;
  height: 95px;
  object-fit: cover;
}
.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 30px;
  padding: 16px 13px;
  background: #f8f2e8;
  border-radius: 9px;
  color: #92816c;
}
.tip-card > span {
  font-size: 23px;
  line-height: 1.1;
}
.tip-card p {
  margin: 0;
  font-size: 11px;
  line-height: 1.7;
}
.materials-footer {
  margin-top: auto;
  padding: 22px 15px;
  text-align: center;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: #a4a391;
}
.workspace {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background-color: #eae9e1;
  background-image: radial-gradient(#c9cbbf 1px, transparent 1px);
  background-size: 18px 18px;
}
.workspace-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-height: 58px;
  padding: 8px 18px;
  background: #f8f7f1ed;
  border-bottom: 1px solid #dedfd4;
}
.history-controls,
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
.icon-button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-size: 22px;
  color: #666f5c;
}
.icon-button:hover {
  background: #e5e8db;
}
.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #dcdfd2;
  margin: 0 10px;
}
.page-label {
  font-size: 10px;
  color: #818575;
  white-space: nowrap;
}
.page-label span {
  margin: 0 4px;
}
.zoom-controls output {
  min-width: 38px;
  text-align: center;
  font-size: 11px;
  color: #767d6b;
}
.canvas-viewport {
  position: relative;
  flex: 1;
  overflow: auto;
  min-height: 0;
  padding: 38px;
  scrollbar-color: #c5c8ba transparent;
}
.canvas-wrap {
  position: relative;
  margin: auto;
  box-shadow: 0 15px 45px #4b514229, 0 2px 7px #4b514220;
  background: #fffaf0;
}
#canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: default;
}
.drop-overlay {
  position: absolute;
  inset: 15px;
  display: grid;
  place-items: center;
  background: #f3f6e8ed;
  border: 3px dashed #96a381;
  border-radius: 18px;
  font: 25px Georgia, serif;
  color: var(--olive);
  pointer-events: none;
}
.workspace-footer {
  min-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  background: #f8f7f1ed;
  color: #838775;
  font-size: 9px;
}
.inspector {
  min-height: 0;
  overflow-y: auto;
  padding: 28px 20px;
  background: var(--white);
  border-left: 1px solid var(--line);
}
.inspector-heading h2 {
  margin-bottom: 24px;
  font: 23px Georgia, serif;
}
.selection-empty {
  padding: 24px 8px;
  text-align: center;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
.selection-empty > span {
  display: block;
  margin-bottom: 16px;
  font-size: 30px;
  color: #a5ac97;
}
.selection-empty h3 {
  font-size: 12px;
  font-weight: 600;
}
.selection-empty p {
  margin-bottom: 0;
  font-size: 11px;
  line-height: 1.8;
  color: var(--muted);
}
.selected-type {
  margin-bottom: 18px;
  padding: 8px 10px;
  border-radius: 5px;
  background: #eff1e6;
  font-size: 11px;
  color: var(--olive);
}
.field {
  display: block;
  margin: 16px 0;
  color: #727665;
  font-size: 11px;
  font-weight: 600;
}
.field input:not([type="color"]),
.field select,
.field textarea {
  display: block;
  width: 100%;
  margin-top: 8px;
}
.field input[type="number"],
.field select,
.field textarea {
  padding: 9px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fffefa;
  color: var(--ink);
  font-size: 12px;
  font-weight: 400;
}
.field textarea {
  resize: vertical;
  min-height: 65px;
  max-height: 220px;
  line-height: 1.6;
}
.field textarea::placeholder {
  color: #a4a799;
}
.field input[type="range"] {
  accent-color: var(--olive);
  cursor: pointer;
}
.field output {
  float: right;
  color: var(--muted);
  font-weight: 400;
}
.inline-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
input[type="color"] {
  width: 42px;
  height: 30px;
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: white;
  cursor: pointer;
}
.field-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.field-pair .field {
  margin-top: 0;
}
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 20px 0;
  font-size: 11px;
  color: #737867;
}
.checkbox-field input {
  accent-color: var(--olive);
}
.arrange-controls {
  display: grid;
  gap: 8px;
  margin-top: 18px;
}
.element-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.layers-section {
  margin-top: 28px;
  padding-top: 2px;
  border-top: 1px solid var(--line);
}
.layers-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 265px;
  overflow-y: auto;
}
.layer {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: white;
  text-align: left;
  font-size: 11px;
}
.layer.active {
  background: #eff2e5;
  border-color: #a9b798;
  color: var(--olive);
}
.layer span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.layers-empty {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.7;
}
.keyboard-tip {
  margin-top: 30px;
  color: #919582;
  font-size: 10px;
}
.keyboard-tip strong {
  font-weight: 600;
}
.keyboard-tip p {
  margin: 8px 0 0;
  line-height: 1.9;
}
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.swatch {
  height: 34px;
  border: 1px solid #00000015;
  border-radius: 7px;
  transition: transform .15s;
}
.swatch:hover {
  transform: scale(1.1);
}
.paper-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.paper-sample {
  height: 78px;
  border: 1px solid #00000009;
  box-shadow: 2px 3px 0 #0000000d;
  font: 11px Georgia, serif;
  color: #404735;
  transform: rotate(-2deg);
}
.paper-sample:nth-child(even) {
  transform: rotate(2deg);
}
.paper-sample:hover {
  transform: rotate(0) scale(1.03);
}
.tape-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 4px;
}
.tape-sample {
  height: 30px;
  border: 0;
  opacity: .8;
  transform: rotate(-5deg);
  clip-path: polygon(3% 0, 98% 0, 95% 25%, 100% 50%, 95% 75%, 98% 100%, 0 100%, 4% 75%, 0 50%, 4% 25%);
}
.tape-sample:hover {
  opacity: 1;
}
.panel-description {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.sticker-button {
  height: 53px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #faf9f3;
  font-size: 29px;
  transition: transform .15s, background .15s;
}
.sticker-button:hover {
  transform: rotate(-8deg) scale(1.1);
  background: #f2efdf;
}
.text-preset {
  width: 100%;
  display: block;
  margin-bottom: 12px;
  padding: 20px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbf9f2;
  text-align: left;
}
.text-preset:hover {
  background: #f1eee1;
}
.text-preset small {
  display: block;
  margin-top: 10px;
  color: var(--muted);
  font: 10px "Segoe UI", sans-serif;
}
.text-title {
  font: 22px Georgia, serif;
}
.text-hand {
  font: italic 19px cursive;
}
.text-caption {
  font: 12px monospace;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  z-index: 10;
  max-width: min(560px, 90vw);
  padding: 14px 22px;
  background: var(--olive-dark);
  color: #fffefa;
  border-radius: 10px;
  box-shadow: var(--shadow);
  font-size: 12px;
  line-height: 1.6;
  pointer-events: none;
}
dialog {
  width: 430px;
  max-width: 90vw;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--white);
  color: var(--ink);
  box-shadow: 0 20px 100px #22222240;
}
dialog::backdrop {
  background: #303a2c55;
  backdrop-filter: blur(3px);
}
dialog h2 {
  font: 27px Georgia, serif;
}
dialog p {
  font-size: 13px;
  line-height: 1.8;
  color: #7f8174;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}
@media (min-width: 1500px) {
  .studio {
    grid-template-columns: 310px minmax(280px, 1fr) 280px;
  }
  .material-panel {
    padding: 26px;
  }
  .inspector {
    padding: 30px 26px;
  }
}
@media (max-width: 1100px) {
  .topbar {
    padding: 0 16px;
    gap: 16px;
  }
  .brand {
    font-size: 18px;
  }
  .studio {
    grid-template-columns: 242px minmax(280px, 1fr) 220px;
  }
  .panel-heading {
    padding: 25px 16px 20px;
  }
  .material-panel {
    padding: 20px 15px;
  }
  .inspector {
    padding: 24px 14px;
  }
  .workspace-toolbar {
    padding: 8px;
  }
  .page-label {
    display: none;
  }
  .header-actions {
    gap: 3px;
  }
  .header-actions .button {
    padding: 8px 9px;
    font-size: 11px;
  }
  .workspace-footer span:last-child {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }
}
@media print {
  body {
    min-width: 0;
    height: auto;
    overflow: visible;
  }
  .topbar,
  .materials,
  .inspector,
  .workspace-toolbar,
  .workspace-footer {
    display: none;
  }
  .studio {
    display: block;
    height: auto;
  }
  .canvas-viewport {
    padding: 0;
    overflow: visible;
  }
  .canvas-wrap {
    width: 100% !important;
    height: auto !important;
    box-shadow: none;
  }
  #canvas {
    height: auto;
  }
}

