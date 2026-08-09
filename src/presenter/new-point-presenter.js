import PointEditView from '../view/point-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';


function createBlankPoint() {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);

  return {
    type: 'flight',
    destination: null,
    dateFrom: now.toISOString(),
    dateTo: later.toISOString(),
    basePrice: 0,
    offers: [],
    isFavorite: false,
  };
}

export default class NewPointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor(pointListContainer, pointsModel, onDataChange, onDestroy) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    const blankPoint = createBlankPoint();
    const allDestinations = this.#pointsModel.destinations;
    const allOffers = this.#pointsModel.offers;

    this.#pointEditComponent = new PointEditView(
      blankPoint,
      allDestinations,
      allOffers,
      this.#handleFormSubmit,
      this.#handleCancelClick,
      null,
      true,
    );

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
