import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MenuConditionService {

  private menuCondition: string = localStorage.getItem("menu")

  getMenuCondition() {
    return this.menuCondition
  }
  setMenuCondition(menuCondition: string) {
    this.menuCondition = menuCondition
  }

}
