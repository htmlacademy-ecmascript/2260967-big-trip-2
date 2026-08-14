import PointEditView from '../view/point-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, DEFAULT_POINT_TYPE } from '../const.js';
import { isEscapeKey } from '../utils.js';

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;

function createBlankPoint() {
  const now = new Date();
  const later = new Date(now.getTime() + MILLISECONDS_IN_HOUR);

  return {
    type: DEFAULT_POINT_TYPE,
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

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#handleDestroy();
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
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}

