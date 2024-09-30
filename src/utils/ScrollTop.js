export default function scrollToTop() {
  // Comprueba si document.documentElement (estándar) es compatible
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  } else {
    // Si no, utiliza document.body (compatible con algunos navegadores más antiguos)
    document.body.scrollTop = 0;
  }
}
