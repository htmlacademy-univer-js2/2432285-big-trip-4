import {render, RenderPosition} from './render';
import Presenter from './presenter/presenter';

import InfoView from "./view/info-view.js";
import FiltersView from "./view/filters-view.js";
import Model from './model/model';


const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const siteListFilter = headerElement.querySelector('.trip-controls__filters');
const tripMain = headerElement.querySelector('.trip-main');
const eventsList = bodyElement.querySelector('.trip-events');

const model = new Model();
const presenter = new Presenter({
  container: eventsList,
  model
});


render(new InfoView(), tripMain, RenderPosition.AFTERBEGIN);
render(new FiltersView(), siteListFilter);

presenter.init();
