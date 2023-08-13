import type { NavGroup, NavLink, NavLinkProps } from '@layouts/types'
import type { Router } from 'vue-router'

export const openGroups = ref<string[]>([])

/**
 * Return nav link props to use
 * @param {Object, String} item navigation routeName or route Object provided in navigation data
 */
export const getComputedNavLinkToProp = computed(() => (link: NavLink) => {
  const props: NavLinkProps = {
    target: link.target,
    rel: link.rel,
  }

  // If route is string => it assumes string is route name => Create route object from route name
  // If route is not string => It assumes it's route object => returns passed route object
  if (link.to)
    props.to = typeof link.to === 'string' ? { name: link.to } : link.to
  else props.href = link.href

  return props
})

/**
 * Return route name for navigation link
 * If link is string then it will assume it is route-name
 * IF link is object it will resolve the object and will return the link
 * @param {Object, String} link navigation link object/string
 */
export const resolveNavLinkRouteName = (link: NavLink, router: Router) => {
  if (!link.to)
    return null

  if (typeof link.to === 'string')
    return link.to

  return router.resolve(link.to).name
}

/**
 * Check if nav-link is active
 * @param {Object} link nav-link object
 */
export const isNavLinkActive = (link: NavLink, router: Router) => {
  // Matched routes array of current route
  const matchedRoutes = router.currentRoute.value.matched

  // Check if provided route matches route's matched route
  const resolveRoutedName = resolveNavLinkRouteName(link, router)

  if (!resolveRoutedName)
    return false

  return matchedRoutes.some(route => {
    return route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName
  })
}

/**
 * Check if nav group is active
 * @param {Array} children Group children
 */
export const isNavGroupActive = (children: (NavLink | NavGroup)[], router: Router): boolean =>
  children.some(child => {
    // If child have children => It's group => Go deeper(recursive)
    if ('children' in child)
      return isNavGroupActive(child.children, router)

    // else it's link => Check for matched Route
    return isNavLinkActive(child, router)
  })

/**
 * Convert Hex color to rgb
 * @param hex
 */

export const hexToRgb = (hex: string) => {
// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

  hex = hex.replace(shorthandRegex, (m: string, r: string, g: string, b: string) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null
}

export const registerLog = (message: string, pageOrFunction: string, type: "error" | "warning" | "info" | "success") => {
  console.log(`Registro de log '${pageOrFunction}', ${type}: ${message}`);
}

export const getMonetaryValue = (value: number): string => {
  // TODO: colocar o Símbolos monetários de acordo com a configuração que o cliente optar;
  return `R$ ${value}`;
}

export const formatDate = (date: Date, dateTime: boolean = true, tracking: string = "formatDate"): string => {
  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  if(dateTime) {
    options = {
      ...options,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }
  }

  // const formattedDateIntl = new Intl.DateTimeFormat('en-US', options).format(date);
  // const formattedDateEU = new Intl.DateTimeFormat('eu', options).format(date);
  // const formattedDateUK = new Intl.DateTimeFormat('en-GB', options).format(date);
  try {
    // TODO: colocar o formato da data de acordo com a configuração que o cliente optar;
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formattedDate;
  } catch(e: any) {
    registerLog(e.message, tracking, "error");
    return "";
  }
}
