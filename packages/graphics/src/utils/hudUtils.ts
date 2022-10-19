/**
 * Create a HUD with binding canvas
 * @param element
 * @param list
 * @returns 
 */
export const initOptions: (
  hud: HTMLDivElement,
  list: Array<[(canvas?: HTMLCanvasElement) => void, string?]>,
  groupname: string | null,
) => void = (hud, list, groupname) => {
  initHUD(hud);

  const container = document.createElement('div');
  const title = document.createElement('h1');
  title.classList.add('graphics-ops-title');
  groupname && (title.innerHTML = groupname);
  container.appendChild(title);

  for (const [handler, name] of list) {
    const ops = document.createElement('botton');
    ops.className = 'graphics-ops-button';
    ops.innerHTML = name ? name : 'unknown function';
    ops.onclick = (e) => handler();

    container.appendChild(ops);
  }
  hud.appendChild(container);
  return;
}

type Mat4Updater = (newMatrix: number[][]) => void
export const initMat4: (
  hud: HTMLDivElement,
  mat4data: number[][]
) => Mat4Updater = (hud, mat4data) => {
  initHUD(hud);

  const container = document.createElement('div');
  container.className = 'martix-4-container';
  const leftBracket = document.createElement('div');
  leftBracket.className = 'left-bracket';
  const rightBracket = document.createElement('div');
  rightBracket.className = 'right-bracket';
  const cells = new Array(16);
  mat4data.forEach((row, i) => {
    row.forEach((col, j) => {
      const cell = document.createElement('div');
      cell.setAttribute('martix', `c${i + 1}${j + 1}`);
      cell.innerHTML = mat4data[i][j].toFixed(1);
      cells[i * row.length + j] = cell;
    })
  });
  container.append(leftBracket, rightBracket, ...cells);
  hud.appendChild(container);

  return function updateMat4(newMartrix) {
    newMartrix.forEach((row, i) => {
      row.forEach((col, j) => {
        cells[i * row.length + j].innerHTML = newMartrix[i][j].toFixed(1);
      })
    });
  };
}

const initHUD: (element: HTMLDivElement) => void = (element) => {
  element.className = 'graphics-ops-container';
}