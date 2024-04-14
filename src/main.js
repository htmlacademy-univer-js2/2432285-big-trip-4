import Presenter from './presenter/presenter';
import Model from './model/model';
import {EVENTS_LIST} from './presenter/constElements';


const model = new Model();
const presenter = new Presenter({
  container: EVENTS_LIST,
  model
});


presenter.init();
