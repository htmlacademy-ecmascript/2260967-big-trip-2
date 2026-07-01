import PointSortView from '../view/point-sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointListPresenter {
  PointSortComponent = new PointSortView();
  PointListViewComponent = new PointListView();

  constructor(container) {
    this.container = container;
  }

  init(){
    render(this.PointSortComponent, this.container);
    render(this.PointListViewComponent, this.container);

    render(new PointEditView(), this.PointListViewComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.PointListViewComponent.getElement());
    }
  }
}
