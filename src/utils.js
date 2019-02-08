export function warn(...args) {
  if (console && console.warn) {
    if (typeof args[0] === 'string') args[0] = `react-i18next:: ${args[0]}`;
    console.warn.apply(null, args);
  }
}

const alreadyWarned = {};
export function warnOnce(...args) {
  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn(...args);
}

export function deprecated(...args) {
  if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
    if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
    warnOnce(...args);
  }
}

export function hasLoadedNamespace(ns, i18n) {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce('i18n.languages were undefined or empty', i18n.languages);
    return true;
  }

  const lng = i18n.languages[0];
  const fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
  const lastLng = i18n.languages[i18n.languages.length - 1];

  const loadNotPending = (l, n) => (i18n.services.backendConnector.state[`${l}|${n}`] || 0) !== 1;

  // loaded -> SUCCESS
  if (i18n.hasResourceBundle(lng, ns)) return true;

  // were not loading at all -> SEMI SUCCESS
  if (!i18n.services.backendConnector.backend) return true;

  // failed loading ns - but at least fallback is not pending -> SEMI SUCCESS
  if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;

  return false;
}
