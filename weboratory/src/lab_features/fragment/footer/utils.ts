export const generateMetaRecordsFooter = (records: Record<string, string>) => {
  return Object.keys(records).map(meta_name => {
    const p = document.createElement('p');
    const key = document.createElement('span');
    key.className = 'meta-key';
    key.innerHTML = meta_name;
    const value = document.createElement('span');
    value.className = 'meta-value';
    value.textContent = records[meta_name];
    p.appendChild(key);
    p.appendChild(value);
    return p;
  })
};