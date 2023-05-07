import type { HorizontalNavItems } from '@layouts/types'
import appAndPages from './app-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import others from './others'
import todo from './todo'
import uiElements from './ui-elements'

export default [...todo, ...dashboard, ...appAndPages, ...uiElements, ...forms, ...charts, ...others] as HorizontalNavItems
