import { NgModule } from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
// import * as icons from 'angular-tabler-icons/icons';
import {
  IconShoppingCart,
  IconTrash,
  IconUserCircle,
  IconX,
} from 'angular-tabler-icons/icons';
const selectedIcons = {
  IconShoppingCart,
  IconUserCircle,
  IconTrash,
  IconX,
};
@NgModule({
  imports: [TablerIconsModule.pick(selectedIcons)],
  exports: [TablerIconsModule],
})
export class IconsModule {
  constructor() {}
}

// NOTES:
// 1. We add TablerIconsModule to the 'exports', since the <i-tabler> component will be used in templates of parent module
// 2. Pick some icons using TablerIconsModule.pick({ ... })
