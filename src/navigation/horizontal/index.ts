import type { HorizontalNavItems } from '@layouts/types'
import appAndPages from './app-and-pages'
import billing from './billings'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import others from './others'
import todo from './todo'
import uiElements from './ui-elements'

export default [...billing, ...todo, ...dashboard, ...appAndPages, ...uiElements, ...forms, ...charts, ...others] as HorizontalNavItems
