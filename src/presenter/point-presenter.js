import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class PointPresenter {
  #container = null;
  #point = null;
  #destinations = [];
  #offers = [];
  #eventView = null;
  #eventEditView = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #handleDeleteClick = null;

  constructor({ container, point, destinations, offers, onDataChange, onModeChange, onDeleteClick }) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations || [];
    this.#offers = offers || [];
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleDeleteClick = onDeleteClick;
  }

  init(point) {
    this.#point = point;

    const prevEventView = this.#eventView;
    const prevEventEditView = this.#eventEditView;

    this.#eventView = new EventView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick
    });

    this.#eventEditView = new EventEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevEventView === null || prevEventEditView === null) {
      render(this.#eventView, this.#container);
      return;
    }

    if (this.#container.contains(prevEventView.element)) {
      replace(this.#eventView, prevEventView);
    }

    if (this.#container.contains(prevEventEditView.element)) {
      replace(this.#eventEditView, prevEventEditView);
    }

    remove(prevEventView);
    remove(prevEventEditView);
  }

  destroy() {
    remove(this.#eventView);
    remove(this.#eventEditView);
  }

  resetView() {
    if (this.#eventEditView) {
      this.#eventEditView.reset(this.#point);
    }
  }

  #handleEditClick = () => {
    this.#handleModeChange();
    this.#replaceEventToEdit();
  };

  #handleCancelClick = () => {
    this.#eventEditView.reset(this.#point);
    this.#replaceEditToEvent();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
    this.#replaceEditToEvent();
  };

  #replaceEventToEdit() {
    replace(this.#eventEditView, this.#eventView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditToEvent() {
    replace(this.#eventView, this.#eventEditView);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditView.reset(this.#point);
      this.#replaceEditToEvent();
    }
  };
}
