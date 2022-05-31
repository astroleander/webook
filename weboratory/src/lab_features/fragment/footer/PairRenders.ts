type MetaPairRender = (k: string, v: string) => HTMLParagraphElement | null;

export const createNormalSpanPair:MetaPairRender = (k, v) => {
  const p = document.createElement('p');
  const key = document.createElement('span');
  key.className = 'meta-key';
  key.innerHTML = k;
  const value = document.createElement('span');
  value.className = 'meta-value';
  value.textContent = v;
  p.appendChild(key);
  p.appendChild(value);
  return p;    
}

export const createGithubLinkPair:MetaPairRender = (k, v) => {
  if (!v) return null;
  const p = document.createElement('p');
  const key = document.createElement('a');
  const img = document.createElement('img');
  img.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  img.alt = 'Open in GitHub';
  key.append(img, 'Open in GitHub');
  key.className = 'meta-key';
  key.href = v;
  key.target = '_blank';
  p.appendChild(key);
  return p;    
}