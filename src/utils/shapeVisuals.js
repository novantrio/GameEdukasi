// Geometric artwork for the matching activity. Shapes are drawn from their
// actual outlines so a name never points to an unrelated emoji.
const aliases = {
  'side-3': 'triangle',
  'side-4': 'square',
  'side-5': 'pentagon',
  'side-6': 'hexagon'
};

const artwork = {
  circle: '<circle cx="50" cy="50" r="35"/>',
  oval: '<ellipse cx="50" cy="50" rx="39" ry="28"/>',
  square: '<rect x="18" y="18" width="64" height="64" rx="5"/>',
  rectangle: '<rect x="11" y="27" width="78" height="46" rx="5"/>',
  triangle: '<polygon points="50,12 90,82 10,82"/>',
  diamond: '<polygon points="50,8 90,50 50,92 10,50"/>',
  rhombus: '<polygon points="50,8 90,50 50,92 10,50"/>',
  trapezoid: '<polygon points="31,20 69,20 90,80 10,80"/>',
  parallelogram: '<polygon points="33,20 91,20 67,80 9,80"/>',
  pentagon: '<polygon points="50,10 89,39 74,86 26,86 11,39"/>',
  hexagon: '<polygon points="29,12 71,12 92,50 71,88 29,88 8,50"/>',
  star: '<polygon points="50,7 62,36 94,38 69,58 77,90 50,72 23,90 31,58 6,38 38,36"/>',
  heart: '<path d="M50 86L17 55Q3 42 12 25Q22 7 40 20L50 30L60 20Q78 7 88 25Q97 42 83 55Z"/>',
  cube: '<polygon points="50,10 84,29 50,48 16,29" opacity=".7"/><polygon points="16,29 50,48 50,88 16,68"/><polygon points="84,29 50,48 50,88 84,68" opacity=".82"/>',
  cylinder: '<rect x="18" y="29" width="64" height="48"/><ellipse cx="50" cy="29" rx="32" ry="12" opacity=".7"/><path d="M18 77Q50 94 82 77" fill="none" stroke="currentColor" stroke-width="5"/>',
  cone: '<path d="M50 12L84 78H16Z"/><ellipse cx="50" cy="78" rx="34" ry="10" opacity=".7"/>',
  sphere: '<circle cx="50" cy="50" r="36"/><ellipse cx="40" cy="34" rx="13" ry="8" fill="white" opacity=".32"/>'
};

export function renderShapeVisual(item) {
  const shape = item.shape || aliases[item.id] || item.id;
  const drawing = artwork[shape];
  if (!drawing) return item.emoji || '';
  const color = item.color || '#54a6a5';
  return `<svg class="shape-visual" viewBox="0 0 100 100" role="img" aria-label="${item.name}" style="color:${color}" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor">${drawing}</g></svg>`;
}
