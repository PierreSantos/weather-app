import { WeatherDatas } from 'src/app/models/interfaces/WeatherDatas';
import { WeatherService } from './../../services/weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather-home',
  templateUrl: './weather-home.component.html',
  styleUrls: []
})
export class WeatherHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();

  lat: number = 0;
  lon: number = 0;
  cityName = '';
  weatherDatas!: WeatherDatas;
  searchIcon = faMagnifyingGlass;

  constructor(private weatherService: WeatherService) {}


  ngOnInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      this.getGeolocalization(this.lat, this.lon);
     });
    }
   else {
    alert("Geolocation is not supported by this browser.");
    }
   }

   getGeolocalization(latitude: number, Longitude: number): void {
    this.weatherService.getGeolocalization(latitude, Longitude)
    .pipe(takeUntil(this.destroy$))
    .subscribe ({
      next: (response) => {
        response && (this.weatherDatas = response);
        console.log(this.weatherDatas)
        this.cityName = this.weatherDatas.name;
      },
      error: (error) => console.log(error),
    })
  }

  getWeatherDatas(cityName: string): void {
    this.weatherService.getWeatherDatas(cityName)
    .pipe(takeUntil(this.destroy$))
    .subscribe ({
      next: (response) => {
        response && (this.weatherDatas = response);
        console.log(this.weatherDatas)
      },
      error: (error) => console.log(error),
    })
  }

  onSubmit(): void {
    this.getWeatherDatas(this.cityName);
    this.cityName = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
