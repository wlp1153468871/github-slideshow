/**
 * download file by url
 * @param {String} url download url
 */
export default function downlaodFile(url) {
  const iframe = document.createElement('iframe');
  iframe.style.visibility = 'hidden';
  iframe.style.width = 0;
  iframe.style.height = 0;
  iframe.src = url;
  iframe.onload = () => {
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 10e3);
  };
  document.body.appendChild(iframe);
}
