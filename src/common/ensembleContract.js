// Helpers for reading the ensemble analysis contract (v1).

export function indexIncumbentsByName(ensemble) {
  const list = ensemble?.metrics?.by_incumbent;
  if (!Array.isArray(list)) return {};
  const byName = {};
  for (const bundle of list) byName[bundle.name] = bundle;
  return byName;
}
