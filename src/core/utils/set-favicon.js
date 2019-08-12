function setFavIcon(iconURL = '/assets/favicon.png') {
  const favIcon = document.querySelector('link[rel="icon"]');
  favIcon.href = `${iconURL}`;
}

export default setFavIcon;
