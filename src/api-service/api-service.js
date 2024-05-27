import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class TripApiService extends ApiService {

  get routePoints() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async updatePoint(routePoint) {
    const response = await this._load({
      url: `points/${routePoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(routePoint) {
    const adaptedPoint = {
      ['id']: routePoint.id,
      ['base_price']: routePoint.basePrice,
      ['date_from']: routePoint.dateFrom instanceof Date ? routePoint.dateFrom.toISOString() : null,
      ['date_to']: routePoint.dateTo instanceof Date ? routePoint.dateTo.toISOString() : null,
      ['destination']: routePoint.destination,
      ['is_favorite']: routePoint.isFavorite,
      ['offers']: routePoint.offers,
      ['type']: routePoint.type
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    return adaptedPoint;
  }
}
