export const genRandom = (no = 6) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < no; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
