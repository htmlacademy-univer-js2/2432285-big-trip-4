import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
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

  async addPoint(routePoint) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(routePoint, true)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    await this._load({
      url: `points/${pointId}`,
      method: Method.DELETE,
    });
  }

  #adaptToServer(routePoint, isAddition = false) {
    const adaptedPoint = {
      ...routePoint,
      ['base_price']: routePoint.basePrice,
      ['date_from']: new Date(routePoint.dateFrom).toISOString(),
      ['date_to']: new Date(routePoint.dateTo).toISOString(),
      ['is_favorite']: routePoint.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    if (isAddition) {
      delete adaptedPoint.id;
    }

    return adaptedPoint;
  }
}
