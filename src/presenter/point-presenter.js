import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;

  #mode = Mode.DEFAULT;

  constructor(pointListContainer, pointsModel, onDataChange, onModeChange) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByIds(point.offers);
    const allTypeOffers = this.#pointsModel.getOffersByType(point.type);
    const allDestinations = this.#pointsModel.destinations;

    this.#pointComponent = new PointView(
      point,
      destination,
      offers,
      () => this.#replacePointToForm(),
      () => this.#handleFavoriteClick(),
    );

    this.#pointEditComponent = new PointEditView(
      point,
      destination,
      allTypeOffers,
      allDestinations,
      () => this.#replaceFormToPoint(),
    );

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    this.#handleModeChange();
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }
}
