export interface Plant {
  id: number;
  name: string;
  location: string;
  plant_type: string;
  watering: number;
  fertilizing: number | 'never';
  image: string;

}
