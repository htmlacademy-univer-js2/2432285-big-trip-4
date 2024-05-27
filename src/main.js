import Presenter from './presenter/presenter';
import Model from './model/model';
import {EVENTS_LIST} from './presenter/const-elements';
import TripApiService from './api-service/api-service';
import {AUTHORIZATION, END_POINT} from './const';


const model = new Model({pointsApiService: new TripApiService(END_POINT, AUTHORIZATION)});
const presenter = new Presenter({
  container: EVENTS_LIST,
  model
});


presenter.init();
model.init();
