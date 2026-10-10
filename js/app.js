'use strict';

// O editor usa Canvas nativo e não depende de bibliotecas externas.
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');
  const WIDTH = 1000;
  const HEIGHT = 1200;
  const MAX_ITEMS = 200;
  const MAX_PHOTOS = 40;
  const HISTORY_LIMIT = 60;
  const TYPES = ['photo', 'paper', 'tape', 'text', 'sticker'];
  const fontLibrary = window.ScrapbookFonts;
  let newTextFont = 'Georgia';
  let fontRequest = 0;
  const PATTERNS = ['plain', 'dots', 'grid', 'lines'];
  const COLORS = ['#fffaf0', '#e6ecd9', '#ecd4ca', '#dbe5ed', '#f5e5b9', '#d9cbb8', '#e4dcf0', '#f9f7f0', '#c8d6bc', '#dfbcb3'];
  const PAPERS = [
    { name: 'Jardim', color: '#dce4cc', pattern: 'plain' },
    { name: 'Bilhete', color: '#faedc9', pattern: 'lines' },
    { name: 'Rosado', color: '#edcfc8', pattern: 'dots' },
    { name: 'Caderno', color: '#dce6ed', pattern: 'grid' },
    { name: 'Kraft', color: '#cfb48f', pattern: 'plain' },
    { name: 'Lavanda', color: '#e4d8e9', pattern: 'dots' }
  ];
  const STICKERS = [
    ['🌸', 'Flor de cerejeira'], ['🌼', 'Margarida'], ['🌻', 'Girassol'], ['🌷', 'Tulipa'],
    ['🌿', 'Folhinha'], ['🍀', 'Trevo'], ['🍃', 'Folhas'], ['🍄', 'Cogumelo'],
    ['🦋', 'Borboleta'], ['🐝', 'Abelha'], ['🐞', 'Joaninha'], ['🐈', 'Gatinho'],
    ['🤍', 'Coração branco'], ['💛', 'Coração amarelo'], ['💌', 'Cartinha'], ['🎀', 'Laço'],
    ['⭐', 'Estrela'], ['✨', 'Brilhinhos'], ['🌙', 'Lua'], ['☀️', 'Sol'],
    ['🍓', 'Morango'], ['🍒', 'Cerejas'], ['🍋', 'Limão'], ['☕', 'Café'],
    ['📷', 'Câmera'], ['🎞️', 'Filme'], ['🎨', 'Paleta'], ['🧸', 'Ursinho'],
    ['🌈', 'Arco-íris'], ['🪻', 'Lavanda'], ['🕊️', 'Pomba'], ['🗝️', 'Chave']
  ];
  const LABELS = { photo: 'Foto', paper: 'Papel', tape: 'Fita', text: 'Texto', sticker: 'Adesivo' };
  const ICONS = { photo: '▧', paper: '▱', tape: '▰', text: 'T', sticker: '✿' };
  let project = blankProject();
  let selectedId = null;
  let zoom = .5;
  let gesture = null;
  let history = [];
  let historyIndex = -1;
  let autosaveTimer;
  let toastTimer;
  let database = null;
  let restoring = true;
  let pendingSave = Promise.resolve();
  const assets = new Map();
  const imageCache = new Map();
  const library = [];

  function blankProject() {
    return {
      version: 1,
      name: 'Um dia para guardar',
      background: '#fffaf0',
      pattern: 'plain',
      items: []
    };
  }

  function uid() {
    return globalThis.crypto?.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function selected() {
    return project.items.find(item => item.id === selectedId);
  }

  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4500);
  }

  function makeItem(type, overrides = {}) {
    return {
      id: uid(),
      type,
      x: 500,
      y: 580,
      w: 330,
      h: 280,
      rotation: 0,
      opacity: 1,
      color: '#dce4cc',
      shadow: true,
      pattern: 'plain',
      ...overrides
    };
  }

  function addItem(item) {
    if (project.items.length >= MAX_ITEMS) {
      toast('Esta página já tem 200 elementos. Exclua alguns antes de adicionar mais.');
      return;
    }
    project.items.push(item);
    selectedId = item.id;
    commit();
  }

  function commit() {
    const snapshot = JSON.stringify(project);
    if (history[historyIndex] !== snapshot) {
      history = history.slice(0, historyIndex + 1);
      history.push(snapshot);
      if (history.length > HISTORY_LIMIT) history.shift();
      historyIndex = history.length - 1;
      scheduleSave();
    }
    refresh();
  }

  function resetHistory() {
    history = [JSON.stringify(project)];
    historyIndex = 0;
    refresh();
  }

  function travelHistory(direction) {
    const next = historyIndex + direction;
    if (next < 0 || next >= history.length) return;
    historyIndex = next;
    project = JSON.parse(history[next]);
    if (!selected()) selectedId = null;
    refresh();
    scheduleSave();
  }

  function refresh() {
    draw();
    syncInspector();
    renderLayers();
    $('projectName').value = project.name;
    $('pageColor').value = project.background;
    $('pagePattern').value = project.pattern;
    $('undo').disabled = historyIndex <= 0;
    $('redo').disabled = historyIndex >= history.length - 1;
    $('itemCount').textContent = `${project.items.length} elementos`;
  }

  function drawPattern(context, pattern, x, y, w, h) {
    if (pattern === 'plain') return;
    context.save();
    context.beginPath();
    context.rect(x, y, w, h);
    context.clip();
    context.strokeStyle = '#52634622';
    context.fillStyle = '#52634630';
    context.lineWidth = 1;
    if (pattern === 'dots') {
      for (let px = x + 12; px < x + w; px += 24) {
        for (let py = y + 12; py < y + h; py += 24) {
          context.beginPath();
          context.arc(px, py, 1.3, 0, Math.PI * 2);
          context.fill();
        }
      }
    } else {
      context.beginPath();
      for (let py = y + 28; py < y + h; py += 28) {
        context.moveTo(x, py);
        context.lineTo(x + w, py);
      }
      if (pattern === 'grid') {
        for (let px = x + 28; px < x + w; px += 28) {
          context.moveTo(px, y);
          context.lineTo(px, y + h);
        }
      }
      context.stroke();
    }
    context.restore();
  }

  function draw(context = ctx, selection = true, transparent = false) {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (!transparent) {
      context.fillStyle = project.background;
      context.fillRect(0, 0, WIDTH, HEIGHT);
      drawPattern(context, project.pattern, 0, 0, WIDTH, HEIGHT);
    }
    for (const item of project.items) drawItem(context, item);
    if (selection && selected()) drawSelection(context, selected());
  }

  function drawItem(context, item) {
    context.save();
    context.translate(item.x, item.y);
    context.rotate(item.rotation * Math.PI / 180);
    context.globalAlpha = item.opacity;
    if (item.shadow) {
      context.shadowColor = '#34312530';
      context.shadowBlur = 13;
      context.shadowOffsetY = 6;
      context.shadowOffsetX = 2;
    }
    const x = -item.w / 2;
    const y = -item.h / 2;
    if (item.type === 'photo') {
      drawPhoto(context, item, x, y);
    } else if (item.type === 'paper') {
      context.fillStyle = item.color;
      context.fillRect(x, y, item.w, item.h);
      context.shadowColor = 'transparent';
      drawPattern(context, item.pattern, x, y, item.w, item.h);
    } else if (item.type === 'tape') {
      drawTape(context, item, x, y);
    } else if (item.type === 'sticker') {
      context.font = `${Math.min(item.w, item.h) * .8}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(item.text, 0, item.h * .03);
    } else if (item.type === 'text') {
      drawText(context, item, x, y);
    }
    context.restore();
  }

  function drawPhoto(context, item, x, y) {
    const border = item.frame === 'none' ? 0 : Math.min(item.w, item.h) * .045;
    const bottom = item.frame === 'polaroid' ? item.h * .17 : border;
    context.fillStyle = '#fffef9';
    context.fillRect(x, y, item.w, item.h);
    context.shadowColor = 'transparent';
    const image = imageCache.get(item.assetId);
    if (!image) return;
    const w = item.w - border * 2;
    const h = item.h - border - bottom;
    const scale = Math.max(w / image.width, h / image.height);
    const sourceW = w / scale;
    const sourceH = h / scale;
    context.drawImage(image,
      (image.width - sourceW) / 2,
      (image.height - sourceH) / 2,
      sourceW, sourceH,
      x + border, y + border, w, h);
  }

  function drawTape(context, item, x, y) {
    context.fillStyle = item.color;
    context.beginPath();
    context.moveTo(x + 6, y);
    context.lineTo(x + item.w, y);
    for (let i = 1; i <= 6; i++) {
      context.lineTo(x + item.w - (i % 2 ? 7 : 0), y + item.h * i / 6);
    }
    context.lineTo(x, y + item.h);
    for (let i = 5; i >= 0; i--) {
      context.lineTo(x + (i % 2 ? 7 : 0), y + item.h * i / 6);
    }
    context.closePath();
    context.fill();
    context.shadowColor = 'transparent';
    drawPattern(context, 'dots', x + 8, y, item.w - 16, item.h);
  }

  function wrapText(context, text, width) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (const char of Array.from(paragraph)) {
        if (line && context.measureText(line + char).width > width) {
          lines.push(line.trimEnd());
          line = char === ' ' ? '' : char;
        } else {
          line += char;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  function drawText(context, item, x, y) {
    context.font = `${item.fontSize}px ${fontLibrary.css(item.font)}`;
    context.fillStyle = item.color;
    context.textBaseline = 'top';
    context.textAlign = 'left';
    const lines = wrapText(context, item.text, item.w);
    context.beginPath();
    context.rect(x, y, item.w, item.h);
    context.clip();
    lines.forEach((line, index) => {
      context.fillText(line, x, y + index * item.fontSize * 1.3);
    });
  }

  function drawSelection(context, item) {
    context.save();
    context.translate(item.x, item.y);
    context.rotate(item.rotation * Math.PI / 180);
    context.strokeStyle = '#5b7050';
    context.fillStyle = '#ffffff';
    context.lineWidth = 1.5 / zoom;
    context.strokeRect(-item.w / 2, -item.h / 2, item.w, item.h);
    const size = 8 / zoom;
    for (const [x, y] of corners(item)) {
      context.fillRect(x - size / 2, y - size / 2, size, size);
      context.strokeRect(x - size / 2, y - size / 2, size, size);
    }
    const handleY = -item.h / 2 - 28 / zoom;
    context.beginPath();
    context.moveTo(0, -item.h / 2);
    context.lineTo(0, handleY);
    context.stroke();
    context.beginPath();
    context.arc(0, handleY, 5 / zoom, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

  function corners(item) {
    return [
      [-item.w / 2, -item.h / 2],
      [item.w / 2, -item.h / 2],
      [item.w / 2, item.h / 2],
      [-item.w / 2, item.h / 2]
    ];
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * WIDTH / rect.width,
      y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
  }

  function localPosition(point, item) {
    const angle = -item.rotation * Math.PI / 180;
    const dx = point.x - item.x;
    const dy = point.y - item.y;
    return {
      x: dx * Math.cos(angle) - dy * Math.sin(angle),
      y: dx * Math.sin(angle) + dy * Math.cos(angle)
    };
  }

  function hitTest(point, item) {
    const local = localPosition(point, item);
    return Math.abs(local.x) <= item.w / 2 && Math.abs(local.y) <= item.h / 2;
  }

  function handleAt(point, item) {
    const local = localPosition(point, item);
    const tolerance = 12 / zoom;
    if (Math.hypot(local.x, local.y + item.h / 2 + 28 / zoom) < tolerance) {
      return 'rotate';
    }
    if (corners(item).some(([x, y]) => Math.hypot(local.x - x, local.y - y) < tolerance)) {
      return 'resize';
    }
    return null;
  }

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || restoring) return;
    const point = pointerPosition(event);
    let item = selected();
    let mode = item ? handleAt(point, item) : null;
    if (!mode) {
      item = [...project.items].reverse().find(candidate => hitTest(point, candidate));
      selectedId = item?.id || null;
      mode = 'move';
    }
    if (item) {
      gesture = { mode, point, original: clone(item) };
      canvas.setPointerCapture(event.pointerId);
    }
    canvas.focus({ preventScroll: true });
    refresh();
  });

  canvas.addEventListener('pointermove', event => {
    const point = pointerPosition(event);
    const item = selected();
    if (!gesture || !item) {
      const handle = item && handleAt(point, item);
      canvas.style.cursor = handle === 'rotate' ? 'crosshair' : handle === 'resize' ? 'nwse-resize' : project.items.some(i => hitTest(point, i)) ? 'move' : 'default';
      return;
    }
    const original = gesture.original;
    if (gesture.mode === 'move') {
      item.x = clamp(original.x + point.x - gesture.point.x, 0, WIDTH);
      item.y = clamp(original.y + point.y - gesture.point.y, 0, HEIGHT);
    } else if (gesture.mode === 'rotate') {
      const start = Math.atan2(gesture.point.y - original.y, gesture.point.x - original.x);
      const current = Math.atan2(point.y - original.y, point.x - original.x);
      let angle = original.rotation + (current - start) * 180 / Math.PI;
      if (event.shiftKey) angle = Math.round(angle / 15) * 15;
      item.rotation = ((angle + 540) % 360) - 180;
    } else {
      const distance = Math.hypot(point.x - original.x, point.y - original.y);
      const initial = Math.hypot(gesture.point.x - original.x, gesture.point.y - original.y);
      const scale = clamp(distance / Math.max(initial, 1), Math.max(30 / original.w, 30 / original.h), Math.min(2000 / original.w, 2400 / original.h));
      item.w = original.w * scale;
      item.h = original.h * scale;
      if (item.type === 'text') item.fontSize = clamp(original.fontSize * scale, 12, 160);
    }
    draw();
    syncInspector();
  });

  function endGesture(cancel = false) {
    if (!gesture) return;
    if (cancel && selected()) Object.assign(selected(), gesture.original);
    gesture = null;
    commit();
  }

  canvas.addEventListener('pointerup', () => endGesture());
  canvas.addEventListener('pointercancel', () => endGesture(true));
  canvas.addEventListener('lostpointercapture', () => endGesture());
  canvas.addEventListener('dblclick', () => {
    if (selected()?.type === 'text') {
      $('editText').focus();
      $('editText').select();
    }
  });

  function syncInspector() {
    const item = selected();
    $('noSelection').hidden = !!item;
    $('selectionControls').hidden = !item;
    if (!item) return;
    $('selectedType').textContent = `${ICONS[item.type]}  ${LABELS[item.type]}`;
    $('textControls').hidden = item.type !== 'text';
    $('frameField').hidden = item.type !== 'photo';
    $('colorField').hidden = ['photo', 'sticker'].includes(item.type);
    const values = {
      editText: item.text || '',
      fontFamily: item.font || 'Georgia',
      fontSize: Math.round(item.fontSize || 32),
      elementColor: item.color,
      elementWidth: Math.round(item.w),
      elementHeight: Math.round(item.h),
      rotation: Math.round(item.rotation),
      opacity: Math.round(item.opacity * 100),
      photoFrame: item.frame || 'polaroid'
    };
    for (const [id, value] of Object.entries(values)) {
      if (document.activeElement !== $(id)) $(id).value = value;
    }
    $('rotationValue').textContent = `${Math.round(item.rotation)}°`;
    $('opacityValue').textContent = `${Math.round(item.opacity * 100)}%`;
    $('elementShadow').checked = item.shadow;
    const index = project.items.indexOf(item);
    $('bringForward').disabled = index === project.items.length - 1;
    $('sendBackward').disabled = index === 0;
  }

  function bindProperty(id, property, convert = value => value) {
    const input = $(id);
    input.addEventListener('input', () => {
      const item = selected();
      if (!item) return;
      const value = convert(input.type === 'checkbox' ? input.checked : input.value);
      if (typeof value === 'number' && !Number.isFinite(value)) return;
      item[property] = value;
      draw();
      $('rotationValue').textContent = `${Math.round(item.rotation)}°`;
      $('opacityValue').textContent = `${Math.round(item.opacity * 100)}%`;
      scheduleSave();
    });
    input.addEventListener('change', commit);
  }

  bindProperty('editText', 'text');
  $('fontFamily').addEventListener('change', async event => {
    const item = selected();
    if (!item) return;
    const name = event.target.value;
    const request = ++fontRequest;
    try {
      await fontLibrary.ensure(name);
      if (request !== fontRequest || !project.items.includes(item)) return;
      item.font = name;
      commit();
    } catch (error) {
      toast(error.message);
      event.target.value = item.font;
    }
  });
  bindProperty('fontSize', 'fontSize', value => clamp(Number(value), 12, 160));
  bindProperty('elementColor', 'color');
  bindProperty('elementWidth', 'w', value => clamp(Number(value), 30, 2000));
  bindProperty('elementHeight', 'h', value => clamp(Number(value), 30, 2400));
  bindProperty('rotation', 'rotation', Number);
  bindProperty('opacity', 'opacity', value => Number(value) / 100);
  bindProperty('photoFrame', 'frame');
  bindProperty('elementShadow', 'shadow');

  function renderLayers() {
    const container = $('layers');
    container.replaceChildren();
    if (!project.items.length) {
      const message = document.createElement('p');
      message.className = 'layers-empty';
      message.textContent = 'Sua página está pronta para receber a primeira ideia.';
      container.append(message);
    }
    [...project.items].reverse().forEach(item => {
      const button = document.createElement('button');
      button.className = `layer${item.id === selectedId ? ' active' : ''}`;
      button.setAttribute('aria-pressed', String(item.id === selectedId));
      const icon = document.createElement('span');
      icon.textContent = ICONS[item.type];
      const label = document.createElement('span');
      label.textContent = item.name || item.text || LABELS[item.type];
      button.append(icon, label);
      button.addEventListener('click', () => {
        selectedId = item.id;
        refresh();
        canvas.focus({ preventScroll: true });
      });
      container.append(button);
    });
  }

  function removeSelected() {
    if (!selected()) return;
    project.items = project.items.filter(item => item.id !== selectedId);
    selectedId = null;
    commit();
  }

  function duplicateSelected() {
    const item = selected();
    if (!item) return;
    addItem({ ...clone(item), id: uid(), x: clamp(item.x + 28, 0, WIDTH), y: clamp(item.y + 28, 0, HEIGHT) });
  }

  function reorder(direction) {
    const index = project.items.findIndex(item => item.id === selectedId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= project.items.length) return;
    [project.items[index], project.items[target]] = [project.items[target], project.items[index]];
    commit();
  }

  function setZoom(value) {
    zoom = clamp(value, .15, 1.5);
    $('canvasWrap').style.width = `${WIDTH * zoom}px`;
    $('canvasWrap').style.height = `${HEIGHT * zoom}px`;
    $('zoomValue').textContent = `${Math.round(zoom * 100)}%`;
    draw();
  }

  function fitPage() {
    const viewport = $('canvasViewport');
    setZoom(Math.min((viewport.clientWidth - 76) / WIDTH, (viewport.clientHeight - 76) / HEIGHT));
  }

  function activateTab(name) {
    document.querySelectorAll('[data-tab]').forEach(button => {
      const active = button.dataset.tab === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      $(`panel-${button.dataset.tab}`).hidden = !active;
    });
  }

  document.querySelectorAll('[data-tab]').forEach((button, index, buttons) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      activateTab(buttons[target].dataset.tab);
      buttons[target].focus();
    });
  });

  function updateFontSelects() {
    for (const id of ['fontFamily', 'fontChoice']) {
      const select = $(id);
      const previous = select.value;
      const query = id === 'fontChoice' ? $('fontSearch').value.trim().toLowerCase() : '';
      select.replaceChildren();
      fontLibrary.families.filter(name => name.toLowerCase().includes(query)).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.append(option);
      });
      if ([...select.options].some(option => option.value === previous)) select.value = previous;
    }
    $('fontCount').textContent = `${fontLibrary.families.length} fontes · adicione outras pelo nome`;
  }

  function setupFontPicker() {
    updateFontSelects();
    $('fontSearch').addEventListener('input', updateFontSelects);
    let previewRequest = 0;
    async function preview(name) {
      const request = ++previewRequest;
      $('fontLoadStatus').textContent = `Carregando ${name}…`;
      try {
        await fontLibrary.ensure(name);
        if (request !== previewRequest) return;
        newTextFont = name;
        $('fontPreview').style.fontFamily = fontLibrary.css(name);
        $('fontLoadStatus').textContent = `Fonte pronta: ${name}`;
      } catch (error) {
        if (request === previewRequest) $('fontLoadStatus').textContent = error.message;
      }
    }
    $('fontChoice').addEventListener('change', event => preview(event.target.value));
    $('applyFont').addEventListener('click', async () => {
      const item = selected();
      if (!item || item.type !== 'text') return toast('Selecione um texto da página para aplicar a fonte.');
      const name = $('fontChoice').value;
      if (!name) return toast('Escolha uma fonte na lista.');
      const request = ++fontRequest;
      try {
        await fontLibrary.ensure(name);
        if (request !== fontRequest || !project.items.includes(item)) return;
        item.font = name;
        commit();
        toast(`Fonte ${name} aplicada.`);
      } catch (error) {
        toast(error.message);
      }
    });
    $('loadCustomFont').addEventListener('click', async () => {
      const name = $('customFont').value.trim();
      if (!fontLibrary.valid(name)) return toast('Digite o nome da família como aparece no Google Fonts.');
      $('loadCustomFont').disabled = true;
      try {
        await fontLibrary.ensure(name);
        fontLibrary.remember(name);
        $('fontSearch').value = '';
        updateFontSelects();
        $('fontChoice').value = name;
        await preview(name);
        toast(`Fonte ${name} disponível para usar.`);
      } catch (error) {
        toast(error.message);
      } finally {
        $('loadCustomFont').disabled = false;
      }
    });
  }

  function buildMaterials() {
    COLORS.forEach(color => {
      const button = document.createElement('button');
      button.className = 'swatch';
      button.style.background = color;
      button.title = `Fundo ${color}`;
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => {
        project.background = color;
        commit();
      });
      $('backgroundPresets').append(button);
    });
    PAPERS.forEach(paper => {
      const button = document.createElement('button');
      button.className = 'paper-sample';
      button.style.backgroundColor = paper.color;
      button.textContent = paper.name;
      button.addEventListener('click', () => addItem(makeItem('paper', { ...paper, rotation: -5 })));
      $('paperPresets').append(button);
    });
    COLORS.slice(1, 7).forEach(color => {
      const button = document.createElement('button');
      button.className = 'tape-sample';
      button.style.backgroundColor = color;
      button.setAttribute('aria-label', `Adicionar fita ${color}`);
      button.addEventListener('click', () => addItem(makeItem('tape', { color, w: 240, h: 62, opacity: .8, rotation: -8, shadow: false })));
      $('tapePresets').append(button);
    });
    STICKERS.forEach(([text, name]) => {
      const button = document.createElement('button');
      button.className = 'sticker-button';
      button.textContent = text;
      button.title = name;
      button.setAttribute('aria-label', `Adicionar ${name}`);
      button.addEventListener('click', () => addItem(makeItem('sticker', { text, name, w: 130, h: 130, shadow: false })));
      $('stickerPresets').append(button);
    });
  }

  async function addText(text, font = newTextFont) {
    if (!text.trim()) {
      toast('Escreva um texto para colocar na página.');
      return;
    }
    try {
      await fontLibrary.ensure(font);
      addItem(makeItem('text', { text, font, fontSize: 42, color: '#46533d', w: 510, h: 230, shadow: false }));
    } catch (error) {
      toast(error.message);
    }
  }

  document.querySelectorAll('[data-text]').forEach(button => {
    button.addEventListener('click', () => addText(button.dataset.text, button.dataset.font));
  });
  $('addText').addEventListener('click', () => addText($('newText').value));

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Não foi possível ler uma das fotos.'));
      image.src = source;
    });
  }

  async function importPhotos(files) {
    if (restoring) return;
    for (const file of files) {
      if (library.length >= MAX_PHOTOS) {
        toast('O limite deste projeto é de 40 fotos.');
        break;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast('Escolha fotos JPG, PNG ou WebP.');
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast(`A foto ${file.name} ultrapassa 15 MB.`);
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const original = await loadImage(url);
        const scale = Math.min(1, 1800 / Math.max(original.width, original.height));
        const buffer = document.createElement('canvas');
        buffer.width = Math.max(1, Math.round(original.width * scale));
        buffer.height = Math.max(1, Math.round(original.height * scale));
        buffer.getContext('2d').drawImage(original, 0, 0, buffer.width, buffer.height);
        const source = buffer.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', .88);
        const assetId = uid();
        assets.set(assetId, { source, name: file.name.slice(0, 120) });
        imageCache.set(assetId, await loadImage(source));
        library.push(assetId);
        addPhoto(assetId);
        renderLibrary();
      } catch (error) {
        toast(error.message);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    $('photoInput').value = '';
  }

  function addPhoto(assetId) {
    const image = imageCache.get(assetId);
    if (!image) return;
    const w = 340;
    const h = clamp(w * image.height / image.width + 60, 190, 550);
    addItem(makeItem('photo', {
      assetId,
      name: assets.get(assetId).name,
      w,
      h,
      frame: 'polaroid',
      rotation: project.items.length % 2 ? -5 : 5
    }));
  }

  function renderLibrary() {
    $('photoLibrary').replaceChildren();
    $('photoCount').textContent = `${library.length} fotos`;
    if (!library.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-library';
      empty.textContent = 'Suas fotos aparecem aqui. Clique para colocar na página.';
      $('photoLibrary').append(empty);
    }
    for (const assetId of library) {
      const asset = assets.get(assetId);
      const button = document.createElement('button');
      button.className = 'photo-thumb';
      button.title = `Adicionar ${asset.name}`;
      const image = document.createElement('img');
      image.src = asset.source;
      image.alt = asset.name;
      button.append(image);
      button.addEventListener('click', () => addPhoto(assetId));
      $('photoLibrary').append(button);
    }
  }

  $('uploadPhotos').addEventListener('click', () => $('photoInput').click());
  $('photoInput').addEventListener('change', event => importPhotos([...event.target.files]));
  let dragDepth = 0;
  $('canvasViewport').addEventListener('dragenter', event => {
    event.preventDefault();
    dragDepth++;
    $('dropOverlay').hidden = false;
  });
  $('canvasViewport').addEventListener('dragover', event => event.preventDefault());
  $('canvasViewport').addEventListener('dragleave', () => {
    dragDepth--;
    if (dragDepth <= 0) $('dropOverlay').hidden = true;
  });
  $('canvasViewport').addEventListener('drop', event => {
    event.preventDefault();
    dragDepth = 0;
    $('dropOverlay').hidden = true;
    importPhotos([...event.dataTransfer.files]);
  });
  window.addEventListener('dragover', event => event.preventDefault());
  window.addEventListener('drop', event => event.preventDefault());

  function serializeProject() {
    return {
      ...clone(project),
      assets: Object.fromEntries(library.map(id => [id, assets.get(id)])),
      library: [...library]
    };
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function filename() {
    return (project.name || 'meu-scrapbook').replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-').slice(0, 80);
  }

  function saveProjectFile() {
    const blob = new Blob([JSON.stringify(serializeProject())], { type: 'application/json' });
    downloadBlob(blob, `${filename()}.scrapbook.json`);
    toast('Projeto preparado para download. Use Abrir para continuar depois.');
  }

  $('saveProject').addEventListener('click', saveProjectFile);
  $('exportImage').addEventListener('click', async () => {
    try {
      await Promise.all(project.items.filter(item => item.type === 'text').map(item => fontLibrary.ensure(item.font)));
    } catch (error) {
      toast(error.message + ' A exportação foi interrompida para preservar a fonte escolhida.');
      return;
    }
    const output = document.createElement('canvas');
    output.width = WIDTH;
    output.height = HEIGHT;
    draw(output.getContext('2d'), false, true);
    output.toBlob(blob => {
      if (!blob) return toast('Não foi possível exportar a imagem.');
      downloadBlob(blob, `${filename()}.png`);
      toast('PNG com fundo transparente pronto, com 1000 × 1200 pixels.');
    }, 'image/png');
  });

  function validColor(value) {
    return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  }

  function validateProject(data) {
    const invalid = () => { throw new Error('Esse arquivo não é um projeto válido deste scrapbook.'); };
    if (!data || data.version !== 1 || !Array.isArray(data.items)) invalid();
    if (data.items.length > MAX_ITEMS || !validColor(data.background)) invalid();
    if (!PATTERNS.includes(data.pattern) || typeof data.name !== 'string') invalid();
    if (!Array.isArray(data.library) || data.library.length > MAX_PHOTOS) invalid();
    if (!data.assets || typeof data.assets !== 'object') invalid();
    const ids = new Set();
    for (const item of data.items) {
      if (!item || !TYPES.includes(item.type) || typeof item.id !== 'string' || ids.has(item.id)) invalid();
      ids.add(item.id);
      const ranges = { x: [0, WIDTH], y: [0, HEIGHT], w: [30, 2000], h: [30, 2400], rotation: [-180, 180], opacity: [.1, 1] };
      for (const [key, [min, max]] of Object.entries(ranges)) {
        if (!Number.isFinite(item[key]) || item[key] < min || item[key] > max) invalid();
      }
      if (!validColor(item.color) || !PATTERNS.includes(item.pattern)) invalid();
      if (typeof item.shadow !== 'boolean') invalid();
      if (item.name !== undefined && (typeof item.name !== 'string' || item.name.length > 120)) invalid();
      if (['text', 'sticker'].includes(item.type) && (typeof item.text !== 'string' || item.text.length > 1000)) invalid();
      if (item.type === 'text' && (!fontLibrary.valid(item.font) || !Number.isFinite(item.fontSize) || item.fontSize < 12 || item.fontSize > 160)) invalid();
      if (item.type === 'photo' && (!data.library.includes(item.assetId) || !['polaroid', 'white', 'none'].includes(item.frame))) invalid();
    }
    if (new Set(data.library).size !== data.library.length) invalid();
    for (const id of data.library) {
      if (typeof id !== 'string' || !Object.hasOwn(data.assets, id)) invalid();
      const asset = data.assets[id];
      if (!asset || typeof asset.source !== 'string' || !/^data:image\/(png|jpeg|webp);base64,/.test(asset.source)) invalid();
      if (asset.source.length > 24000000 || typeof asset.name !== 'string' || asset.name.length > 120) invalid();
    }
    return data;
  }

  async function restoreProject(data) {
    validateProject(data);
    const loaded = new Map();
    for (const id of data.library) loaded.set(id, await loadImage(data.assets[id].source));
    const names = [...new Set(data.items.filter(item => item.type === 'text').map(item => item.font))];
    names.forEach(name => fontLibrary.remember(name));
    updateFontSelects();
    const fontResults = await Promise.allSettled(names.map(name => fontLibrary.ensure(name)));
    if (fontResults.some(result => result.status === 'rejected')) {
      toast('Algumas fontes não carregaram. Conecte-se à internet e reabra o projeto para exibi-las corretamente.');
    }
    assets.clear();
    imageCache.clear();
    library.length = 0;
    for (const id of data.library) {
      assets.set(id, data.assets[id]);
      imageCache.set(id, loaded.get(id));
      library.push(id);
    }
    project = {
      version: 1,
      name: data.name.slice(0, 80),
      background: data.background,
      pattern: data.pattern,
      items: clone(data.items)
    };
    selectedId = null;
    resetHistory();
    renderLibrary();
  }

  $('openProject').addEventListener('click', () => $('projectInput').click());
  $('projectInput').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast('O projeto ultrapassa o limite de 100 MB.');
      event.target.value = '';
      return;
    }
    setBusy(true);
    try {
      await restoreProject(JSON.parse(await file.text()));
      scheduleSave();
      toast('Projeto aberto. Continue de onde parou.');
    } catch (error) {
      toast(error instanceof SyntaxError ? 'O arquivo não contém um projeto JSON válido.' : error.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  });

  function setBusy(value) {
    restoring = value;
    document.querySelectorAll('.studio, .header-actions, .project-heading').forEach(element => {
      element.inert = value;
    });
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('meu-scrapbook', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('projects');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Armazenamento ocupado.'));
    });
  }

  function readDraft() {
    return new Promise((resolve, reject) => {
      const request = database.transaction('projects').objectStore('projects').get('draft');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function writeDraft(data) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction('projects', 'readwrite');
      transaction.objectStore('projects').put(data, 'draft');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  function scheduleSave() {
    clearTimeout(autosaveTimer);
    $('saveStatus').textContent = 'Alterações por salvar…';
    autosaveTimer = setTimeout(persistDraft, 700);
  }

  function persistDraft() {
    if (!database) {
      $('saveStatus').textContent = 'Use Salvar projeto para guardar seu trabalho';
      return;
    }
    const snapshot = serializeProject();
    pendingSave = pendingSave.catch(() => {}).then(async () => {
      try {
        await writeDraft(snapshot);
        $('saveStatus').textContent = 'Rascunho salvo neste navegador';
      } catch {
        $('saveStatus').textContent = 'Sem espaço local — use Salvar projeto';
        toast('Não foi possível guardar o rascunho no navegador. Baixe o projeto para salvar.');
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !restoring) {
      clearTimeout(autosaveTimer);
      persistDraft();
    }
  });

  $('newProject').addEventListener('click', () => $('confirmDialog').showModal());
  $('confirmDialog').addEventListener('close', () => {
    if ($('confirmDialog').returnValue !== 'confirm') return;
    project = blankProject();
    selectedId = null;
    assets.clear();
    imageCache.clear();
    library.length = 0;
    resetHistory();
    renderLibrary();
    scheduleSave();
    toast('Uma página nova para uma nova história.');
  });

  $('projectName').addEventListener('input', event => {
    project.name = event.target.value;
    scheduleSave();
  });
  $('projectName').addEventListener('change', commit);
  $('pageColor').addEventListener('input', event => {
    project.background = event.target.value;
    draw();
  });
  $('pageColor').addEventListener('change', commit);
  $('pagePattern').addEventListener('change', event => {
    project.pattern = event.target.value;
    commit();
  });
  $('undo').addEventListener('click', () => travelHistory(-1));
  $('redo').addEventListener('click', () => travelHistory(1));
  $('delete').addEventListener('click', removeSelected);
  $('duplicate').addEventListener('click', duplicateSelected);
  $('bringForward').addEventListener('click', () => reorder(1));
  $('sendBackward').addEventListener('click', () => reorder(-1));
  $('zoomOut').addEventListener('click', () => setZoom(zoom - .1));
  $('zoomIn').addEventListener('click', () => setZoom(zoom + .1));
  $('fitPage').addEventListener('click', fitPage);

  document.addEventListener('keydown', event => {
    if (restoring || $('confirmDialog').open) return;
    const editing = event.target.matches('input, textarea, select, [contenteditable="true"]');
    if (editing) return;
    const modifier = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    if (modifier && ['z', 'y', 'd', 's'].includes(key)) {
      event.preventDefault();
      if (key === 'z') travelHistory(event.shiftKey ? 1 : -1);
      if (key === 'y') travelHistory(1);
      if (key === 'd') duplicateSelected();
      if (key === 's') saveProjectFile();
      return;
    }
    if (event.key === 'Escape') {
      endGesture(true);
      selectedId = null;
      refresh();
    }
    if (document.activeElement !== canvas) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      removeSelected();
    }
    const movement = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (movement[event.key] && selected()) {
      event.preventDefault();
      const item = selected();
      const step = event.shiftKey ? 10 : 1;
      item.x = clamp(item.x + movement[event.key][0] * step, 0, WIDTH);
      item.y = clamp(item.y + movement[event.key][1] * step, 0, HEIGHT);
      commit();
    }
  });

  function starterPage() {
    project.items = [
      makeItem('paper', { x: 515, y: 590, w: 640, h: 650, color: '#e3e8d5', rotation: -4 }),
      makeItem('paper', { x: 500, y: 590, w: 570, h: 570, color: '#fff9e9', pattern: 'lines', rotation: 2 }),
      makeItem('tape', { x: 495, y: 300, w: 240, h: 64, color: '#e3bdb0', opacity: .8, rotation: -7, shadow: false }),
      makeItem('text', { x: 500, y: 485, w: 460, h: 165, text: 'Pequenas coisas,\ngrandes memórias.', font: 'Georgia', fontSize: 49, color: '#4e6041', rotation: 2, shadow: false }),
      makeItem('text', { x: 490, y: 675, w: 420, h: 150, text: 'Um lugar para guardar os dias\nque merecem ficar.\n\nComece com uma foto sua ♡', font: 'Georgia', fontSize: 25, color: '#7b806b', rotation: 2, shadow: false }),
      makeItem('sticker', { x: 770, y: 815, w: 160, h: 160, text: '🌼', name: 'Margarida', rotation: 15, shadow: false }),
      makeItem('sticker', { x: 215, y: 350, w: 110, h: 110, text: '🌿', name: 'Folhinha', rotation: -25, shadow: false })
    ];
  }

  async function initialize() {
    setBusy(true);
    buildMaterials();
    setupFontPicker();
    starterPage();
    resetHistory();
    fitPage();
    try {
      database = await openDatabase();
      const draft = await readDraft();
      if (draft) {
        await restoreProject(draft);
        $('saveStatus').textContent = 'Seu último rascunho foi recuperado';
      } else {
        $('saveStatus').textContent = 'Pronto para sua primeira memória';
      }
    } catch {
      $('saveStatus').textContent = 'Use Salvar projeto para guardar seu trabalho';
    } finally {
      setBusy(false);
      renderLibrary();
      fitPage();
    }
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitPage, 180);
    });
  }

  initialize();
})();
