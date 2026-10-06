'use strict';

// Biblioteca de fontes: cada família é baixada somente quando utilizada.
window.ScrapbookFonts = (() => {
  const local = ['Georgia', 'Arial', 'cursive', 'monospace'];
  const google = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Inter',
    'Raleway', 'Nunito', 'Nunito Sans', 'Ubuntu', 'Oswald', 'Rubik',
    'Work Sans', 'DM Sans', 'Quicksand', 'Comfortaa', 'Josefin Sans',
    'Bebas Neue', 'Anton', 'Barlow', 'Barlow Condensed', 'Archivo',
    'Archivo Black', 'Fjalla One', 'Abel', 'Asap', 'Varela Round',
    'Exo 2', 'Titillium Web', 'Karla', 'Manrope', 'Outfit', 'Space Grotesk',
    'Playfair Display', 'Merriweather', 'Lora', 'PT Serif', 'Libre Baskerville',
    'Cormorant Garamond', 'EB Garamond', 'Crimson Text', 'Crimson Pro',
    'Bitter', 'Arvo', 'Zilla Slab', 'Bree Serif', 'Roboto Slab', 'Vollkorn',
    'Spectral', 'Cardo', 'Cinzel', 'Bodoni Moda', 'DM Serif Display',
    'DM Serif Text', 'Prata', 'Italiana', 'Old Standard TT', 'Gelasio',
    'Dancing Script', 'Pacifico', 'Caveat', 'Sacramento', 'Satisfy',
    'Great Vibes', 'Allura', 'Parisienne', 'Cookie', 'Courgette',
    'Kalam', 'Patrick Hand', 'Handlee', 'Indie Flower', 'Shadows Into Light',
    'Amatic SC', 'Permanent Marker', 'Architects Daughter', 'Gloria Hallelujah',
    'Reenie Beanie', 'Homemade Apple', 'Nothing You Could Do', 'Rock Salt',
    'Yellowtail', 'Marck Script', 'Bad Script', 'Neucha', 'Coming Soon',
    'Schoolbell', 'Short Stack', 'Covered By Your Grace', 'Just Another Hand',
    'Special Elite', 'Courier Prime', 'Space Mono', 'Roboto Mono',
    'Inconsolata', 'IBM Plex Mono', 'Fira Code', 'Source Code Pro',
    'Lobster', 'Lobster Two', 'Righteous', 'Fredoka', 'Chewy', 'Bangers',
    'Boogaloo', 'Luckiest Guy', 'Passion One', 'Alfa Slab One', 'Patua One',
    'Abril Fatface', 'Fascinate', 'Monoton', 'Press Start 2P', 'VT323',
    'Orbitron', 'Audiowide', 'Teko', 'Russo One', 'Black Ops One',
    'UnifrakturCook', 'UnifrakturMaguntia', 'Pirata One', 'Metal Mania',
    'Creepster', 'Nosifer', 'Eater', 'Rye', 'Fredericka the Great',
    'Noto Sans', 'Noto Serif', 'Noto Sans KR', 'Noto Serif KR',
    'Nanum Gothic', 'Nanum Myeongjo', 'Gaegu', 'Gamja Flower',
    'Black Han Sans', 'Do Hyeon', 'Jua', 'Single Day'
  ];
  const families = [...local, ...google.sort((a, b) => a.localeCompare(b))];
  const pending = new Map();

  function valid(name) {
    return typeof name === 'string' && /^[A-Za-z][A-Za-z0-9 -]{0,79}$/.test(name);
  }

  function css(name) {
    return local.includes(name) ? name : `"${name}", sans-serif`;
  }

  function ensure(name) {
    if (!valid(name)) return Promise.reject(new Error('Nome de fonte inválido.'));
    if (local.includes(name)) return Promise.resolve();
    if (pending.has(name)) return pending.get(name);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}&display=swap`;
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`A fonte ${name} demorou para carregar. Verifique a conexão e tente novamente.`)), 15000);
      link.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Não foi possível carregar ${name}. Confira o nome no Google Fonts e sua conexão.`));
      };
      link.onload = async () => {
        try {
          const faces = await document.fonts.load(`32px "${name}"`);
          if (!faces.length) throw new Error(`A fonte ${name} não está disponível.`);
          clearTimeout(timeout);
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };
      document.head.append(link);
    }).catch(error => {
      pending.delete(name);
      link.remove();
      throw error;
    });
    pending.set(name, promise);
    return promise;
  }

  function remember(name) {
    if (valid(name) && !families.includes(name)) families.push(name);
  }

  return { families, valid, css, ensure, remember };
})();
