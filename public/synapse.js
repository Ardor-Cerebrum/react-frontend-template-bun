(function() {
  const BRIDGE_VERSION = '2.3.0';
  console.log(`[Ardor Synapse] Initializing v${BRIDGE_VERSION}...`);

  // --- Constants & State ---
  const ARDOR_ID_ATTR = 'data-ardor-id';
  let nextId = 1;
  let inspectorEnabled = false;
  let overlay = null;
  let resizeObserver = null;

  // --- Init Overlay ---
  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'ardor-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      pointerEvents: 'none',
      background: 'rgba(59, 130, 246, 0.2)',
      border: '2px solid #3b82f6',
      zIndex: '999999',
      display: 'none',
      transition: 'all 0.05s ease',
      boxSizing: 'border-box'
    });

    document.body.appendChild(overlay);
  }

  // --- Communication (v2.1.2 Protocol) ---
  function sendMessage(event, data) {
    window.parent.postMessage({
      type: 'ARDOR_BRIDGE',
      event: event,
      data: data
    }, '*');
  }

  // --- Helpers ---
  function ensureArdorId(el) {
    if (!el) return null;
    if (!el.hasAttribute(ARDOR_ID_ATTR)) {
      el.setAttribute(ARDOR_ID_ATTR, `el-${nextId++}`);
    }
    return el.getAttribute(ARDOR_ID_ATTR);
  }

  function getComputedStyles(el) {
    const style = window.getComputedStyle(el);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      padding: style.padding,
      margin: style.margin,
      display: style.display,
      flexDirection: style.flexDirection,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems,
      width: style.width,
      height: style.height,
      border: style.border,
      borderRadius: style.borderRadius
    };
  }

  function updateOverlayPosition(el) {
    if (!overlay) createOverlay();
    if (!el || !el.getBoundingClientRect) {
      overlay.style.display = 'none';
      return;
    }
    const rect = el.getBoundingClientRect();
    Object.assign(overlay.style, {
      display: 'block',
      top: (rect.top + window.scrollY) + 'px',
      left: (rect.left + window.scrollX) + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px'
    });
  }

  // --- Features ---

  // 1. Handshake
  function sendHandshake() {
    sendMessage('BRIDGE_READY', {
      version: BRIDGE_VERSION,
      features: ['AUTO_HEIGHT', 'DOM_TREE', 'INSPECTOR', 'STYLE_EDITING', 'CONSOLE', 'NETWORK']
    });
  }

  // 2. Auto-Height
  function sendHeight() {
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
    );
    sendMessage('RESIZE', { height });
  }

  // 3. DOM Tree
  function getSerializedTree(root = document.body) {
    const serialize = (el) => {
      if (el.id === 'ardor-overlay' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return null;
      const id = ensureArdorId(el);
      const node = {
        id: id,
        tagName: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : '',
        children: []
      };
      for (const child of el.children) {
        const serializedChild = serialize(child);
        if (serializedChild) node.children.push(serializedChild);
      }
      return node;
    };
    return serialize(root);
  }

  function sendDOMTree() {
    sendMessage('DOM_TREE_UPDATE', getSerializedTree());
  }

  // 4. DevTools Capture (New Feature)
  const originalConsole = { log: console.log, warn: console.warn, error: console.error, info: console.info };
  function proxyConsole(method) {
    console[method] = function(...args) {
      originalConsole[method].apply(console, args);
      const safeArgs = args.map(arg => {
        try { return typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg); }
        catch (e) { return '[Circular]'; }
      });
      sendMessage('CONSOLE_LOG', { level: method, timestamp: Date.now(), args: safeArgs });
    };
  }
  ['log', 'warn', 'error', 'info'].forEach(proxyConsole);

  window.addEventListener('error', e => sendMessage('CONSOLE_LOG', { level: 'error', timestamp: Date.now(), args: [`Uncaught: ${e.message}`, `@ ${e.filename}:${e.lineno}`] }));
  window.addEventListener('unhandledrejection', e => sendMessage('CONSOLE_LOG', { level: 'error', timestamp: Date.now(), args: [`Unhandled Rejection: ${e.reason}`] }));

  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const start = Date.now();
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    const method = args[1]?.method || 'GET';
    try {
      const res = await originalFetch.apply(window, args);
      sendMessage('NETWORK_LOG', { type: 'fetch', url, method, status: res.status, duration: Date.now() - start });
      return res;
    } catch (err) {
      sendMessage('NETWORK_LOG', { type: 'fetch', url, method, status: 'failed', error: err.message, duration: Date.now() - start });
      throw err;
    }
  };


  // --- Interaction Handlers ---

  function handleMouseOver(e) {
    if (!inspectorEnabled) return;
    e.stopPropagation();
    const el = e.target;
    if (el === document.body || el === document.documentElement || el.id === 'ardor-overlay') return;
    updateOverlayPosition(el);
  }

  function handleClick(e) {
    if (!inspectorEnabled) return;
    const el = e.target;
    if (el === document.body || el === document.documentElement || el.id === 'ardor-overlay') return;

    e.preventDefault();
    e.stopPropagation();

    const id = ensureArdorId(el);
    const rect = el.getBoundingClientRect();
    const sourceFile = el.getAttribute('data-source-file') || 'Unknown';
    const lineNumber = el.getAttribute('data-source-line') || '0';

    updateOverlayPosition(el);

    sendMessage('ELEMENT_SELECTED', {
      id: id,
      tagName: el.tagName.toLowerCase(),
      className: typeof el.className === 'string' ? el.className : '',
      innerText: el.innerText ? el.innerText.slice(0, 50) : '',
      rect: { width: rect.width, height: rect.height },
      styles: getComputedStyles(el),
      source: { fileName: sourceFile, lineNumber: lineNumber }
    });

    // If standalone (no parent listener), log to console for demo
    if (window.self === window.top) {
      console.log('[Ardor Peek]', { tagName: el.tagName, sourceFile, lineNumber });
    }
  }

  function toggleInspector(enabled) {
    inspectorEnabled = enabled;
    createOverlay();

    if (enabled) {
      document.body.style.cursor = 'crosshair';
      document.addEventListener('mouseover', handleMouseOver, true);
      document.addEventListener('click', handleClick, true);
    } else {
      document.body.style.cursor = '';
      overlay.style.display = 'none';
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('click', handleClick, true);
    }

    // Notify Toolbar (if present in the same window)
    window.dispatchEvent(new CustomEvent('ardor-inspector-change', {
      detail: { enabled: enabled }
    }));

    console.log('[Ardor Bridge] Inspector:', enabled);
  }

  // --- Public API (for Toolbar) ---
  window.__ARDOR__ = {
    toggleInspector: toggleInspector
  };

  // --- Initialization ---

  resizeObserver = new ResizeObserver(sendHeight);
  resizeObserver.observe(document.body);

  const mutationObserver = new MutationObserver(() => {
    sendDOMTree();
    sendHeight();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

  window.addEventListener('load', () => {
    createOverlay();
    sendHandshake();
    sendHeight();
    sendDOMTree();
  });

  // --- Global Keyboard Shortcuts ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inspectorEnabled) {
      toggleInspector(false);
    }
  });

  setInterval(sendHandshake, 3000);
  setInterval(sendHeight, 1000);

  // --- Control Listener ---
  window.addEventListener('message', (event) => {
    const { type, action, data } = event.data || {};
    // Fallback for newer protocol (just in case)
    const legacyType = type === 'ARDOR_BRIDGE_CONTROL' ? action : (event.data.type || event.data.event);

    if (type !== 'ARDOR_BRIDGE_CONTROL' && !event.data.action) return;

    // Normalize action
    const safeAction = action || legacyType;

    switch (safeAction) {
      case 'TOGGLE_INSPECTOR':
        toggleInspector(data ? data.enabled : event.data.enabled);
        break;

      case 'HIGHLIGHT_NODE':
        const targetId = data ? data.id : event.data.id;
        const target = document.querySelector(`[${ARDOR_ID_ATTR}="${targetId}"]`);
        if (target) {
            updateOverlayPosition(target);
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Sync properties panel
            const id = ensureArdorId(target);
            const rect = target.getBoundingClientRect();
            const sourceFile = target.getAttribute('data-source-file') || 'Unknown';
            sendMessage('ELEMENT_SELECTED', {
                id: id,
                tagName: target.tagName.toLowerCase(),
                className: target.className,
                innerText: target.innerText ? target.innerText.slice(0, 50) : '',
                rect: { width: rect.width, height: rect.height },
                styles: getComputedStyles(target),
                source: { fileName: sourceFile }
            });
        }
        break;

      case 'UPDATE_STYLE':
        const styleData = data || event.data;
        const styleEl = document.querySelector(`[${ARDOR_ID_ATTR}="${styleData.id}"]`);
        if (styleEl) {
          styleEl.style[styleData.property] = styleData.value;
          updateOverlayPosition(styleEl);
        }
        break;

      case 'PING':
        sendHandshake();
        break;
    }
  });

})();
