import {render, replace} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class PointPresenter {
  #mode = 'default';
  #container = null;
  #point = null;
  #onDataChange = null;
  #onModeChange = null;
  #pointComponent = null;
  #pointEditComponent = null;

  constructor({container, point, onDataChange, onModeChange}) {
    this.#container = container;
    this.#point = point;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point = this.#point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new EventView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EventEditView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === 'default') {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === 'edit') {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    prevPointComponent.element.remove();
    prevPointEditComponent.element.remove();
  }

  destroy() {
    if (this.#pointComponent) {
      this.#pointComponent.element.remove();
      this.#pointComponent.removeElement();
    }
    if (this.#pointEditComponent) {
      this.#pointEditComponent.element.remove();
      this.#pointEditComponent.removeElement();
    }
  }

  resetView() {
    if (this.#mode !== 'default') {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = 'edit';
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = 'default';
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleCancelClick = () => {
    this.#replaceFormToPoint();
  };
}
